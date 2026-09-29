import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

import { buildScanPayload } from '../src/lib/qr/payload.js';

/**
 * `database/seed.sql` had drifted out of sync with `database/schema.sql`: the
 * demo bookings still predated the `booking_reference` / `access_code`
 * columns, which are `NOT NULL`, so `npm run db:init && npm run db:seed` died
 * on a fresh database. Nothing caught it because the live database had been
 * created before those columns existed and the seed only ever ran against it.
 *
 * These tests build a real database from the two files in a scratch in-memory
 * instance, which is the only way to see the drift: a seeded database is the
 * thing that has to work.
 */

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (relative) =>
  readFileSync(join(ROOT, relative), 'utf8');

const schema = read('database/schema.sql');
const seed = read('database/seed.sql');

/** Applies schema then seed to a throwaway database, exactly like init+seed. */
function freshDatabase() {
  const db = new DatabaseSync(':memory:');

  db.exec(schema);
  db.exec(seed);

  return db;
}

test('the seed applies cleanly to a database built from the schema', () => {
  // DatabaseSync#exec throws on the first constraint it cannot satisfy, so
  // reaching the assertion is the pass condition.
  const db = freshDatabase();

  try {
    assert.ok(
      db.prepare('SELECT COUNT(*) c FROM activities').get().c > 0
    );
  } finally {
    db.close();
  }
});

test('every seeded booking carries the columns the schema requires', () => {
  const db = freshDatabase();

  try {
    const bookings = db
      .prepare(
        'SELECT booking_reference, access_code FROM bookings'
      )
      .all();

    assert.ok(bookings.length > 0, 'the seed has no demo bookings');

    for (const booking of bookings) {
      assert.ok(
        booking.booking_reference,
        'a seeded booking has no booking_reference'
      );
      assert.ok(
        booking.access_code,
        'a seeded booking has no access_code'
      );
    }
  } finally {
    db.close();
  }
});

test('seeded booking references and access codes are unique', () => {
  const db = freshDatabase();

  try {
    const rows = db
      .prepare(
        'SELECT booking_reference, access_code FROM bookings'
      )
      .all();
    const references = rows.map((row) => row.booking_reference);
    const codes = rows.map((row) => row.access_code);

    assert.equal(
      new Set(references).size,
      references.length,
      'duplicate booking_reference in the seed'
    );
    assert.equal(
      new Set(codes).size,
      codes.length,
      'duplicate access_code in the seed'
    );
  } finally {
    db.close();
  }
});

test('every seeded booking produces a scannable QR payload', () => {
  // The point of the demo rows is that a tester can open the ticket, print the
  // QR and scan it at the counter. A code the payload builder rejects would
  // make a seeded booking quietly un-check-in-able.
  const db = freshDatabase();

  try {
    for (const booking of db
      .prepare(
        'SELECT booking_reference, access_code FROM bookings'
      )
      .all()) {
      const payload = buildScanPayload(booking);

      assert.ok(
        payload,
        `${booking.booking_reference} / ${booking.access_code} ` +
          'does not match the scan payload format'
      );
      assert.match(
        payload,
        /^BK-[0-9A-F]{8}\|[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/
      );
    }
  } finally {
    db.close();
  }
});

test('the seed notification resolves to a real booking', () => {
  const db = freshDatabase();

  try {
    const orphan = db
      .prepare(
        `SELECT COUNT(*) c
         FROM notifications n
         LEFT JOIN bookings b ON b.id = n.booking_id
         WHERE b.id IS NULL`
      )
      .get().c;

    assert.equal(orphan, 0, 'a seeded notification points nowhere');
  } finally {
    db.close();
  }
});

test('every seeded foreign key resolves', () => {
  const db = freshDatabase();

  try {
    const orphans = db
      .prepare(
        `SELECT COUNT(*) c
         FROM bookings b
         WHERE (b.activity_slug IS NOT NULL
                AND NOT EXISTS (
                  SELECT 1 FROM activities a WHERE a.slug = b.activity_slug
                ))
            OR (b.pack_slug IS NOT NULL
                AND NOT EXISTS (
                  SELECT 1 FROM packs p WHERE p.slug = b.pack_slug
                ))`
      )
      .get().c;

    assert.equal(orphans, 0, 'a seeded booking points at no real product');
  } finally {
    db.close();
  }
});
