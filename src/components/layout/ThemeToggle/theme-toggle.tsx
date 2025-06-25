'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';

export default function ModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();

  const handleThemeToggle = React.useCallback(
    (e?: React.MouseEvent) => {
      const newMode = resolvedTheme === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;

      if (!document.startViewTransition) {
        setTheme(newMode);
        return;
      }

      // Set coordinates from the click event
      if (e) {
        root.style.setProperty('--x', `${e.clientX}px`);
        root.style.setProperty('--y', `${e.clientY}px`);
      }

      document.startViewTransition(() => {
        setTheme(newMode);
      });
    },
    [resolvedTheme, setTheme]
  );

  return (
    <Button
      variant='outline'
      size='icon'
      className='bg-background h-8 w-8 rounded-full'
      onClick={handleThemeToggle}
      aria-label='Toggle theme'
      data-state={theme === 'dark' ? 'dark' : 'light'}
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
