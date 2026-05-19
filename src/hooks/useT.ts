import { useCallback, useSyncExternalStore } from 'react';
import { useI18nStore } from '@/store/i18n.store';
import { en } from '@/i18n/locales/en';
import { ru } from '@/i18n/locales/ru';
import { uz } from '@/i18n/locales/uz';

const dictionaries = { uz, ru, en } as const;
type Lang = 'uz' | 'ru' | 'en';

// useSyncExternalStore ning client snapshot funksiyasi
function subscribe(cb: () => void) {
  return useI18nStore.subscribe(cb);
}
function getClientSnapshot() {
  const s = useI18nStore.getState();
  // Agar hydrate bo'lmagan bo'lsa, doim 'uz' qaytaramiz (SSR bilan mos)
  return s._hasHydrated ? s.language : 'uz';
}
function getServerSnapshot(): Lang {
  return 'uz';
}

/**
 * `useT` — hydration-safe i18n hook.
 *
 * Server va client'ning birinchi render'i ikkalasi ham 'uz' tilida bo'ladi.
 * `I18nHydrator` mount bo'lib, `_hasHydrated = true` qilgandan keyin
 * komponentlar avtomatik qayta render bo'lib, haqiqiy tilga o'tadi.
 */
export function useT() {
  const language = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  return useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = dictionaries[language as Lang] as Record<string, string>;
      let value: string = dict[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          value = value.replace(new RegExp(`{${k}}`, 'g'), String(v));
        }
      }
      return value;
    },
    [language]
  );
}