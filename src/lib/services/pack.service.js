import { getAllPacks } from '../db/packs.js';
import { normalizeLocale } from '../i18n/config.js';
import { getCatalogTranslation } from '../i18n/catalog.js';

function parseJsonField(value, fallback = []) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function formatPack(pack, locale = 'fr') {
  if (!pack) {
    return null;
  }

  const formatted = {
    ...pack,
    includes: parseJsonField(pack.includes),
    active: Boolean(pack.active),
  };

  const translation = getCatalogTranslation(
    normalizeLocale(locale),
    'packs',
    pack.slug
  );

  return translation ? { ...formatted, ...translation } : formatted;
}

export function getPacks(locale = 'fr') {
  const packs = getAllPacks();

  return packs.map((pack) => formatPack(pack, locale));
}