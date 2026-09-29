// scripts/seed-db.js
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const databasePath = join(
  process.cwd(),
  'data',
  'visitmlaline.sqlite'
);

const seedPath = join(
  process.cwd(),
  'database',
  'seed.sql'
);

if (!existsSync(databasePath)) {
  console.error('Database does not exist.');
  console.error('Run "npm run db:init" first.');
  process.exit(1);
}

if (!existsSync(seedPath)) {
  console.error(`Seed file not found: ${seedPath}`);
  process.exit(1);
}

const db = new DatabaseSync(databasePath);

try {
  db.exec(readFileSync(seedPath, 'utf8'));

  const activities = db
    .prepare(
      'SELECT slug, title, category, price_from FROM activities'
    )
    .all();

  const packs = db
    .prepare(
      'SELECT slug, title, price_from FROM packs'
    )
    .all();

  const bookings = db
    .prepare(
      `SELECT id, customer_name, activity_slug, pack_slug,
              date, time, guests, total_price, status
       FROM bookings`
    )
    .all();

  console.log('Demo data inserted successfully.');
  console.log('\nActivities:');
  console.table(activities);
  console.log('\nPacks:');
  console.table(packs);
  console.log('\nBookings:');
  console.table(bookings);
} catch (error) {
  console.error('Seed failed:');
  console.error(error);
  process.exitCode = 1;
} finally {
  db.close();
}
