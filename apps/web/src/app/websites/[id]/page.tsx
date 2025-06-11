import React from 'react';
import PageClient from './components/PageClient';
import { Id } from '../../../../convex/_generated/dataModel';

export default async function WesbitePage({ params }: { 
  params: Promise<{ id: string }> 
}) {

  const { id } = await params;
  
  return (
    <div className='pattern-bg h-screen'>
      <PageClient id={id as Id<"websites">} />
    </div>
  )
};