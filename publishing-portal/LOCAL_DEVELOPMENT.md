# Local Development Setup

This guide will help you test the publishing portal locally before deploying to AWS.

## Quick Start

### 1. Start the Local API Server

```bash
# In terminal 1 - Start the backend API server
cd backend
npm run dev
```

This starts an Express server on `http://localhost:3000` that reads from the local `content/` folder.

### 2. Start the Frontend Dev Server

```bash
# In terminal 2 - Start the React dev server
cd frontend
npm run dev
```

This starts the Vite dev server on `http://localhost:5173`

### 3. Open Your Browser

Navigate to `http://localhost:5173` and you'll see:
- Homepage with article listings
- Article cards with sample space news
- Navigation between pages
- Tag filtering
- Full article pages with markdown rendering

## What's Running

**Backend API Server** (`http://localhost:3000`):
- GET `/posts` - Lists all articles
- GET `/posts/:slug` - Gets individual article
- Reads from `content/` folder
- No AWS required!

**Frontend Dev Server** (`http://localhost:5173`):
- React app with hot reload
- Automatically calls backend API
- Instant updates as you edit code

## Testing Features

### Test Homepage
- Visit `http://localhost:5173`
- See featured article (first in list)
- See grid of remaining articles
- Check responsive design (resize browser)

### Test Article Pages
- Click any article card
- See full article with markdown
- Check metadata (author, date, tags)
- Test back navigation

### Test Tag Filtering
- Click a tag on any article
- See filtered results
- Check URL updates to `/?tag=commercial`

### Test Pagination
- Modify `posts-index.json` to add more posts
- Test pagination controls appear
- Click Next/Previous buttons

## Making Changes

All changes hot-reload automatically:

**Edit Frontend**:
- Modify any `.tsx`, `.css` file in `frontend/src/`
- Browser refreshes instantly

**Edit Content**:
- Modify articles in `content/posts/*/article.md`
- Update `content/posts-index.json`
- Refresh browser to see changes

**Edit Styles**:
- Update CSS files
- See changes immediately

## Adding New Articles Locally

1. Create folder: `content/posts/my-new-article/`
2. Add `meta.json`:
```json
{
  "slug": "my-new-article",
  "title": "My New Article",
  "excerpt": "This is a test article",
  "tags": ["test"],
  "author": "Your Name",
  "published_at": "2025-12-19T10:00:00Z",
  "updated_at": "2025-12-19T10:00:00Z",
  "reading_time_minutes": 3,
  "status": "published"
}
```
3. Add `article.md`:
```markdown
# My New Article

This is the content of my test article.

## Section 1
Content here...
```
4. Update `content/posts-index.json` to include the new article
5. Refresh browser

## Stopping Servers

Press `Ctrl+C` in each terminal to stop the servers.

## Troubleshooting

**Port 3000 already in use?**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Port 5173 already in use?**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**API not connecting?**
- Check backend server is running on port 3000
- Check `frontend/.env.example` - API URL should be `http://localhost:3000`
- Frontend should automatically use this in dev mode

## Next Steps

Once you're happy with local testing:
1. Run `./scripts/deploy.sh` to deploy to AWS
2. Update frontend with production API URL
3. Rebuild and deploy frontend

Enjoy testing! 🚀
