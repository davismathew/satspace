# SatSpace Deployment Guide

Complete step-by-step guide for deploying SatSpace to AWS.

## Prerequisites Checklist

- [ ] AWS Account with appropriate permissions
- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] Node.js 18+ installed
- [ ] AWS CDK CLI installed (`npm install -g aws-cdk`)
- [ ] Git repository set up (optional)

## Initial Setup (One-Time)

### 1. Install Dependencies

```bash
# Frontend dependencies
cd publishing-portal/frontend
npm install
cd ../..

# Infrastructure dependencies
cd infrastructure
npm install
cd ..

# Lambda function dependencies
cd lambda/get-posts && npm install && cd ../..
cd lambda/get-post-by-slug && npm install && cd ../..
cd lambda/ingest-webhook && npm install && cd ../..
cd lambda/process-article && npm install && cd ../..
```

### 2. Bootstrap AWS CDK

```bash
cd infrastructure

# Bootstrap CDK in your AWS account (one-time per account/region)
cdk bootstrap aws://ACCOUNT-ID/REGION

# Example:
# cdk bootstrap aws://123456789012/us-east-1
```

## Development Environment Deployment

### Step 1: Deploy Infrastructure

```bash
cd infrastructure

# Synthesize CloudFormation template (optional, for review)
cdk synth --context env=dev

# Deploy to AWS
cdk deploy --context env=dev

# ⚠️ Approve the changes when prompted
```

**Expected Output:**
```
Outputs:
SatSpaceStack-dev.ApiUrl = https://abc123.execute-api.us-east-1.amazonaws.com
SatSpaceStack-dev.CloudFrontDistributionId = E1234567890ABC
SatSpaceStack-dev.CloudFrontURL = https://d1234567890abc.cloudfront.net
SatSpaceStack-dev.ContentBucketName = satspace-content-dev
SatSpaceStack-dev.FrontendBucketName = satspace-frontend-dev
```

**Save these outputs!** You'll need them for the next steps.

### Step 2: Configure Frontend

```bash
cd publishing-portal/frontend

# Create environment file
cp .env.example .env.local

# Edit .env.local
# Set VITE_API_URL to the ApiUrl from CDK outputs
nano .env.local
```

`.env.local` should contain:
```
VITE_API_URL=https://abc123.execute-api.us-east-1.amazonaws.com
VITE_USE_MOCK_DATA=false
```

### Step 3: Upload Sample Content

```bash
# From project root
./scripts/upload-content.sh dev
```

Verify content is uploaded:
```bash
aws s3 ls s3://satspace-content-dev/ --recursive
```

### Step 4: Build and Deploy Frontend

```bash
# From project root
./scripts/deploy-frontend.sh dev
```

Wait for CloudFront invalidation to complete (2-3 minutes).

### Step 5: Test Your Site

Visit the CloudFront URL from Step 1 outputs:
```
https://d1234567890abc.cloudfront.net
```

You should see:
- ✅ SatSpace branding
- ✅ Sample articles listed
- ✅ Click on article to view full content
- ✅ Working navigation

## Production Deployment

### Prerequisites

Before deploying to production:

1. **Custom Domain** (optional but recommended)
   - Register domain in Route 53 or external registrar
   - Request SSL certificate in AWS Certificate Manager (us-east-1 region)
   - Update CDK stack to add custom domain to CloudFront

2. **Content Ready**
   - Prepare production-ready articles
   - Generate or source high-quality hero images
   - Review all metadata for accuracy

3. **Environment Variables**
   - Create `.env.production` with production API URL
   - Review all configuration settings

### Deployment Steps

```bash
# 1. Deploy infrastructure
cd infrastructure
cdk deploy --context env=prod

# 2. Configure frontend
cd ../publishing-portal/frontend
cp .env.example .env.production
# Edit .env.production with production API URL

# 3. Upload content
cd ../..
./scripts/upload-content.sh prod

# 4. Deploy frontend
./scripts/deploy-frontend.sh prod
```

## Adding Custom Domain

### 1. Create SSL Certificate

```bash
# Switch to us-east-1 (required for CloudFront)
aws acm request-certificate \
  --domain-name satspace.com \
  --domain-name www.satspace.com \
  --validation-method DNS \
  --region us-east-1
```

Validate the certificate via DNS.

### 2. Update CDK Stack

Edit `infrastructure/satspace-stack.js` and add to CloudFront distribution:

```javascript
const certificate = acm.Certificate.fromCertificateArn(
  this,
  'Certificate',
  'arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT-ID'
);

const distribution = new cloudfront.Distribution(this, 'FrontendDistribution', {
  // ... existing config
  domainNames: ['satspace.com', 'www.satspace.com'],
  certificate: certificate,
});
```

### 3. Update Route 53

Create A records pointing to CloudFront:

```bash
# Use the CloudFront distribution domain name as the alias target
```

## Updating Content

### Option 1: Direct S3 Upload

```bash
# Upload new post
aws s3 cp content/new-post/meta.json s3://satspace-content-prod/posts/new-post/meta.json
aws s3 cp content/new-post/article.md s3://satspace-content-prod/posts/new-post/article.md
aws s3 cp content/new-post/hero.jpg s3://satspace-content-prod/posts/new-post/hero.jpg

# Update index
aws s3 cp posts-index.json s3://satspace-content-prod/posts-index.json
```

### Option 2: Sync Entire Directory

```bash
# Use the upload script
./scripts/upload-content.sh prod
```

## Updating Frontend

```bash
# Make changes in publishing-portal/frontend
# Test locally: npm run dev

# Deploy changes
./scripts/deploy-frontend.sh prod
```

## Rollback Procedure

### Frontend Rollback

```bash
# List previous versions (if versioning enabled)
aws s3api list-object-versions --bucket satspace-frontend-prod

# CloudFront - wait for previous invalidation or upload old files
```

### Infrastructure Rollback

```bash
# Roll back to previous stack version
aws cloudformation rollback-stack --stack-name SatSpaceStack-prod
```

## Monitoring and Maintenance

### Check Lambda Logs

```bash
# Get posts function
aws logs tail /aws/lambda/satspace-get-posts-prod --follow

# Get post by slug function
aws logs tail /aws/lambda/satspace-get-post-by-slug-prod --follow
```

### Check CloudFront Metrics

```bash
# View in AWS Console
# CloudFormation > Distributions > Monitoring
```

### Cost Monitoring

```bash
# View current month costs
aws ce get-cost-and-usage \
  --time-period Start=2025-01-01,End=2025-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --filter file://filter.json
```

## Troubleshooting

### Frontend not loading

1. Check CloudFront invalidation status
2. Verify S3 bucket has files: `aws s3 ls s3://satspace-frontend-{env}/`
3. Check CloudFront distribution status
4. Review CloudFront access logs

### API returning errors

1. Check Lambda logs (see above)
2. Verify content bucket has posts: `aws s3 ls s3://satspace-content-{env}/posts/`
3. Test Lambda directly:
   ```bash
   aws lambda invoke \
     --function-name satspace-get-posts-dev \
     --payload '{}' \
     response.json
   ```

### CORS errors

1. Check API Gateway CORS configuration
2. Verify Lambda response includes CORS headers
3. Check browser console for specific error

## Security Best Practices

1. **Never commit secrets**: Use `.env.local` (gitignored)
2. **Use least privilege IAM**: CDK creates minimal permissions
3. **Enable CloudTrail**: Track all AWS API calls
4. **Regular updates**: Keep dependencies updated
5. **Monitor costs**: Set up billing alerts

## Next Steps: Phase 2

When ready to implement automated content generation:

1. Set up WhatsApp Business API
2. Create OpenAI account and get API key
3. Store API key in AWS Secrets Manager
4. Implement webhook handler in `lambda/ingest-webhook`
5. Implement article processor in `lambda/process-article`
6. Test with sample WhatsApp messages
7. Deploy and monitor

---

For questions, refer to the [main README](./README.md) or check AWS CloudWatch logs.
