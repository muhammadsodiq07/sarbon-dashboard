'use client';
import { useEffect } from 'react';
import { hydrateLanguageFromStorage } from '@/store/i18n.store';

export function I18nHydrator() {
  useEffect(() => {
    hydrateLanguageFromStorage();
  }, []);
  return null;
}