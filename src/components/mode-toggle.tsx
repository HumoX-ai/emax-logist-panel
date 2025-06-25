/* eslint-disable import/no-unresolved */
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant='outline'
      size='icon'
      className='bg-background h-8 w-8 rounded-full'
      onClick={toggleTheme}
    >
      {theme === 'dark' ? (
        <MoonIcon className='h-[1.2rem] w-[1.2rem]' />
      ) : (
        <SunIcon className='h-[1.2rem] w-[1.2rem]' />
      )}
      <span className='sr-only'>Switch Theme</span>
    </Button>
  );
}
