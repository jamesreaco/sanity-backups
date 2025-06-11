'use client'

import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { Button } from '../../../../components/ui/button';
import { api } from '../../../../../convex/_generated/api';
import { Doc } from '../../../../../convex/_generated/dataModel';

export default function CreateBackupButton({ website, classNames }: { website: Doc<"websites">, classNames?: string }) {

  const { sanityConfig } = website;
  const { projectId, dataset, apiVersion, token } = sanityConfig;

  const createBackup = useMutation(api.backups.createBackup);
  const updateBackup = useMutation(api.backups.updateBackup);

  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateBackup() {
    setIsLoading(true);

    toast.success('Backup started');

    const backup = await createBackup({
      websiteId: website._id,
      status: "pending",
    });

    const response = await fetch(`/api/backup/${projectId}/${dataset}/${apiVersion}/${token}`);
    const data = await response.json();

    if (data.status === "OK") {
      await updateBackup({
        id: backup,
        websiteId: website._id,
        s3Location: data.s3Location,
        status: "success",
      });
      toast.success('Backup completed');
    } else {
      await updateBackup({
        id: backup,
        websiteId: website._id,
        s3Location: '',
        status: "error",
      });
      toast.error('Backup failed');
    }

    setIsLoading(false);
  }

  return (
    <Button 
      onClick={handleCreateBackup}
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
};