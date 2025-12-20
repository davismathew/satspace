---
description: SatSpace Rebrand and AWS Infrastructure Implementation
---

# SatSpace Rebrand & AWS Blog Platform Implementation

## Overview
Transform OrbitNews frontend to SatSpace and implement AWS-based static blog platform with S3, CloudFront, API Gateway, and Lambda.

## Phase 1: Branding Update

### 1.1 Frontend Rebranding
- [ ] Update `index.html` with SatSpace branding (title, meta tags, OG tags)
- [ ] Update Header component (ORBITNEWS → SATSPACE)
- [ ] Update Footer component (OrbitNews → SatSpace, copyright)
- [ ] Update Newsletter component ("Stay in Orbit" → "Stay Connected")
- [ ] Update package.json name field
- [ ] Search and replace any remaining "orbit" references

### 1.2 Content Theme Adjustment
- [ ] Update mock data in `lib/data.ts` to satellite/space industry focus
- [ ] Ensure content aligns with SatSpace mission

## Phase 2: AWS Infrastructure (IaC)

### 2.1 Project Structure
```
codespace/
├── frontend/           # React SPA (already exists)
├── infrastructure/     # CDK/Terraform for AWS resources
├── lambda/            # Lambda functions
│   ├── get-posts/
│   ├── get-post-by-slug/
│   ├── ingest-webhook/     # Phase 2 stub
│   └── process-article/    # Phase 2 stub
└── scripts/           # Deployment and content upload scripts
```

### 2.2 Infrastructure Components (CDK Recommended)
- [ ] S3 Buckets:
  - `satspace-frontend-<env>` - Static frontend assets
  - `satspace-content-<env>` - Content storage (posts, media)
- [ ] CloudFront Distribution:
  - Origin: frontend bucket
  - OAC (Origin Access Control)
  - SSL certificate
  - Error pages for SPA routing (403/404 → index.html)
- [ ] API Gateway HTTP API:
  - Custom domain: `api.satspace.com`
  - Routes: GET /posts, GET /posts/{slug}
- [ ] Lambda Functions:
  - GetPosts - reads posts-index.json from S3
  - GetPostBySlug - reads posts/{slug}/* from S3
  - IngestWebhook (stub) - Phase 2
  - ProcessArticle (stub) - Phase 2
- [ ] IAM Roles & Policies:
  - Lambda execution roles with S3 read permissions
  - CloudFront OAC policy for S3 access

### 2.3 S3 Content Structure
```
satspace-content-<env>/
  posts/
    <slug>/
      meta.json          # Post metadata
      article.md         # Markdown content
      hero.jpg           # Optional hero image
  posts-index.json       # Array of all published posts
  raw/                   # Phase 2: WhatsApp/ingest data
    <uuid>/...
```

## Phase 3: Lambda Functions

### 3.1 GetPosts Lambda
**Environment Variables:**
- `CONTENT_BUCKET`: satspace-content-<env>
- `INDEX_KEY`: posts-index.json

**Logic:**
1. Read posts-index.json from S3
2. Filter by status === "published"
3. Return JSON array

### 3.2 GetPostBySlug Lambda
**Environment Variables:**
- `CONTENT_BUCKET`: satspace-content-<env>

**Logic:**
1. Read posts/{slug}/meta.json
2. Read posts/{slug}/article.md
3. Verify status === "published"
4. Return combined JSON object
5. Handle 404 for missing posts

### 3.3 Phase 2 Lambda Stubs

**IngestWebhook (SQS Producer)**
- Accept WhatsApp webhook
- Write to SQS queue
- Store raw media in S3 raw/

**ProcessArticle (SQS Consumer)**
- Environment: OPENAI_API_KEY (from Secrets Manager)
- Read SQS events
- Call OpenAI API
- Generate meta.json + article.md
- Update posts-index.json

## Phase 4: Frontend Updates

### 4.1 API Integration
- [ ] Create API client in `src/lib/api.ts`
- [ ] Environment variables for API base URL
- [ ] Fetch posts from API Gateway instead of mock data
- [ ] Update Article page to fetch from API
- [ ] Handle loading and error states
- [ ] Implement markdown rendering for article content

### 4.2 Build Configuration
- [ ] Update vite.config.ts for production build
- [ ] Configure environment variables (.env.production)
- [ ] Test production build locally

### 4.3 Deployment Script
```bash
# Build frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://satspace-frontend-<env>/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

## Phase 5: Sample Content

### 5.1 Create Sample Posts
- [ ] Create 3-5 sample posts in S3
- [ ] Each with meta.json, article.md, hero.jpg
- [ ] Update posts-index.json

### 5.2 Content Schema Example

**meta.json:**
```json
{
  "slug": "satellite-launch-2025",
  "title": "Major Satellite Constellation Launch Scheduled",
  "subtitle": "New constellation to enhance global connectivity",
  "excerpt": "Short preview text for listing pages",
  "tags": ["satellites", "launches", "connectivity"],
  "author": "Davis",
  "published_at": "2025-01-19T10:00:00Z",
  "updated_at": "2025-01-19T10:00:00Z",
  "hero_image_key": "posts/satellite-launch-2025/hero.jpg",
  "reading_time_minutes": 5,
  "status": "published"
}
```

## Phase 6: Testing & Deployment

### 6.1 Local Testing
- [ ] Test frontend locally with dev API
- [ ] Test Lambda functions locally (SAM CLI)
- [ ] Verify S3 content structure

### 6.2 Production Deployment
- [ ] Deploy infrastructure (CDK/Terraform)
- [ ] Deploy Lambda functions
- [ ] Upload sample content to S3
- [ ] Build and deploy frontend
- [ ] Configure DNS (Route 53)
- [ ] Test end-to-end

## Phase 7: Documentation

### 7.1 Create Documentation
- [ ] README.md with architecture overview
- [ ] Deployment guide
- [ ] Content authoring guide (how to add new posts)
- [ ] Phase 2 design document (stub implementation)

## Success Criteria

✅ Frontend displays SatSpace branding
✅ Static site served via CloudFront
✅ API returns posts from S3
✅ Cost optimized for low traffic
✅ No vendor lock-in (portable content format)
✅ Phase 2 stubs in place for future implementation
✅ Full documentation for maintenance

## Next Steps After Phase 1

1. Implement WhatsApp webhook integration
2. Set up SQS queue for article processing
3. Integrate OpenAI API for content generation
4. Implement autonomous publishing pipeline
