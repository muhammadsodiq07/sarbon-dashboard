'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { useT } from '@/hooks/useT';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useT();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '#', label: t('nav.dashboard') },
    { href: '/dispatcher/cargo', label: t('nav.cargo'), active: true },
    { href: '#', label: t('nav.my_cargo') },
    { href: '#', label: t('nav.flights') },
    { href: '#', label: t('nav.drivers') },
    { href: '#', label: t('nav.tracking') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/dispatcher/cargo" className="flex shrink-0 items-center">
          <Image
            src="/srb.png"
            alt="Sarbon"
            width={120}
            height={32}
            priority
            className="h-7 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="ml-2 hidden lg:flex lg:items-center lg:gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'rounded-lg px-2.5 py-1.5 text-sm transition-colors',
                item.active
                  ? 'bg-emerald-50 font-medium text-emerald-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 sm:inline-flex"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full border border-white bg-red-500" />
          </button>

          <LanguageSwitcher />

          <div className="hidden items-center gap-2 rounded-full bg-slate-100 py-1 pl-1 pr-3 sm:flex">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-[10px] font-bold text-white">
              SJ
            </span>
            <span className="text-xs font-medium text-slate-700">sardjey</span>
          </div>

          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMobileOpen(v => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-slate-200 bg-white px-4 py-2 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block rounded-lg px-3 py-2 text-sm',
                item.active ? 'bg-emerald-50 font-medium text-emerald-700' : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
