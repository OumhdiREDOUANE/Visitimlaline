import { db } from './index';

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