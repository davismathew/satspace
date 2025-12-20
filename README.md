# SatSpace - Satellite Industry News Platform

**SatSpace** is a modern, serverless blog platform focused on satellite industry news and space infrastructure updates. Built with AWS services for cost-effective, scalable content delivery.

## 🏗️ Architecture

### Phase 1 (Current Implementation)

```
┌─────────────┐
│   Users     │
└──────┬──────┘
       │
       │ HTTPS
       ▼
┌─────────────────┐
│   CloudFront    │  ← Static Site Distribution
└────────┬────────┘
         │
         ├─────────────┐
         │             │
         ▼             ▼
    ┌────────┐    ┌────────────┐
    │Frontend│    │ API Gateway│
    │  (S3)  │    │  (HTTP API)│
    └────────┘    └──────┬─────┘
                         │
                         ▼
                  ┌──────────────┐
                  │   Lambda     │
                  │  Functions   │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  S3 Content  │
                  │    Bucket    │
                  └──────────────┘
```

### Technology Stack

- **Frontend**: React + TypeScript + Vite + TailwindCSS + shadcn/ui
- **Infrastructure**: AWS CDK (TypeScript)
- **API**: AWS API Gateway HTTP API
- **Compute**: AWS Lambda (Node.js 20)
- **Storage**: AWS S3
- **CDN**: AWS CloudFront
- **Phase 2**: SQS, OpenAI API (stubs implemented)

## 📁 Project Structure

```
satspace/codespace/
├── publishing-portal/
│   └── frontend/              # React frontend
│       ├── src/
│       │   ├── components/    # UI components
│       │   ├── pages/         # Page components
│       │   ├── lib/           # Utilities & API client
│       │   └── assets/        # Static assets
│       └── package.json
│
├── infrastructure/            # AWS CDK code
│   ├── satspace-stack.js     # Main infrastructure stack
│   ├── app.js                # CDK app entry point
│   └── package.json
│
├── lambda/                    # Lambda function code
│   ├── get-posts/            # GET /posts endpoint
│   ├── get-post-by-slug/     # GET /posts/{slug} endpoint
│   ├── ingest-webhook/       # Phase 2 stub
│   └── process-article/      # Phase 2 stub
│
├── content-samples/           # Sample blog posts
│   ├── posts-index.json
│   └── {slug}/
│       ├── meta.json
│       ├── article.md
│       └── hero.jpg
│
└── scripts/                   # Deployment scripts
    ├── deploy-frontend.sh
    └── upload-content.sh
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- AWS CLI configured with credentials
- AWS CDK CLI: `npm install -g aws-cdk`

### 1. Frontend Development

```bash
cd publishing-portal/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 2. Deploy Infrastructure

```bash
cd infrastructure

# Install dependencies
npm install

# Bootstrap CDK (first time only)
cdk bootstrap

# Deploy to dev environment
cdk deploy --context env=dev

# Deploy to production
cdk deploy --context env=prod
```

After deployment, note the outputs:
- `ApiUrl` - Your API Gateway endpoint
- `CloudFrontURL` - Your website URL
- `FrontendBucketName` - S3 bucket for frontend
- `ContentBucketName` - S3 bucket for content

### 3. Configure Frontend API

```bash
cd publishing-portal/frontend

# Copy environment template
cp .env.example .env.local

# Edit .env.local and set VITE_API_URL to your API Gateway URL
# Example: VITE_API_URL=https://abc123.execute-api.us-east-1.amazonaws.com
```

### 4. Upload Sample Content

```bash
# From project root
./scripts/upload-content.sh dev
```

### 5. Deploy Frontend

```bash
# From project root
./scripts/deploy-frontend.sh dev
```

Your site is now live at the CloudFront URL!

## 📝 Content Management

### Content Structure

Content is stored in S3 following this structure:

```
satspace-content-{env}/
├── posts-index.json           # List of all published posts
└── posts/
    └── {slug}/
        ├── meta.json          # Post metadata
        ├── article.md         # Markdown content
        └── hero.jpg           # (optional) Hero image
```

### Adding a New Post

1. Create a directory: `posts/{your-slug}/`
2. Create `meta.json`:

```json
{
  "slug": "your-slug",
  "title": "Your Title",
  "subtitle": "Optional subtitle",
  "excerpt": "Short preview text",
  "tags": ["tag1", "tag2"],
  "author": "Author Name",
  "published_at": "2025-01-20T10:00:00Z",
  "updated_at": "2025-01-20T10:00:00Z",
  "hero_image_key": "posts/your-slug/hero.jpg",
  "reading_time_minutes": 5,
  "status": "published"
}
```

3. Create `article.md` with your markdown content
4. (Optional) Add `hero.jpg` image
5. Update `posts-index.json` with your post entry
6. Upload to S3:

```bash
aws s3 sync posts/your-slug/ s3://satspace-content-dev/posts/your-slug/
aws s3 cp posts-index.json s3://satspace-content-dev/posts-index.json
```

## 🔌 API Endpoints

### GET /posts

Returns list of all published posts.

**Response:**
```json
{
  "posts": [
    {
      "slug": "example-post",
      "title": "Example Post",
      "excerpt": "Short description",
      "tags": ["satellites"],
      "published_at": "2025-01-20T10:00:00Z",
      "hero_image_key": "posts/example-post/hero.jpg",
      "status": "published"
    }
  ],
  "count": 1
}
```

### GET /posts/{slug}

Returns a single post with full content.

**Response:**
```json
{
  "slug": "example-post",
  "title": "Example Post",
  "content": "# Full markdown content...",
  "excerpt": "Short description",
  "tags": ["satellites"],
  "author": "Author Name",
  "published_at": "2025-01-20T10:00:00Z",
  "hero_image_url": "https://...",
  "reading_time_minutes": 5,
  "status": "published"
}
```

## 🎯 Phase 2: Automated Content Generation

Phase 2 is designed but not yet implemented. It will include:

### Features

1. **WhatsApp Webhook Integration**
   - Receive messages via WhatsApp
   - Extract text, images, PDFs
   - Store raw content in S3

2. **SQS Processing Queue**
   - Decouple ingestion from processing
   - Handle bursts of content
   - Retry failed generations

3. **OpenAI Article Generation**
   - Generate article from raw content
   - Create SEO-optimized titles and excerpts
   - Generate hero images (optional)
   - Auto-publish to S3

4. **Index Management**
   - Automatically update posts-index.json
   - Handle concurrent updates
   - Maintain chronological ordering

### Implementation Status

- ✅ Lambda stubs created
- ✅ SQS queue provisioned
- ✅ IAM permissions configured
- ⏳ OpenAI integration (TODO)
- ⏳ WhatsApp webhook (TODO)
- ⏳ Content generation logic (TODO)

## 💰 Cost Optimization

The architecture is optimized for minimal cost at low traffic:

- **CloudFront**: Free tier covers first 1TB/month
- **S3**: Intelligent tiering moves old content to cheaper storage
- **Lambda**: ARM64 (Graviton2) for better price/performance
- **API Gateway**: HTTP API (cheaper than REST API)
- **No databases**: Avoids DynamoDB/RDS costs

**Estimated monthly cost for 1000 visitors/month: < $1**

## 🔒 Security

- S3 buckets: Private with CloudFront OAC
- API Gateway: CORS configured
- Lambda: Minimal IAM permissions (principle of least privilege)
- No secrets in code (use Secrets Manager for OpenAI key)

## 🧪 Testing Locally

### Frontend Only

```bash
cd publishing-portal/frontend
npm run dev
```

Uses mock data from `src/lib/data.ts`.

### With Local API

You can use AWS SAM CLI to run Lambdas locally:

```bash
# Install SAM CLI
brew install aws-sam-cli

# Test Lambda function
cd lambda/get-posts
sam local invoke -e test-event.json
```

## 📚 Additional Documentation

- [Frontend README](./publishing-portal/frontend/README.md)
- [Infrastructure README](./infrastructure/README.md)
- [Workflow Guide](./.agent/workflows/satspace-rebrand.md)

## 🤝 Contributing

1. Make changes in a feature branch
2. Test locally
3. Deploy to dev environment
4. Test on CloudFront URL
5. Deploy to prod when ready

## 📄 License

Private project - All rights reserved.

## 🙋 Support

For questions or issues, contact: Davis Mathew

---

**Built with ❤️ for the satellite industry**
