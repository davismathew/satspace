const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const CONTENT_DIR = path.join(__dirname, '../content');

app.use(cors());
app.use(express.json());

// GET /posts - List all posts with filtering and pagination
app.get('/posts', async (req, res) => {
    try {
        const { tag, limit = 20, offset = 0 } = req.query;

        // Read posts index
        const indexPath = path.join(CONTENT_DIR, 'posts-index.json');
        const indexContent = await fs.readFile(indexPath, 'utf-8');
        const postsIndex = JSON.parse(indexContent);

        // Filter by tag if specified
        let filteredPosts = postsIndex;
        if (tag) {
            filteredPosts = postsIndex.filter(post => post.tags.includes(tag));
        }

        // Sort by published_at descending
        filteredPosts.sort((a, b) => {
            return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
        });

        // Apply pagination
        const total = filteredPosts.length;
        const paginatedPosts = filteredPosts.slice(
            parseInt(offset),
            parseInt(offset) + parseInt(limit)
        );

        res.json({
            items: paginatedPosts,
            total,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        console.log(`✓ GET /posts - Returned ${paginatedPosts.length} of ${total} posts`);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            error: 'InternalServerError',
            message: 'Failed to fetch posts',
        });
    }
});

// GET /posts/:slug - Get single post
app.get('/posts/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        // Validate slug format
        if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
            return res.status(400).json({
                error: 'InvalidParameter',
                message: 'Invalid slug format',
            });
        }

        const postDir = path.join(CONTENT_DIR, 'posts', slug);
        const metaPath = path.join(postDir, 'meta.json');
        const articlePath = path.join(postDir, 'article.md');

        // Read meta.json and article.md
        const [metaContent, articleContent] = await Promise.all([
            fs.readFile(metaPath, 'utf-8'),
            fs.readFile(articlePath, 'utf-8'),
        ]);

        const meta = JSON.parse(metaContent);

        // Check if published
        if (meta.status && meta.status !== 'published') {
            return res.status(404).json({
                error: 'NotFound',
                message: 'Post not found',
            });
        }

        res.json({
            meta,
            article_markdown: articleContent,
            hero_image_key: meta.hero_image_key,
        });

        console.log(`✓ GET /posts/${slug} - Success`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(404).json({
                error: 'NotFound',
                message: 'Post not found',
            });
        }

        console.error('Error fetching post:', error);
        res.status(500).json({
            error: 'InternalServerError',
            message: 'Failed to fetch post',
        });
    }
});

app.listen(PORT, () => {
    console.log('');
    console.log('🚀 Local Development Server');
    console.log('============================');
    console.log(`API Server: http://localhost:${PORT}`);
    console.log('');
    console.log('Available endpoints:');
    console.log(`  GET /posts`);
    console.log(`  GET /posts/:slug`);
    console.log('');
    console.log('Press Ctrl+C to stop');
    console.log('');
});
