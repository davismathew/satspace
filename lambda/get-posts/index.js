const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({});
const CONTENT_BUCKET = process.env.CONTENT_BUCKET;
const INDEX_KEY = process.env.INDEX_KEY || 'posts-index.json';

/**
 * Lambda handler to get list of all published posts
 * Reads from S3 bucket: posts-index.json
 * Returns only posts with status === 'published'
 */
exports.handler = async (event) => {
    console.log('GetPosts invoked', { requestId: event.requestContext?.requestId });

    try {
        // Fetch posts index from S3
        const response = await s3.send(
            new GetObjectCommand({
                Bucket: CONTENT_BUCKET,
                Key: INDEX_KEY,
            })
        );

        const indexContent = await streamToString(response.Body);
        const allPosts = JSON.parse(indexContent);

        // Filter for published posts only
        const publishedPosts = allPosts.filter(
            (post) => post.status === 'published'
        );

        console.log(`Returning ${publishedPosts.length} published posts`);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Configure based on your domain
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
            },
            body: JSON.stringify({
                posts: publishedPosts,
                count: publishedPosts.length,
            }),
        };
    } catch (error) {
        console.error('Error fetching posts:', error);

        // Handle file not found
        if (error.name === 'NoSuchKey') {
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    error: 'Posts index not found',
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
