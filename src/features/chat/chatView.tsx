'use client';

import { useRef, useEffect } from 'react';
import Message from './message';
import { Message as MessageType, User } from './mockData';
import { ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';
import Image from 'next/image';

interface ChatViewProps {
  messages: MessageType[];
  onBackClick?: () => void;
  user: User;
  isMobile?: boolean;
}

export default function ChatView({
  messages,
  onBackClick,
  user,
  isMobile = false
}: ChatViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [messages]);

  return (
    <div className='bg-background flex h-full flex-1 flex-col'>
      {/* Chat header */}
      <div className='border-border bg-background sticky top-0 z-10 flex items-center border-b p-3'>
        {isMobile && (
          <div className='mr-2 md:hidden'>
            <button
              className='hover:bg-muted/50 rounded-full p-2'
              onClick={onBackClick}
            >
              <ArrowLeft size={20} />
            </button>
          </div>
        )}

        <div className='flex flex-1 items-center'>
          <div className='relative'>
            <div className='h-10 w-10 overflow-hidden rounded-full'>
              <Image
                src={user.avatar}
                alt={user.name}
                width={40}
                height={40}
                className='object-cover'
              />
            </div>
            {user.isOnline && (
              <div className='border-background absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 bg-green-500'></div>
            )}
          </div>
          <div className='ml-3'>
            <h2 className='font-medium'>{user.name}</h2>
            <p className='text-muted-foreground text-xs'>
              {user.isOnline ? 'Online' : 'Last seen recently'}
            </p>
          </div>
        </div>

        <div className='flex'>
          <button className='hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-full p-2'>
            <Phone size={20} />
          </button>
          <button className='hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-full p-2'>
            <Video size={20} />
          </button>
          <button className='hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-full p-2'>
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className='flex flex-1 flex-col gap-2 overflow-y-auto p-4'>
        {messages.length > 0 ? (
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        ) : (
          <div className='flex flex-1 items-center justify-center'>
            <p className='text-muted-foreground'>No messages yet</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input (disabled as per requirements) */}
      <div className='border-border bg-background border-t p-3'>
        <div className='bg-muted flex items-center rounded-full p-3'>
          <input
            type='text'
            placeholder='Write a message...'
            className='text-foreground flex-1 bg-transparent focus:outline-none'
            disabled
          />
        </div>
        <p className='text-muted-foreground mt-2 text-center text-xs'>
          This is a static demo. Message functionality is not implemented yet.
        </p>
      </div>
    </div>
  );
}
