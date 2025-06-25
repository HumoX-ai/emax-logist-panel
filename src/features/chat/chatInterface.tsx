'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import ChatView from './chatView';
import { mockUsers, mockMessages } from './mockData';

export default function ChatInterface() {
  // Dastlab activeUserId ni null qilamiz, ya'ni hech qanday chat tanlanmagan
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const activeUser = activeUserId
    ? mockUsers.find((user) => user.id === activeUserId)
    : null;
  const activeChat = activeUserId ? mockMessages[activeUserId] || [] : [];

  return (
    <div className='flex h-full w-full overflow-hidden'>
      {/* Sidebar with responsive width */}
      <div
        className={`${isSidebarVisible ? 'block' : 'hidden'} max-w-[320px] md:block md:w-1/3 lg:w-1/4`}
      >
        <Sidebar
          users={mockUsers}
          activeUserId={activeUserId || ''}
          onSelectUser={setActiveUserId}
        />
      </div>

      {/* Chat view with flexible width */}
      <div className='min-w-0 flex-1'>
        {activeUser ? (
          <ChatView
            messages={activeChat}
            user={activeUser}
            onBackClick={() => setIsSidebarVisible(true)}
            isMobile={!isSidebarVisible}
          />
        ) : (
          <div className='flex h-full items-center justify-center'>
            <div className='text-center'>
              <h3 className='mb-2 text-2xl font-medium text-gray-700 dark:text-gray-300'>
                Chat tizimi
              </h3>
              <p className='text-muted-foreground mb-6'>
                Suhbat boshlash uchun chap tomondagi ro&#39;yxatdan foydalanuvchini
                tanlang
              </p>
              <div className='md:hidden'>
                <button
                  onClick={() => setIsSidebarVisible(true)}
                  className='bg-primary text-primary-foreground rounded-md px-4 py-2'
                >
                  Chatlarni ko&#39;rsatish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
