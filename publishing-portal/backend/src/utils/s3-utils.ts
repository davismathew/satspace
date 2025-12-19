import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

/**
 * Converts an S3 stream to a UTF-8 string
 */
export async function streamToString(stream: any): Promise<string> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString('utf-8');
}

/**
 * Gets an object from S3 and returns its content as a string
 */
export async function getS3ObjectAsString(
    bucket: string,
    key: string
): Promise<string> {
    try {
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });
        const response = await s3Client.send(command);
        return await streamToString(response.Body);
    } catch (error: any) {
        console.error(`Error fetching S3 object ${bucket}/${key}:`, error);
        throw error;
    }
}

/**
 * Gets an object from S3 and parses it as JSON
 */
export async function getS3ObjectAsJson<T>(
    bucket: string,
    key: string
): Promise<T> {
    const content = await getS3ObjectAsString(bucket, key);
    try {
        return JSON.parse(content);
    } catch (error: any) {
        console.error(`Error parsing JSON from ${bucket}/${key}:`, error);
        throw new Error(`Invalid JSON in S3 object: ${key}`);
    }
}

/**
 * Checks if an S3 object exists
 */
export async function s3ObjectExists(
    bucket: string,
    key: string
): Promise<boolean> {
    try {
        await getS3ObjectAsString(bucket, key);
        return true;
    } catch (error: any) {
        if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
            return false;
        }
        throw error;
    }
}
