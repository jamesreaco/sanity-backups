import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createFilename } from './utils/lib';
import { createClient } from '@sanity/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const exportDataset = require('@sanity/export');

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const backupStatus = new Map<string, {
  status: 'pending' | 'exporting' | 'uploading' | 'completed' | 'failed';
  message: string;
  progress?: number;
  error?: string;
  s3Location?: string;
  etag?: string;
  startTime: number;
}>();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

app.get('/api/backup/:projectId/:dataset/:apiVersion/:token', async (req, res) => {
  
  const { projectId, dataset, apiVersion, token } = req.params;
  const backupId = `${projectId}-${dataset}-${Date.now()}`;
  
  backupStatus.set(backupId, {
    status: 'pending',
    message: 'Starting backup process...',
    startTime: Date.now(),
  });
  
  performBackup(backupId, projectId, dataset, apiVersion, token).catch(error => {
    console.error('Background backup failed:', error);
    backupStatus.set(backupId, {
      status: 'failed',
      message: 'Backup failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      startTime: Date.now(),
    });
  });
  
  res.json({
    status: 'OK',
    message: 'Backup started',
    backupId: backupId,
  });
});

async function performBackup(backupId: string, projectId: string, dataset: string, apiVersion: string, token: string) {
  try {
    console.log(`Starting backup for project: ${projectId}, dataset: ${dataset}`);

    const client = createClient({
      projectId: projectId,
      dataset: dataset,
      apiVersion: apiVersion,
      token: token,
      useCdn: false,
    });

    const filename = createFilename(projectId, dataset);
    
    backupStatus.set(backupId, {
      status: 'exporting',
      message: 'Exporting data',
      startTime: Date.now(),
    });
    
    console.log(`Beginning export of ${filename}`);

    const newExport = exportDataset({
      client: client,
      dataset: dataset,
      outputPath: filename,
      assets: true,
      raw: false,
      drafts: true,
      assetConcurrency: 12,
    });

    const exportRes = await newExport;
    
    backupStatus.set(backupId, {
      status: 'uploading',
      message: 'Uploading to S3...',
      startTime: Date.now(),
    });
    
    console.log('Export finished, reading file...');
    
    const fileContent = fs.readFileSync(filename);

    console.log('Uploading to S3...');
    
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

    backupStatus.set(backupId, {
      status: 'completed',
      message: 'Backup completed successfully',
      s3Location: filename,
      etag: s3Result.ETag,
      startTime: Date.now(),
    });
    
  } catch (error) {
    console.error('Backup process failed:', error);
    
    const filename = createFilename(projectId, dataset);

    if (fs.existsSync(filename)) {
      try {
        fs.unlinkSync(filename);
      } catch (cleanupError) {
        console.error('Failed to cleanup file:', cleanupError);
      }
    }
    
    backupStatus.set(backupId, {
      status: 'failed',
      message: 'Backup failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      startTime: Date.now(),
    });
    
    throw error;
  }
}

app.get('/api/backup/status/:backupId', (req, res) => {

  const { backupId } = req.params;
  const status = backupStatus.get(backupId);
  
  if (!status) {
    return res.status(404).json({
      status: 'ERROR',
      message: 'Backup not found',
    });
  }
  
  res.json({
    status: status.status,
    message: status.message,
    progress: status.progress,
    error: status.error,
    s3Location: status.s3Location,
    etag: status.etag,
    startTime: status.startTime,
    duration: Date.now() - status.startTime,
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Sanity Backup Service - Need a route!');
});