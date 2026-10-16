import { cookies } from 'next/headers';

import fr from './dictionaries/fr.js';
import en from './dictionaries/en.js';
import {
  LOCALE_COOKIE,
  CURRENCY_COOKIE,
  normalizeLocale,
  normalizeCurrency,
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
  const store = await cookies();
  const currency = normalizeCurrency(
    store.get(CURRENCY_COOKIE)?.value
  );

  return {
    locale,
    currency,
    t: createTranslator(getDictionary(locale)),
  };
}
