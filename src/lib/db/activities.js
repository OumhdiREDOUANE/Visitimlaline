import { db } from './index';

export function getAllActivities() {
  const statement = db.prepare(`
    SELECT
      id,
      slug,
      title,
      category,
      description,
      price_from,
      duration_min,
      duration_max,
      hero,
      gallery,
      inclusions,
      good_to_know,
      itinerary,
      active,
      created_at,
      updated_at
    FROM activities
    WHERE active = 1
    ORDER BY id ASC
  `);

  return statement.all();
}
export function getActivityBySlug(slug) {
  const statement = db.prepare(`
    SELECT
      id,
      slug,
      title,
      category,
      description,
      price_from,
      duration_min,
      duration_max,
      hero,
      gallery,
      inclusions,
      good_to_know,
      itinerary,
      active,
      created_at,
      updated_at
    FROM activities
    WHERE slug = ?
      AND active = 1
    LIMIT 1
  `);

  return statement.get(slug);
}