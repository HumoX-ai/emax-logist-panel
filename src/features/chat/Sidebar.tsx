'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { User } from './mockData';
import UserItem from './userItem';

interface SidebarProps {
  users: User[];
  activeUserId: string;
  onSelectUser: (userId: string) => void;
}

export default function Sidebar({
  users,
  activeUserId,
  onSelectUser
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = searchQuery
    ? users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  return (
    <div className='border-border bg-card flex h-full w-full max-w-[320px] flex-col border-r'>
      <div className='border-border bg-card sticky top-0 z-10 border-b p-4'>
        <h1 className='mb-4 text-2xl font-bold'>Messages</h1>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='bg-muted text-foreground w-full rounded-lg p-2 pl-9'
          />
          <Search
            className='text-muted-foreground absolute top-1/2 left-2 -translate-y-1/2 transform'
            size={18}
          />
        </div>
      </div>
      <div className='flex-1 overflow-y-auto'>
        {filteredUsers.map((user) => (
          <UserItem
            key={user.id}
            user={user}
            isActive={user.id === activeUserId}
            onClick={() => onSelectUser(user.id)}
          />
        ))}
      </div>
    </div>
  );
}
