/* eslint-disable import/no-unresolved */
'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { navItems } from '@/constants/data';
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  GalleryVerticalEnd,
  LogOut
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';
import { useGetUserInfoQuery } from '@/lib/api/profileApi';
import { NavMain } from '../nav-main';

export const company = {
  name: 'Emaxb',
  logo: GalleryVerticalEnd,
  plan: 'Enterprise'
};

export default function AppSidebar() {
  const { data: session } = useSession();
  const { data: userInfo } = useGetUserInfoQuery();
  const pathname = usePathname();

  // Helper function to get file URL from key
  const getFileUrl = (key: string) => {
    return `https://file.emaxb.uz/api/files?key=${encodeURIComponent(key)}`;
  };

  const user = userInfo?.data;

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <div className='text-sidebar-accent-foreground flex gap-2 py-2'>
          <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
            <company.logo className='size-4' />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>{company.name}</span>
            <span className='truncate text-xs'>{company.plan}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        <NavMain
          items={navItems.map((item) => ({
            title: item.title,
            url: item.url,
            icon: item.icon ? (Icons[item.icon] as any) : undefined,
            isActive: pathname === item.url
          }))}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage
                      src={user?.photo ? getFileUrl(user.photo) : ''}
                      alt={user?.fullName || session?.user?.name || ''}
                    />
                    <AvatarFallback className='rounded-lg'>
                      {user?.fullName?.slice(0, 2)?.toUpperCase() ||
                        session?.user?.name?.slice(0, 2)?.toUpperCase() ||
                        'CN'}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {user?.fullName || session?.user?.name || ''}
                    </span>
                    <span className='truncate text-xs'>
                      {user?.phone || session?.user?.email || ''}
                    </span>
                  </div>
                  <ChevronsUpDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                    <Avatar className='h-8 w-8 rounded-lg'>
                      <AvatarImage
                        src={user?.photo ? getFileUrl(user.photo) : ''}
                        alt={user?.fullName || session?.user?.name || ''}
                      />
                      <AvatarFallback className='rounded-lg'>
                        {user?.fullName?.slice(0, 2)?.toUpperCase() ||
                          session?.user?.name?.slice(0, 2)?.toUpperCase() ||
                          'CN'}
                      </AvatarFallback>
                    </Avatar>
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-semibold'>
                        {user?.fullName || session?.user?.name || ''}
                      </span>
                      <span className='truncate text-xs'>
                        {user?.phone || session?.user?.email || ''}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href='/dashboard/profile'>
                      <BadgeCheck />
                      Profil
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Bell />
                    Bildirishnomalar
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await fetch('/api/logout');
                    await signOut({ callbackUrl: '/' });
                  }}
                >
                  <LogOut />
                  Chiqish
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
