'use client'

import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { Button } from '../../../../components/ui/button';
import { api } from '../../../../../convex/_generated/api';
import { Doc, Id } from '../../../../../convex/_generated/dataModel';

export default function CreateBackupButton({ website, classNames }: { website: Doc<"websites">, classNames?: string }) {

  const { title, sanityConfig } = website;
  const { projectId, dataset, apiVersion, token } = sanityConfig;

  const createBackup = useMutation(api.backups.createBackup);
  const updateBackup = useMutation(api.backups.updateBackup);

  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateBackup() {
    setIsLoading(true);

    try {
      
      const backup = await createBackup({
        websiteId: website._id,
        status: "pending",
      });

      toast.success('Backup started');

      const response = await fetch(`/api/backup/${projectId}/${dataset}/${apiVersion}/${token}/${title}`);
      const data = await response.json();

      if (data.status === "OK" && data.backupId) {
        await pollBackupStatus(data.backupId, backup);
      } else {
        throw new Error('Failed to start backup');
      }

    } catch (error) {
      console.error('Backup failed:', error);
      toast.error('Backup failed');
    } finally {
      setIsLoading(false);
    }
  }

  async function pollBackupStatus(backupId: string, convexBackupId: Id<"backups">) {

    const maxAttempts = 60;
    let attempts = 0;

    const poll = async (): Promise<void> => {
      try {
        const statusResponse = await fetch(`/api/backup/status/${backupId}`);
        const statusData = await statusResponse.json();

        if (statusData.status === 'completed') {
          await updateBackup({
            id: convexBackupId,
            websiteId: website._id,
            s3Location: statusData.s3Location || '',
            status: "success",
          });
          toast.success('Backup completed successfully');
          return;
        } else if (statusData.status === 'failed') {
          await updateBackup({
            id: convexBackupId,
            websiteId: website._id,
            s3Location: '',
            status: "error",
          });
          toast.error(`Backup failed: ${statusData.error || 'Unknown error'}`);
          return;
        } else if (statusData.status === 'exporting' || statusData.status === 'uploading') {
          toast.info(`Backup in progress: ${statusData.message}`);
        }

        attempts++;
        
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        } else {
          await updateBackup({
            id: convexBackupId,
            websiteId: website._id,
            s3Location: '',
            status: "error",
          });
          toast.error('Backup timed out');
        }
      } catch (error) {
        console.error('Error polling backup status:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        } else {
          await updateBackup({
            id: convexBackupId,
            websiteId: website._id,
            s3Location: '',
            status: "error",
          });
          toast.error('Backup status polling failed');
        }
      }
    };

    setTimeout(poll, 2000);
  }

  return (
    <Button 
      onClick={handleCreateBackup}
      disabled={isLoading}
      className={cn('w-36 rounded-none h-full px-6', classNames)}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          Please Wait
          <Loader2 className='w-4 h-4 animate-spin' />
        </span>
      ): (
        "Create Backup"
      )}
    </Button>
  )
}