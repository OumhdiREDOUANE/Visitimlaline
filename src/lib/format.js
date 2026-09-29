/**
 * Presentation helpers shared by the public site, the backoffice and the
 * check-in screen. Kept dependency-free on purpose (Intl only).
 */

const INTL_LOCALES = { fr: 'fr-MA', en: 'en-MA' };

export const STATUS_KEYS = {
  'NOT PAID YET': 'notPaidYet',
  ARRIVED: 'arrived',
  CANCELLED: 'cancelled',
};

export function intlLocale(locale) {
  return INTL_LOCALES[locale] ?? INTL_LOCALES.fr;
}

export function formatMoney(amount, locale) {
  const value = Number(amount);

  return new Intl.NumberFormat(intlLocale(locale), {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

/** `YYYY-MM-DD` rendered without any timezone shift. */
export function formatDate(isoDate, locale) {
  const parts = String(isoDate ?? '').slice(0, 10).split('-');

  if (parts.length !== 3) {
    return '';
  }

  const [year, month, day] = parts.map(Number);

  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * `duration_min` / `duration_max` read as a range, or as a single value when
 * only one bound is set or both are equal. The experience cards and the
 * experience page both display it, so the wording lives in one place.
 */
export function formatDurationRange(
  min,
  max,
  t
) {
  const from = toNumber(min);
  const to = toNumber(max);

  if (from === null) {
    return '';
  }

  if (to === null || from === to) {
    return `${from} ${t('common.minutes')}`;
  }

  return `${from}–${to} ${t('common.minutes')}`;
}

/** SQLite `CURRENT_TIMESTAMP` values are UTC without a timezone marker. */
export function parseSqliteDate(value) {
  if (!value) {
    return null;
  }

  const text = String(value).trim();

  if (!text) {
    return null;
  }

  const normalized = text.includes('T')
    ? text
    : text.replace(' ', 'T');

  const withZone = /(?:Z|[+-]\d{2}:?\d{2})$/.test(normalized)
    ? normalized
    : `${normalized}Z`;

  const date = new Date(withZone);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTime(value, locale) {
  const date = parseSqliteDate(value);

  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat(intlLocale(locale), {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Casablanca',
  }).format(date);
}

export function statusKey(status) {
  return STATUS_KEYS[status] ?? 'unknown';
}

export function categoryKey(category) {
  return String(category ?? '')
    .trim()
    .toLowerCase();
}

export function todayISO() {
  const now = new Date();

  const offset = now.getTimezoneOffset() * 60000;

  return new Date(now.getTime() - offset)
    .toISOString()
    .slice(0, 10);
}
