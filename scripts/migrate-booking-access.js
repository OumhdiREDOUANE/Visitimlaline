const crypto = require('crypto');
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const databasePath = path.join(
  process.cwd(),
  'data',
  'visitmlaline.sqlite'
);

const db = new DatabaseSync(databasePath);

function generateBookingReference() {
  while (true) {
    const reference =
      `BK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const exists = db
      .prepare(`
        SELECT id
        FROM bookings
        WHERE booking_reference = ?
        LIMIT 1
      `)
      .get(reference);

    if (!exists) {
      return reference;
    }
  }
}

function generateAccessCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  while (true) {
    let code = '';

    for (let i = 0; i < 12; i++) {
      code += chars[crypto.randomInt(0, chars.length)];
    }

    code =
      `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}`;

    const exists = db
      .prepare(`
        SELECT id
        FROM bookings
        WHERE access_code = ?
        LIMIT 1
      `)
      .get(code);

    if (!exists) {
      return code;
    }
  }
}

try {
  const columns = db
    .prepare(`PRAGMA table_info(bookings)`)
    .all();

  const hasReference = columns.some(
    (column) => column.name === 'booking_reference'
  );

  const hasAccessCode = columns.some(
    (column) => column.name === 'access_code'
  );

  if (!hasReference) {
    db.exec(`
      ALTER TABLE bookings
      ADD COLUMN booking_reference TEXT
    `);

    console.log('Added booking_reference');
  }

  if (!hasAccessCode) {
    db.exec(`
      ALTER TABLE bookings
      ADD COLUMN access_code TEXT
    `);

    console.log('Added access_code');
  }

  const bookings = db
    .prepare(`
      SELECT id
      FROM bookings
      WHERE booking_reference IS NULL
         OR access_code IS NULL
    `)
    .all();

  db.exec('BEGIN');

  try {
    const update = db.prepare(`
      UPDATE bookings
      SET
        booking_reference = ?,
        access_code = ?
      WHERE id = ?
    `);

    for (const booking of bookings) {
      const reference = generateBookingReference();
      const accessCode = generateAccessCode();

      update.run(
        reference,
        accessCode,
        booking.id
      );

      console.log(
        `Booking ${booking.id}: ${reference} / ${accessCode}`
      );
    }

    db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS
      idx_bookings_reference
      ON bookings(booking_reference)
    `);

    db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS
      idx_bookings_access_code
      ON bookings(access_code)
    `);

    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }

  console.log('Booking access migration completed.');
} catch (error) {
  console.error('Migration failed:', error);
  process.exitCode = 1;
} finally {
  db.close();
}