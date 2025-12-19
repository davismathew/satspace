import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { getS3ObjectAsJson, getS3ObjectAsString } from './utils/s3-utils';
import { PostMeta, PostDetailResponse, ErrorResponse } from './types';

const CONTENT_BUCKET = process.env.CONTENT_BUCKET!;

/**
 * Validates slug format (alphanumeric, hyphens, underscores only)
 */
function isValidSlug(slug: string): boolean {
    return /^[a-zA-Z0-9_-]+$/.test(slug);
}

export const handler = async (
    event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
    console.log('GetPostBySlug handler invoked', { event });

    try {
        // Extract slug from path parameters
        const slug = event.pathParameters?.slug;

        if (!slug) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: 'InvalidParameter',
                    message: 'Slug parameter is required',
                } as ErrorResponse),
            };
        }

        // Validate slug format to prevent path traversal
        if (!isValidSlug(slug)) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: 'InvalidParameter',
                    message: 'Invalid slug format',
                } as ErrorResponse),
            };
        }

        const metaKey = `posts/${slug}/meta.json`;
        const articleKey = `posts/${slug}/article.md`;

        console.log(`Fetching post: ${slug}`);

        // Fetch meta.json and article.md in parallel
        const [meta, articleMarkdown] = await Promise.all([
            getS3ObjectAsJson<PostMeta>(CONTENT_BUCKET, metaKey),
            getS3ObjectAsString(CONTENT_BUCKET, articleKey),
        ]);

        // Check if post is published
        if (meta.status && meta.status !== 'published') {
            console.log(`Post ${slug} is not published (status: ${meta.status})`);
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: 'NotFound',
                    message: 'Post not found',
                } as ErrorResponse),
            };
        }

        const response: PostDetailResponse = {
            meta,
            article_markdown: articleMarkdown,
            hero_image_key: meta.hero_image_key,
        };

        console.log(`Successfully fetched post: ${slug}`);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=600', // Cache for 10 minutes
            },
            body: JSON.stringify(response),
        };
    } catch (error: any) {
        console.error('Error in GetPostBySlug handler:', error);

        // Handle 404 errors from S3
        if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: 'NotFound',
                    message: 'Post not found',
                } as ErrorResponse),
            };
        }

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: 'InternalServerError',
                message: 'Failed to fetch post',
            } as ErrorResponse),
        };
    }
};
