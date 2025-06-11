'use server'

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export async function downloadBackup({ objectKey }: { objectKey: string }) {
  
  try {
    
    const s3Client = new S3Client({
      region:  process.env.AWS_REGION || 'us-east-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: objectKey,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      throw new Error('No response body received from S3')
    };

    const chunks: Uint8Array[] = [];
    const stream = response.Body as Readable;

    for await (const chunk of stream) {
      chunks.push(chunk);
    };

    const buffer = Buffer.concat(chunks);

    return {
      success: true,
      data: buffer.toString('base64'),
      contentType: response.ContentType || 'application/octet-stream',
      contentLength: response.ContentLength || buffer.length,
      fileName: objectKey.split('/').pop() || 'download.tar.gz',
    };

  } catch (error) {
    console.error('Error downloading from S3:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  };
};