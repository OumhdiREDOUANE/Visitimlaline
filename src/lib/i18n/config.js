export const LOCALES = ['fr', 'en'];

export const DEFAULT_LOCALE = 'fr';

export const LOCALE_COOKIE = 'visitimlaline_locale';
export const CURRENCY_COOKIE = 'visitimlaline_currency';
export const CURRENCIES = ['MAD', 'EUR'];

export const LOCALE_LABELS = { fr: 'Français', en: 'English' };

export function normalizeLocale(value) {
  return LOCALES.includes(value) ? value : DEFAULT_LOCALE;
}

export function normalizeCurrency(value) {
  return CURRENCIES.includes(value) ? value : 'MAD';
}
