# Satspace Publishing Portal

A serverless news/blog publishing platform built with AWS services, inspired by SpaceNews.com.

## Architecture

- **Frontend**: React + Vite, static hosting on S3 + CloudFront
- **Backend**: AWS Lambda functions + API Gateway (HTTP API)
- **Content Store**: S3 (acting as document database)
- **Infrastructure**: AWS CDK (TypeScript)

## Features

- 📰 Article listing with pagination and tag filtering
- 📝 Full article pages with markdown rendering
- 🎨 SpaceNews-inspired professional design
- 🚀 Serverless architecture for minimal cost
- ⚡ Fast performance with CloudFront CDN
- 📱 Fully responsive design

## Project Structure

```
publishing-portal/
├── infrastructure/     # AWS CDK infrastructure code
├── backend/           # Lambda function handlers
├── frontend/          # React frontend application
├── content/           # Sample content (posts)
└── scripts/           # Deployment and utility scripts
```

## Prerequisites

- Node.js 20.x or later
- AWS CLI configured with appropriate credentials
- AWS CDK CLI (`npm install -g aws-cdk`)

## Setup

### 1. Install Dependencies

```bash
# Infrastructure
cd infrastructure
npm install

# Backend
cd ../backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Build Backend

```bash
cd backend
npm run build
```

### 3. Deploy Infrastructure

```bash
cd infrastructure
npm run deploy
```

This will create:
- S3 buckets for frontend and content
- Lambda functions for API
- API Gateway HTTP API
- CloudFront distribution

### 4. Configure Frontend

After deployment, update the API URL:

```bash
# Get the API URL from CDK output
cd frontend
echo "VITE_API_URL=<your-api-gateway-url>" > .env.local
```

### 5. Build and Deploy Frontend

```bash
cd frontend
npm run build

# Upload to S3 (replace with your bucket name from CDK output)
aws s3 sync dist/ s3://satspace-frontend-prod/
```

### 6. Upload Sample Content

```bash
# Upload sample content (replace with your bucket name)
aws s3 sync content/ s3://satspace-content-prod/
```

## Quick Deploy (All-in-One)

Use the deployment script to build and deploy everything:

```bash
./scripts/deploy.sh
```

## Content Management

### Content Structure

```
content/
├── posts-index.json           # Index of all posts
└── posts/
    └── <slug>/
        ├── meta.json          # Post metadata
        ├── article.md         # Article content (Markdown)
        └── hero.jpg           # Optional hero image
```

### Adding New Posts

1. Create a new folder under `content/posts/` with your slug
2. Add `meta.json` with post metadata
3. Add `article.md` with article content
4. Update `posts-index.json` to include the new post
5. Upload to S3:

```bash
aws s3 sync content/ s3://<your-content-bucket>/
```

### Post Metadata Schema

```json
{
  "slug": "article-slug",
  "title": "Article Title",
  "subtitle": "Optional subtitle",
  "excerpt": "Short preview text",
  "tags": ["tag1", "tag2"],
  "author": "Author Name",
  "published_at": "2025-12-19T10:00:00Z",
  "updated_at": "2025-12-19T10:00:00Z",
  "hero_image_key": "posts/article-slug/hero.jpg",
  "reading_time_minutes": 5,
  "status": "published"
}
```

## API Endpoints

### GET /posts

List all published posts with optional filtering and pagination.

**Query Parameters:**
- `tag` (optional): Filter by tag
- `limit` (optional, default: 20): Number of posts per page
- `offset` (optional, default: 0): Pagination offset

**Response:**
```json
{
  "items": [...],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

### GET /posts/{slug}

Get a single post by slug.

**Response:**
```json
{
  "meta": {...},
  "article_markdown": "# Article content...",
  "hero_image_key": "posts/slug/hero.jpg"
}
```

## Development

### Run Frontend Locally

```bash
cd frontend
npm run dev
```

Access at `http://localhost:5173`

### Run Backend Locally (SAM)

```bash
cd backend
sam local start-api
```

## Costs

Estimated monthly cost for low traffic (<10,000 visits/month):

- S3 Storage: ~$0.50
- Lambda: Free tier
- API Gateway: Free tier  
- CloudFront: ~$1-3
- **Total: ~$1-5/month**

## Future Enhancements (Phase 2)

The architecture supports future WhatsApp-based content ingest:

- WhatsApp webhook → Lambda
- Message queue (SQS)
- OpenAI integration for article generation
- Automated publishing pipeline

See `backend/src/handlers/` for stub implementations.

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.
