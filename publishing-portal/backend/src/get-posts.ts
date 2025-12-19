import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { getS3ObjectAsJson } from './utils/s3-utils';
import { PostIndexItem, PostListResponse, ErrorResponse } from './types';

const CONTENT_BUCKET = process.env.CONTENT_BUCKET!;
const INDEX_KEY = process.env.INDEX_KEY || 'posts-index.json';

export const handler = async (
    event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
    console.log('GetPosts handler invoked', { event });

    try {
        // Parse query parameters
        const params = event.queryStringParameters || {};
        const tag = params.tag;
        const limit = parseInt(params.limit || '20', 10);
        const offset = parseInt(params.offset || '0', 10);

        // Validate parameters
        if (limit < 1 || limit > 100) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: 'InvalidParameter',
                    message: 'Limit must be between 1 and 100',
                } as ErrorResponse),
            };
        }

        if (offset < 0) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: 'InvalidParameter',
                    message: 'Offset must be non-negative',
                } as ErrorResponse),
            };
        }

        // Fetch posts index from S3
        console.log(`Fetching index from s3://${CONTENT_BUCKET}/${INDEX_KEY}`);
        const postsIndex = await getS3ObjectAsJson<PostIndexItem[]>(
            CONTENT_BUCKET,
            INDEX_KEY
        );

        // Filter posts
        let filteredPosts = postsIndex;

        // Filter by tag if specified
        if (tag) {
            filteredPosts = filteredPosts.filter((post) =>
                post.tags.includes(tag)
            );
        }

        // Sort by published_at descending (most recent first)
        filteredPosts.sort((a, b) => {
            const dateA = new Date(a.published_at).getTime();
            const dateB = new Date(b.published_at).getTime();
            return dateB - dateA;
        });

        // Apply pagination
        const total = filteredPosts.length;
        const paginatedPosts = filteredPosts.slice(offset, offset + limit);

        const response: PostListResponse = {
            items: paginatedPosts,
            total,
            limit,
            offset,
        };

        console.log(`Returning ${paginatedPosts.length} posts out of ${total} total`);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
            },
            body: JSON.stringify(response),
        };
    } catch (error: any) {
        console.error('Error in GetPosts handler:', error);

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: 'InternalServerError',
                message: 'Failed to fetch posts',
            } as ErrorResponse),
        };
    }
};
