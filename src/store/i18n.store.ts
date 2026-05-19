import { create } from 'zustand';
import { en } from '@/i18n/locales/en';
import { ru } from '@/i18n/locales/ru';
import { uz } from '@/i18n/locales/uz';

export type Language = 'uz' | 'ru' | 'en';

const dictionaries = { uz, ru, en } as const;

interface I18nState {
  language: Language;
  _hasHydrated: boolean;
  setLanguage: (lang: Language) => void;
  setHasHydrated: (v: boolean) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const STORAGE_KEY = 'sarbon.lang';

export const useI18nStore = create<I18nState>((set) => ({
  // MUHIM: Server va client'ning birinchi render'i bir xil bo'lishi uchun
  // har doim 'uz' bilan boshlanadi.
  language: 'uz',
  _hasHydrated: false,

  setLanguage: (language) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, language);
    }
    set({ language });
  },

  setHasHydrated: (v) => set({ _hasHydrated: v }),

  t: (key, vars) => {
    const dict = dictionaries[useI18nStore.getState().language] as Record<string, string>;
    let value: string = dict[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        value = value.replace(new RegExp(`{${k}}`, 'g'), String(v));
      }
    }
    return value;
  },
}));

/**
 * Faqat client'da, mount bo'lganda chaqirilishi kerak.
 * I18nHydrator komponenti uchun.
 */
export function hydrateLanguageFromStorage() {
  if (typeof window === 'undefined') return;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'uz' || stored === 'ru' || stored === 'en') {
    useI18nStore.setState({ language: stored, _hasHydrated: true });
  } else {
    useI18nStore.setState({ _hasHydrated: true });
  }
}