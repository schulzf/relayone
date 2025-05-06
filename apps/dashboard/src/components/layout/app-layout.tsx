'use client';

import type React from 'react';
import {useEffect, useState} from 'react';

import {MainNav} from '@/components/layout/main-nav';
import {MobileNav} from '@/components/layout/mobile-nav';
import {ModeToggle} from '@/components/layout/mode-toggle';
import {UserNav} from '@/components/layout/user-nav';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MobileNav />
          <MainNav className="hidden md:flex" />
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">{children}</main>
    </div>
  );
}
