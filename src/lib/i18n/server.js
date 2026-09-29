import { cookies } from 'next/headers';

import fr from './dictionaries/fr.js';
import en from './dictionaries/en.js';
import {
  LOCALE_COOKIE,
  normalizeLocale,
} from './config.js';
import { createTranslator } from './translate.js';

const DICTIONARIES = { fr, en };

export function getDictionary(locale) {
  return DICTIONARIES[normalizeLocale(locale)];
}

export async function getLocale() {
  const store = await cookies();

  return normalizeLocale(store.get(LOCALE_COOKIE)?.value);
}

export async function getI18n() {
  const locale = await getLocale();

  return {
    locale,
    t: createTranslator(getDictionary(locale)),
  };
}
