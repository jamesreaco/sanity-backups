'use server'

import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

export async function deleteBackupFromS3({ objectKey }: { objectKey: string }) {
  
  try {
    
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: objectKey,
    });

    const response = await s3Client.send(command);

    return {
      success: true,
      data: {
        deleted: true,
        objectKey,
        versionId: response.VersionId,
      },
    };

  } catch (error) {
    console.error('Error deleting from S3:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  };
};
