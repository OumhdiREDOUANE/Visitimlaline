export const LOCALES = ['fr', 'en'];

export const DEFAULT_LOCALE = 'fr';

export const LOCALE_COOKIE = 'visitimlaline_locale';

export const LOCALE_LABELS = { fr: 'Français', en: 'English' };

export function normalizeLocale(value) {
  return LOCALES.includes(value) ? value : DEFAULT_LOCALE;
}
