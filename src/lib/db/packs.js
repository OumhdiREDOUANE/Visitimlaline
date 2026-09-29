import { db } from './index.js';

export function getAllPacks() {
  const statement = db.prepare(`
    SELECT
      id,
      slug,
      title,
      description,
      price_from,
      duration,
      hero,
      includes,
      active,
      created_at,
      updated_at
    FROM packs
    WHERE active = 1
    ORDER BY id ASC
  `);

  return statement.all();
}

export function getPackBySlug(slug) {
  const statement = db.prepare(`
    SELECT
      id,
      slug,
      title,
      description,
      price_from,
      duration,
      hero,
      includes,
      active,
      created_at,
      updated_at
    FROM packs
    WHERE slug = ?
      AND active = 1
    LIMIT 1
  `);

  return statement.get(slug);
}