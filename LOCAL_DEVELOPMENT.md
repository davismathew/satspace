# SatSpace Local Development Guide

## 🏠 Running SatSpace Locally

There are multiple ways to run SatSpace locally depending on what you're working on.

---

## Option 1: Frontend Only (Quickest - Recommended for Development)

This runs just the frontend with mock data - **perfect for UI/UX work**.

### Step 1: Navigate to Frontend

```bash
cd publishing-portal/frontend
```

### Step 2: Install Dependencies (if not already done)

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

**That's it!** 🎉

- Frontend will run at: `http://localhost:5173`
- Uses mock data from `src/lib/data.ts`
- Hot reload enabled (changes update instantly)
- No AWS/backend needed

### What You Can Do:

- ✅ View all pages and components
- ✅ Test navigation and routing
- ✅ Work on styling and UI
- ✅ Test responsive design
- ✅ Develop new components
- ⚠️ Mock data only (not real API calls)

---

## Option 2: Frontend + Mock API Server (Better Testing)

Run frontend with a simple local API that mimics the Lambda functions.

### Step 1: Create Mock API Server

```bash
cd publishing-portal/frontend
```

Create a file `mock-api-server.js`:

```javascript
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Mock posts index
const postsIndex = [
  {
    slug: "starlink-expands-global-coverage",
    title: "Starlink Expands Global Satellite Coverage to Remote Regions",
    excerpt: "Starlink announces major expansion bringing high-speed internet to previously unconnected areas.",
    tags: ["satellites", "connectivity", "starlink"],
    published_at: "2025-01-15T10:00:00Z",
    hero_image_key: "posts/starlink-expands-global-coverage/hero.jpg",
    status: "published"
  },
  {
    slug: "earth-observation-climate-monitoring",
    title: "New Generation of Earth Observation Satellites Transform Climate Monitoring",
    excerpt: "Next-generation Earth observation satellites equipped with advanced sensors revolutionize climate data.",
    tags: ["earth-observation", "climate", "satellites"],
    published_at: "2025-01-18T14:30:00Z",
    hero_image_key: "posts/earth-observation-climate-monitoring/hero.jpg",
    status: "published"
  }
];

// GET /posts
app.get('/posts', (req, res) => {
  console.log('GET /posts');
  res.json({
    posts: postsIndex,
    count: postsIndex.length
  });
});

// GET /posts/:slug
app.get('/posts/:slug', (req, res) => {
  const { slug } = req.params;
  console.log(`GET /posts/${slug}`);
  
  const post = postsIndex.find(p => p.slug === slug);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  // Simulate full post with content
  res.json({
    ...post,
    subtitle: "Detailed insights and analysis",
    author: "Davis Mathew",
    content: `# ${post.title}\n\nThis is sample content for **${slug}**.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n## Key Points\n\n- Point 1: Important information\n- Point 2: More details\n- Point 3: Additional context\n\n## Conclusion\n\nThis concludes the sample article.`,
    reading_time_minutes: 5,
    updated_at: post.published_at
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock API server running at http://localhost:${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   - GET http://localhost:${PORT}/posts`);
  console.log(`   - GET http://localhost:${PORT}/posts/:slug`);
});
```

### Step 2: Install Express

```bash
npm install --save-dev express cors
```

### Step 3: Add Script to package.json

Add to `scripts` section in `package.json`:

```json
"mock-api": "node mock-api-server.js"
```

### Step 4: Create .env.local

```bash
echo "VITE_API_URL=http://localhost:3000" > .env.local
```

### Step 5: Run Both Servers

**Terminal 1 - Mock API:**
```bash
npm run mock-api
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Now frontend at `http://localhost:5173` will use the mock API! ✨

---

## Option 3: Frontend + Real AWS Lambda (Local)

Run Lambda functions locally using AWS SAM.

### Prerequisites

```bash
# Install AWS SAM CLI
brew install aws-sam-cli

# Verify installation
sam --version
```

### Step 1: Create SAM Template

Create `lambda/template.yaml`:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Timeout: 10
    Runtime: nodejs20.x
    Environment:
      Variables:
        CONTENT_BUCKET: local-content-bucket

Resources:
  GetPostsFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: get-posts/
      Handler: index.handler
      Events:
        GetPosts:
          Type: Api
          Properties:
            Path: /posts
            Method: get

  GetPostBySlugFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: get-post-by-slug/
      Handler: index.handler
      Events:
        GetPost:
          Type: Api
          Properties:
            Path: /posts/{slug}
            Method: get
```

### Step 2: Create Local Content (Mock S3)

```bash
# Create local content directory
mkdir -p lambda/.local-content

# Copy sample content
cp -r ../../content-samples/* lambda/.local-content/
```

### Step 3: Modify Lambda to Read Local Files (dev mode)

You'd need to modify the Lambda functions to check for local mode and read from filesystem instead of S3. This is complex - **Option 2 (Mock API) is easier**.

---

## Option 4: Full AWS Deployment (Production-Like)

Deploy everything to AWS and test with real infrastructure.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide.

---

## 🎯 Recommended Approach by Use Case

| What You're Working On | Recommended Option |
|------------------------|-------------------|
| UI/UX Design | **Option 1** - Frontend only |
| Component Development | **Option 1** - Frontend only |
| API Integration | **Option 2** - Mock API |
| Testing Full Flow | **Option 2** - Mock API |
| Lambda Development | **Option 4** - Deploy to AWS dev |
| Pre-Production Testing | **Option 4** - Deploy to AWS dev |

---

## 🔥 Quick Start (Easiest)

**Just want to see it running?**

```bash
cd publishing-portal/frontend
npm install
npm run dev
```

Open `http://localhost:5173` and you're done! 🎉

---

## 🛠️ Development Workflow

### Typical Development Session:

```bash
# 1. Start frontend dev server
cd publishing-portal/frontend
npm run dev

# 2. Open browser to http://localhost:5173

# 3. Make changes to components/pages
# 4. See changes instantly (hot reload)

# 5. When ready to test with real API:
#    - Deploy to AWS dev environment
#    - Update .env.local with real API URL
#    - Restart dev server
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# If port 5173 is busy, Vite will use next available port
# Or specify a different port:
npm run dev -- --port 3001
```

### API Not Working

1. Check `.env.local` file exists with `VITE_API_URL`
2. Verify mock API server is running (`npm run mock-api`)
3. Check browser console for errors
4. Ensure CORS is enabled

### Hot Reload Not Working

```bash
# Restart dev server
# Press Ctrl+C, then run again:
npm run dev
```

---

## 📝 Environment Variables

Create `.env.local` in `publishing-portal/frontend/`:

```bash
# For local mock API
VITE_API_URL=http://localhost:3000

# For AWS dev environment
VITE_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com

# Use mock data (ignores API)
VITE_USE_MOCK_DATA=true
```

Restart dev server after changing `.env` files.

---

## 🚀 Ready to Deploy?

When you're happy with local development, deploy to AWS:

```bash
# 1. Deploy infrastructure
cd infrastructure
cdk deploy --context env=dev

# 2. Upload content
cd ..
./scripts/upload-content.sh dev

# 3. Deploy frontend
./scripts/deploy-frontend.sh dev
```

See [DEPLOYMENT.md](../DEPLOYMENT.md) for complete deployment instructions.
