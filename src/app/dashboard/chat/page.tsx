/* eslint-disable import/no-unresolved */
'use client';

import ChatInterface from '@/features/chat/chatInterface';

export default function Home() {
  return (
    <div className='bg-background h-screen w-full'>
      <ChatInterface />
    </div>
  );
}
