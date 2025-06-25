/* eslint-disable import/no-unresolved */
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { User } from './mockData';

interface UserItemProps {
  user: User;
  isActive: boolean;
  onClick: () => void;
}

export default function UserItem({ user, isActive, onClick }: UserItemProps) {
  const lastMessage = user.lastMessage || '';
  const formattedTime = user.lastMessageTime || '';

  return (
    <div
      className={cn(
        'hover:bg-muted/50 flex cursor-pointer items-center p-3 transition-colors duration-200',
        isActive && 'bg-muted'
      )}
      onClick={onClick}
    >
      <div className='relative'>
        <div className='h-12 w-12 overflow-hidden rounded-full'>
          <Image
            src={user.avatar}
            alt={user.name}
            width={48}
            height={48}
            className='object-cover'
          />
        </div>
        {user.isOnline && (
          <div className='border-card absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 bg-green-500'></div>
        )}
      </div>
      <div className='ml-3 flex-1 overflow-hidden'>
        <div className='flex items-center justify-between'>
          <h3 className='truncate font-medium'>{user.name}</h3>
          <span className='text-muted-foreground text-xs'>{formattedTime}</span>
        </div>
        <p className='text-muted-foreground truncate text-sm'>{lastMessage}</p>
      </div>
      {user.unreadCount > 0 && (
        <div className='bg-primary text-primary-foreground ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-xs font-medium'>
          {user.unreadCount}
        </div>
      )}
    </div>
  );
}
