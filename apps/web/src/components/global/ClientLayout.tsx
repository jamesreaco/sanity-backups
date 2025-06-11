"use client"

import React from 'react';
import { Toaster } from '../ui/sonner';
import { PrimarySidebar } from './PrimarySidebar';
import { ConvexClientProvider } from '@/providers/ConvexClientProvider';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {

  return (
    <ConvexClientProvider>
      <SidebarProvider>
        <PrimarySidebar />
        <main className='relative w-full'>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
      <Toaster />
    </ConvexClientProvider>
  );
};