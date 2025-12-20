# SatSpace Infrastructure

AWS CDK infrastructure for the SatSpace blog platform.

## Architecture

- **Frontend**: Static React SPA served via S3 + CloudFront
- **API**: API Gateway HTTP API with Lambda integrations
- **Content Storage**: S3 bucket with structured content layout
- **Phase 2 (Stubs)**: SQS queue and Lambda functions for future article generation

## Deployment

### Prerequisites

```bash
npm install
```

### Deploy

```bash
# Deploy to dev environment
cdk deploy --context env=dev

# Deploy to production
cdk deploy --context env=prod
```

## Resources Created

1. **S3 Buckets**
   - `satspace-frontend-{env}` - Static website files
   - `satspace-content-{env}` - Blog content and media

2. **CloudFront Distribution**
   - Serves frontend from S3
   - Custom domain support
   - SSL/TLS encryption

3. **API Gateway**
   - `/posts` - GET all published posts
   - `/posts/{slug}` - GET single post by slug

4. **Lambda Functions**
   - GetPosts - Reads posts index from S3
   - GetPostBySlug - Reads individual post from S3
   - IngestWebhook (stub) - Phase 2
   - ProcessArticle (stub) - Phase 2

5. **SQS Queue (Phase 2)**
   - Article processing queue

## Environment Variables

The following environment variables are set on Lambda functions:

- `CONTENT_BUCKET` - S3 content bucket name
- `INDEX_KEY` - Path to posts index file (default: posts-index.json)

## Cost Optimization

- S3 buckets use Intelligent-Tiering for cost optimization
- Lambda functions use ARM64 (Graviton2) for better performance/cost
- CloudFront caching reduces Origin requests
- Free tier covers most usage for low-traffic sites

## Outputs

After deployment, CDK outputs:

- CloudFront URL
- API Gateway URL
- S3 bucket names
