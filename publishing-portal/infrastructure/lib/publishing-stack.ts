import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayv2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import * as path from 'path';

export class PublishingStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const environment = 'prod';
        const projectName = 'satspace';

        // ========================================
        // S3 Buckets
        // ========================================

        // Frontend bucket for static website files
        const frontendBucket = new s3.Bucket(this, 'FrontendBucket', {
            bucketName: `${projectName}-frontend-${environment}`,
            encryption: s3.BucketEncryption.S3_MANAGED,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            autoDeleteObjects: false,
        });

        // Content bucket for posts, images, and index
        const contentBucket = new s3.Bucket(this, 'ContentBucket', {
            bucketName: `${projectName}-content-${environment}`,
            encryption: s3.BucketEncryption.S3_MANAGED,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            autoDeleteObjects: false,
            cors: [
                {
                    allowedMethods: [s3.HttpMethods.GET],
                    allowedOrigins: ['*'], // Will be restricted by CloudFront in production
                    allowedHeaders: ['*'],
                },
            ],
        });

        // ========================================
        // Lambda Functions
        // ========================================

        // GetPosts Lambda
        const getPostsLambda = new lambda.Function(this, 'GetPostsFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'get-posts.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend/dist')),
            environment: {
                CONTENT_BUCKET: contentBucket.bucketName,
                INDEX_KEY: 'posts-index.json',
            },
            timeout: cdk.Duration.seconds(10),
            memorySize: 256,
        });

        // GetPostBySlug Lambda
        const getPostBySlugLambda = new lambda.Function(this, 'GetPostBySlugFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'get-post-by-slug.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend/dist')),
            environment: {
                CONTENT_BUCKET: contentBucket.bucketName,
            },
            timeout: cdk.Duration.seconds(10),
            memorySize: 256,
        });

        // Grant S3 read permissions to Lambdas
        contentBucket.grantRead(getPostsLambda, 'posts-index.json');
        contentBucket.grantRead(getPostsLambda, 'posts/*');
        contentBucket.grantRead(getPostBySlugLambda, 'posts/*');

        // ========================================
        // API Gateway HTTP API
        // ========================================

        const httpApi = new apigatewayv2.HttpApi(this, 'PublishingApi', {
            apiName: `${projectName}-publishing-api-${environment}`,
            description: 'Satspace Publishing Portal API',
            corsPreflight: {
                allowOrigins: ['*'], // Update with actual domain in production
                allowMethods: [apigatewayv2.CorsHttpMethod.GET],
                allowHeaders: ['Content-Type', 'Authorization'],
            },
        });

        // GET /posts route
        httpApi.addRoutes({
            path: '/posts',
            methods: [apigatewayv2.HttpMethod.GET],
            integration: new apigatewayv2Integrations.HttpLambdaIntegration(
                'GetPostsIntegration',
                getPostsLambda
            ),
        });

        // GET /posts/{slug} route
        httpApi.addRoutes({
            path: '/posts/{slug}',
            methods: [apigatewayv2.HttpMethod.GET],
            integration: new apigatewayv2Integrations.HttpLambdaIntegration(
                'GetPostBySlugIntegration',
                getPostBySlugLambda
            ),
        });

        // ========================================
        // CloudFront Distribution
        // ========================================

        // Origin Access Control for S3
        const oac = new cloudfront.S3OriginAccessControl(this, 'OAC', {
            originAccessControlName: `${projectName}-oac-${environment}`,
            description: 'OAC for Satspace frontend bucket',
        });

        const distribution = new cloudfront.Distribution(this, 'FrontendDistribution', {
            defaultBehavior: {
                origin: origins.S3BucketOrigin.withOriginAccessControl(frontendBucket, {
                    originAccessControl: oac,
                }),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
                cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                compress: true,
            },
            defaultRootObject: 'index.html',
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: cdk.Duration.seconds(0),
                },
                {
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: cdk.Duration.seconds(0),
                },
            ],
            priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
        });

        // Grant CloudFront read access to frontend bucket
        frontendBucket.addToResourcePolicy(
            new iam.PolicyStatement({
                actions: ['s3:GetObject'],
                resources: [frontendBucket.arnForObjects('*')],
                principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
                conditions: {
                    StringEquals: {
                        'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
                    },
                },
            })
        );

        // ========================================
        // Outputs
        // ========================================

        new cdk.CfnOutput(this, 'FrontendBucketName', {
            value: frontendBucket.bucketName,
            description: 'Frontend S3 Bucket Name',
        });

        new cdk.CfnOutput(this, 'ContentBucketName', {
            value: contentBucket.bucketName,
            description: 'Content S3 Bucket Name',
        });

        new cdk.CfnOutput(this, 'CloudFrontDistributionId', {
            value: distribution.distributionId,
            description: 'CloudFront Distribution ID',
        });

        new cdk.CfnOutput(this, 'CloudFrontDomainName', {
            value: distribution.distributionDomainName,
            description: 'CloudFront Domain Name',
        });

        new cdk.CfnOutput(this, 'ApiEndpoint', {
            value: httpApi.apiEndpoint,
            description: 'API Gateway Endpoint',
        });

        new cdk.CfnOutput(this, 'ApiUrl', {
            value: `${httpApi.apiEndpoint}`,
            description: 'Full API URL',
            exportName: `${projectName}-api-url-${environment}`,
        });
    }
}
