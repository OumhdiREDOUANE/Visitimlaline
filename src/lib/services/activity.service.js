import {
  getAllActivities,
  getActivityBySlug,
} from '../db/activities.js';
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

function formatActivity(activity, locale = 'fr') {
  if (!activity) {
    return null;
  }

  const formatted = {
    ...activity,
    gallery: parseJsonField(activity.gallery),
    inclusions: parseJsonField(activity.inclusions),
    good_to_know: parseJsonField(activity.good_to_know),
    itinerary: parseJsonField(activity.itinerary),
    active: Boolean(activity.active),
  };

  const translation = getCatalogTranslation(
    normalizeLocale(locale),
    'activities',
    activity.slug
  );

  return translation ? { ...formatted, ...translation } : formatted;
}

export function getActivities(locale = 'fr') {
  const activities = getAllActivities();

  return activities.map((activity) => formatActivity(activity, locale));
}
export function getActivity(slug, locale = 'fr') {
  const activity = getActivityBySlug(slug);

  return formatActivity(activity, locale);
}