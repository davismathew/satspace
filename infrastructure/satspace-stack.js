const { Stack, Duration, CfnOutput, RemovalPolicy } = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib/aws-s3');
const cloudfront = require('aws-cdk-lib/aws-cloudfront');
const origins = require('aws-cdk-lib/aws-cloudfront-origins');
const lambda = require('aws-cdk-lib/aws-lambda');
const apigatewayv2 = require('aws-cdk-lib/aws-apigatewayv2');
const integrations = require('aws-cdk-lib/aws-apigatewayv2-integrations');
const iam = require('aws-cdk-lib/aws-iam');
const sqs = require('aws-cdk-lib/aws-sqs');
const { SqsEventSource } = require('aws-cdk-lib/aws-lambda-event-sources');

class SatSpaceStack extends Stack {
    constructor(scope, id, props) {
        super(scope, id, props);

        const { stackEnv } = props;

        // ========================================
        // S3 Buckets
        // ========================================

        // Frontend bucket
        const frontendBucket = new s3.Bucket(this, 'FrontendBucket', {
            bucketName: `satspace-frontend-${stackEnv}`,
            removalPolicy: stackEnv === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
            autoDeleteObjects: stackEnv !== 'prod',
            publicReadAccess: false, // CloudFront OAC handles access
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            encryption: s3.BucketEncryption.S3_MANAGED,
        });

        // Content bucket
        const contentBucket = new s3.Bucket(this, 'ContentBucket', {
            bucketName: `satspace-content-${stackEnv}`,
            removalPolicy: stackEnv === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
            autoDeleteObjects: stackEnv !== 'prod',
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            encryption: s3.BucketEncryption.S3_MANAGED,
            intelligentTieringConfigurations: [
                {
                    name: 'ArchiveOldContent',
                    archiveAccessTierTime: Duration.days(90),
                    deepArchiveAccessTierTime: Duration.days(180),
                },
            ],
        });

        // ========================================
        // Lambda Functions
        // ========================================

        // GetPosts Lambda
        const getPostsLambda = new lambda.Function(this, 'GetPostsFunction', {
            functionName: `satspace-get-posts-${stackEnv}`,
            runtime: lambda.Runtime.NODEJS_20_X,
            architecture: lambda.Architecture.ARM_64,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('../lambda/get-posts'),
            timeout: Duration.seconds(10),
            memorySize: 256,
            environment: {
                CONTENT_BUCKET: contentBucket.bucketName,
                INDEX_KEY: 'posts-index.json',
            },
        });

        contentBucket.grantRead(getPostsLambda);

        // GetPostBySlug Lambda
        const getPostBySlugLambda = new lambda.Function(this, 'GetPostBySlugFunction', {
            functionName: `satspace-get-post-by-slug-${stackEnv}`,
            runtime: lambda.Runtime.NODEJS_20_X,
            architecture: lambda.Architecture.ARM_64,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('../lambda/get-post-by-slug'),
            timeout: Duration.seconds(10),
            memorySize: 256,
            environment: {
                CONTENT_BUCKET: contentBucket.bucketName,
            },
        });

        contentBucket.grantRead(getPostBySlugLambda);

        // ========================================
        // Phase 2: SQS Queue (Stub)
        // ========================================

        const articleQueue = new sqs.Queue(this, 'ArticleProcessingQueue', {
            queueName: `satspace-article-processing-${stackEnv}`,
            visibilityTimeout: Duration.seconds(300),
            retentionPeriod: Duration.days(14),
        });

        // IngestWebhook Lambda (Phase 2 Stub)
        const ingestWebhookLambda = new lambda.Function(this, 'IngestWebhookFunction', {
            functionName: `satspace-ingest-webhook-${stackEnv}`,
            runtime: lambda.Runtime.NODEJS_20_X,
            architecture: lambda.Architecture.ARM_64,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('../lambda/ingest-webhook'),
            timeout: Duration.seconds(30),
            memorySize: 512,
            environment: {
                CONTENT_BUCKET: contentBucket.bucketName,
                SQS_QUEUE_URL: articleQueue.queueUrl,
            },
        });

        contentBucket.grantReadWrite(ingestWebhookLambda);
        articleQueue.grantSendMessages(ingestWebhookLambda);

        // ProcessArticle Lambda (Phase 2 Stub)
        const processArticleLambda = new lambda.Function(this, 'ProcessArticleFunction', {
            functionName: `satspace-process-article-${stackEnv}`,
            runtime: lambda.Runtime.NODEJS_20_X,
            architecture: lambda.Architecture.ARM_64,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('../lambda/process-article'),
            timeout: Duration.seconds(300),
            memorySize: 1024,
            environment: {
                CONTENT_BUCKET: contentBucket.bucketName,
                OPENAI_MODEL: 'gpt-4',
            },
        });

        contentBucket.grantReadWrite(processArticleLambda);

        // Add SQS event source
        processArticleLambda.addEventSource(
            new SqsEventSource(articleQueue, {
                batchSize: 1,
            })
        );

        // ========================================
        // API Gateway HTTP API
        // ========================================

        const httpApi = new apigatewayv2.HttpApi(this, 'SatSpaceApi', {
            apiName: `satspace-api-${stackEnv}`,
            description: 'SatSpace Blog API',
            corsPreflight: {
                allowOrigins: ['*'], // Configure based on your domain
                allowMethods: [
                    apigatewayv2.CorsHttpMethod.GET,
                    apigatewayv2.CorsHttpMethod.OPTIONS,
                ],
                allowHeaders: ['Content-Type', 'Authorization'],
            },
        });

        // GET /posts
        httpApi.addRoutes({
            path: '/posts',
            methods: [apigatewayv2.HttpMethod.GET],
            integration: new integrations.HttpLambdaIntegration(
                'GetPostsIntegration',
                getPostsLambda
            ),
        });

        // GET /posts/{slug}
        httpApi.addRoutes({
            path: '/posts/{slug}',
            methods: [apigatewayv2.HttpMethod.GET],
            integration: new integrations.HttpLambdaIntegration(
                'GetPostBySlugIntegration',
                getPostBySlugLambda
            ),
        });

        // POST /ingest (Phase 2 stub)
        httpApi.addRoutes({
            path: '/ingest',
            methods: [apigatewayv2.HttpMethod.POST],
            integration: new integrations.HttpLambdaIntegration(
                'IngestWebhookIntegration',
                ingestWebhookLambda
            ),
        });

        // ========================================
        // CloudFront Distribution
        // ========================================

        const distribution = new cloudfront.Distribution(this, 'FrontendDistribution', {
            comment: `SatSpace Frontend - ${stackEnv}`,
            defaultBehavior: {
                origin: origins.S3BucketOrigin.withOriginAccessControl(frontendBucket),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
            },
            defaultRootObject: 'index.html',
            errorResponses: [
                {
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: Duration.seconds(300),
                },
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: Duration.seconds(300),
                },
            ],
        });

        // ========================================
        // Outputs
        // ========================================

        new CfnOutput(this, 'FrontendBucketName', {
            value: frontendBucket.bucketName,
            description: 'S3 bucket for frontend assets',
        });

        new CfnOutput(this, 'ContentBucketName', {
            value: contentBucket.bucketName,
            description: 'S3 bucket for blog content',
        });

        new CfnOutput(this, 'CloudFrontURL', {
            value: `https://${distribution.distributionDomainName}`,
            description: 'CloudFront distribution URL',
        });

        new CfnOutput(this, 'ApiUrl', {
            value: httpApi.url || '',
            description: 'API Gateway URL',
        });

        new CfnOutput(this, 'CloudFrontDistributionId', {
            value: distribution.distributionId,
            description: 'CloudFront distribution ID for cache invalidation',
        });
    }
}

module.exports = { SatSpaceStack };
