'use client';

import {
  createContext,
  useContext,
  useMemo,
} from 'react';

import {
  LOCALE_COOKIE,
  normalizeLocale,
} from '@/lib/i18n/config.js';
import { createTranslator } from '@/lib/i18n/translate.js';

const LocaleContext = createContext(null);

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function LocaleProvider({
  locale,
  dictionary,
  children,
}) {
  const value = useMemo(
    () => ({
      locale,
      t: createTranslator(dictionary),
      setLocale(next) {
        document.cookie = [
          `${LOCALE_COOKIE}=${normalizeLocale(next)}`,
          'path=/',
          `max-age=${COOKIE_MAX_AGE}`,
          'samesite=lax',
        ].join('; ');
      },
    }),
    [locale, dictionary]
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error(
      'useI18n must be used inside a LocaleProvider'
    );
  }

  return context;
}
