import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
import { createFilename } from './utils/lib';
import { createClient } from '@sanity/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const exportDataset = require('@sanity/export');

dotenv.config();

const app = express();
const PORT = 3001;

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

app.get('/api/backup/:projectId/:dataset/:apiVersion/:token', async (req, res) => {
  
  const { projectId, dataset, apiVersion, token } = req.params;
  
  try {

    const client = createClient({
      projectId: projectId,
      dataset: dataset,
      apiVersion: apiVersion,
      token: token,
      useCdn: false,
    });

    const filename = createFilename(projectId, dataset);
    
    const newExport = exportDataset({
      client: client,
      dataset: dataset,
      outputPath: filename,
      assets: true,
      raw: false,
      drafts: true,
      assetConcurrency: 12,
    });

    console.log(`Beginning export of ${filename}`);

    const exportRes = await newExport;
    
    console.log('Export finished', exportRes);
    
    const fileContent = fs.readFileSync(filename);
    
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${filename}`,
      Body: fileContent,
      ContentType: 'application/gzip',
      Metadata: {
        projectId: projectId,
        dataset: dataset,
        exportDate: new Date().toISOString(),
      },
    };

    const command = new PutObjectCommand(uploadParams);
    const s3Result = await s3Client.send(command);
    
    console.log('Backup uploaded to S3 successfully', s3Result);

    fs.unlinkSync(filename);

    res.send({
      status: 'OK',
      message: 'Backup was successful and uploaded to S3',
      s3Location: `${filename}`,
      etag: s3Result.ETag,
    });
    
  } catch (error) {
    console.error('Backup process failed:', error);
    
    const filename = createFilename(projectId, dataset);
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }
    
    res.status(500).json({
      status: 'ERROR',
      message: 'Backup failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Sanity Backup Service - Need a route!');
});