import {
  getAllActivities,
  getActivityBySlug,
} from '../db/activities';

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

function formatActivity(activity) {
  if (!activity) {
    return null;
  }

  return {
    ...activity,
    gallery: parseJsonField(activity.gallery),
    inclusions: parseJsonField(activity.inclusions),
    good_to_know: parseJsonField(activity.good_to_know),
    itinerary: parseJsonField(activity.itinerary),
    active: Boolean(activity.active),
  };
}

export function getActivities() {
  const activities = getAllActivities();

  return activities.map(formatActivity);
}
export function getActivity(slug) {
  const activity = getActivityBySlug(slug);

  return formatActivity(activity);
}