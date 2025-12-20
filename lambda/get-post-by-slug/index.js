const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({});
const CONTENT_BUCKET = process.env.CONTENT_BUCKET;

/**
 * Lambda handler to get a single post by slug
 * Reads from S3 bucket: posts/{slug}/meta.json and posts/{slug}/article.md
 * Returns 404 if post not found or not published
 */
exports.handler = async (event) => {
    const slug = event.pathParameters?.slug;
    console.log('GetPostBySlug invoked', {
        requestId: event.requestContext?.requestId,
        slug,
    });

    if (!slug) {
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: 'Missing slug parameter',
            }),
        };
    }

    try {
        // Fetch meta.json
        const metaResponse = await s3.send(
            new GetObjectCommand({
                Bucket: CONTENT_BUCKET,
                Key: `posts/${slug}/meta.json`,
            })
        );
        const metaContent = await streamToString(metaResponse.Body);
        const meta = JSON.parse(metaContent);

        // Check if post is published
        if (meta.status !== 'published') {
            console.log(`Post ${slug} is not published`, { status: meta.status });
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    error: 'Post not found',
                }),
            };
        }

        // Fetch article.md
        const articleResponse = await s3.send(
            new GetObjectCommand({
                Bucket: CONTENT_BUCKET,
                Key: `posts/${slug}/article.md`,
            })
        );
        const articleContent = await streamToString(articleResponse.Body);

        // Optionally generate pre-signed URL for hero image if it exists
        let heroImageUrl = null;
        if (meta.hero_image_key) {
            // In production, you'd generate a pre-signed URL or use CloudFront
            heroImageUrl = `https://${CONTENT_BUCKET}.s3.amazonaws.com/${meta.hero_image_key}`;
        }

        console.log(`Successfully fetched post: ${slug}`);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
            },
            body: JSON.stringify({
                ...meta,
                content: articleContent,
                hero_image_url: heroImageUrl,
            }),
        };
    } catch (error) {
        console.error('Error fetching post:', error);

        // Handle file not found
        if (error.name === 'NoSuchKey') {
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    error: 'Post not found',
                }),
            };
        }

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message,
            }),
        };
    }
};

/**
 * Helper function to convert stream to string
 */
async function streamToString(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf-8');
}
