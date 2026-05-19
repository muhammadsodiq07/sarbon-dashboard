'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useI18nStore, type Language } from '@/store/i18n.store';

const LANGS: { code: Language; label: string; flag: string }[] = [
  { code: 'uz', label: 'O‘zbek', flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

// Hydration-safe: server va birinchi client render'da har doim 'uz'
function subscribe(cb: () => void) { return useI18nStore.subscribe(cb); }
function getClient() {
  const s = useI18nStore.getState();
  return s._hasHydrated ? s.language : 'uz';
}
function getServer(): Language { return 'uz'; }

export function LanguageSwitcher() {
  const language = useSyncExternalStore(subscribe, getClient, getServer);
  const setLanguage = useI18nStore((s) => s.setLanguage);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const current = LANGS.find((l) => l.code === language) ?? LANGS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="uppercase">{current.code}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-40 animate-fade-in rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          {LANGS.map((l) => (
            <li key={l.code}>
              <button
                role="option"
                aria-selected={l.code === language}
                onClick={() => {
                  setLanguage(l.code);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50',
                  l.code === language && 'font-semibold text-emerald-700'
                )}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}