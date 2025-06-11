"use client"

import React from 'react';
import { useQuery } from 'convex/react';
import { Settings } from 'lucide-react';
import { BackupsTable } from "./BackupsTable";
import { Backup } from "./BackupsTableColumns";
import { Button } from '@/components/ui/button';
import { api } from '../../../../../convex/_generated/api';
import { Doc, Id } from '../../../../../convex/_generated/dataModel';
import CreateBackupButton from '@/app/websites/[id]/components/CreateBackupButton';
import WebsiteSettingsDialog from '@/app/websites/[id]/components/WebsiteSettingsDialog';

export default function PageClient({ id }: { id: Id<"websites"> }) {

  const website = useQuery(api.websites.getWebsite, { id: id });
  const backups = useQuery(api.backups.listBackups, { websiteId: id }) as Backup[] | undefined;

  return (
    <div>
      <div className="w-full h-12 pl-12 flex items-center justify-between border-b bg-white">
        <div className=" pl-4 h-full border-l text-lg font-medium flex items-center">
          {website?.title}
        </div>
        <div className='h-full flex items-center'>
          <WebsiteSettingsDialog website={website as Doc<"websites">}>
            <Button variant="outline" className='rounded-none h-full px-4 border-y-0 border-r-0 group'>
              <Settings className="group-hover:rotate-180 transition-transform duration-500" />
            </Button>
          </WebsiteSettingsDialog>
          {website && <CreateBackupButton website={website} />}
        </div>
      </div>
      <div className="p-12">
        {website && (
          <BackupsTable data={backups || []} website={website} />
        )}
      </div>
    </div>
  )
};