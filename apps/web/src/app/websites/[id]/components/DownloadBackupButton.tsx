'use client'

import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { downloadBackup } from '@/actions/downloadBackup';

export default function DownloadBackupButton({ disabled, objectKey }: { disabled?: boolean, objectKey: string }) {

  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {

    setIsDownloading(true);
    setError(null);

    try {

      const result = await downloadBackup({ objectKey: objectKey });

      if (result.success && result.data) {
        
        const binaryString = atob(result.data);
        const bytes = new Uint8Array(binaryString.length);
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        };

        const blob = new Blob([bytes], { type: result.contentType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a')
        a.href = url;
        a.download = result.fileName;
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Download successful');
        
      } else {
        toast.error('Download failed');
        setError(result.error || 'Download failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed')
    } finally {
      setIsDownloading(false)
    }
  };

  return (
    <div className="">
      <Button
        onClick={handleDownload}
        disabled={isDownloading || disabled}
        variant="secondary"
        className='w-36'
        size='sm'
      >
        {isDownloading ? (
          <span className="flex items-center gap-2">
            Downloading
            <Loader2 className='w-4 h-4 animate-spin' />
          </span>
        ): (
          "Download Backup"
        )}
      </Button>
      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700">
          Error: {error}
        </div>
      )}
    </div>
  )
};