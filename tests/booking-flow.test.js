/**
 * End-to-end service test for the booking flow (activity XOR pack).
 * Runs against a throw-away SQLite database created from database/schema.sql,
 * so it never touches data/visitmlaline.sqlite.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const root = process.cwd();
const workspace = mkdtempSync(join(tmpdir(), 'visitimlaline-'));

mkdirSync(join(workspace, 'data'), { recursive: true });
mkdirSync(join(workspace, 'database'), { recursive: true });

const db = new DatabaseSync(join(workspace, 'data', 'visitmlaline.sqlite'));

db.exec(readFileSync(join(root, 'database', 'schema.sql'), 'utf8'));

db.prepare(
  `INSERT INTO activities (slug, title, category, price_from, duration_min, duration_max, active)
   VALUES (?, ?, ?, ?, ?, ?, 1)`
).run('quad-adventure', 'Quad Adventure', 'quad', 45, 60, 120);

db.prepare(
  `INSERT INTO packs (slug, title, price_from, duration, active)
   VALUES (?, ?, ?, ?, 1)`
).run('the-sunset', 'The Sunset', 70, '2-3 hours');

db.close();

process.chdir(workspace);

const {
  createNewBooking,
  cancelAdminBooking,
  getBookingByGuestAccess,
  toAdminBooking,
} = await import('../src/lib/services/booking.service.js');

const {
  getActivityAvailability,
  getPackAvailability,
  CAPACITY_PER_SLOT,
} = await import('../src/lib/services/availability.service.js');

const { getAllBookings } = await import('../src/lib/db/bookings.js');

const DATE = '2031-06-15';
const BASE = {
  customer_name: 'Yassine Test',
  email: 'yassine@example.com',
  phone: '+212600000000',
  date: DATE,
  time: '10:00',
  guests: 2,
};

test('books an activity and prices it from the database', () => {
  const booking = createNewBooking({
    ...BASE,
    activity_slug: 'quad-adventure',
  });

  assert.equal(booking.activity_slug, 'quad-adventure');
  assert.equal(booking.pack_slug, null);
  assert.equal(booking.base_price, 90);
  assert.equal(booking.total_price, 90);
  assert.equal(booking.status, 'NOT PAID YET');
  assert.match(booking.booking_reference, /^BK-[0-9A-F]{8}$/);
  assert.match(booking.access_code, /^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/);
});

test('books a pack on the same slot and capacity model', () => {
  const booking = createNewBooking({
    ...BASE,
    email: 'pack@example.com',
    pack_slug: 'the-sunset',
    guests: 3,
  });

  assert.equal(booking.activity_slug, null);
  assert.equal(booking.pack_slug, 'the-sunset');
  assert.equal(booking.total_price, 210);
});

test('rejects a request that carries both an activity and a pack', () => {
  assert.throws(
    () =>
      createNewBooking({
        ...BASE,
        email: 'both@example.com',
        activity_slug: 'quad-adventure',
        pack_slug: 'the-sunset',
      }),
    (error) => {
      assert.equal(error.status, 422);
      assert.ok(error.details.activity_slug);
      assert.ok(error.details.pack_slug);
      return true;
    }
  );
});

test('rejects a request with no product at all', () => {
  assert.throws(
    () =>
      createNewBooking({
        ...BASE,
        email: 'none@example.com',
      }),
    (error) => {
      assert.equal(error.status, 422);
      assert.ok(error.details.activity_slug);
      return true;
    }
  );
});

test('rejects an unknown product with 404', () => {
  assert.throws(
    () =>
      createNewBooking({
        ...BASE,
        email: 'ghost@example.com',
        pack_slug: 'does-not-exist',
      }),
    (error) => {
      assert.equal(error.status, 404);
      assert.equal(error.message, 'Pack not found');
      return true;
    }
  );
});

test('rejects an unknown time slot with 422', () => {
  assert.throws(
    () =>
      createNewBooking({
        ...BASE,
        email: 'slot@example.com',
        activity_slug: 'quad-adventure',
        time: '23:00',
      }),
    (error) => {
      assert.equal(error.status, 422);
      assert.equal(error.message, 'Invalid time slot');
      return true;
    }
  );
});

test('rejects a duplicate booking for the same product, email, date and slot', () => {
  assert.throws(
    () =>
      createNewBooking({
        ...BASE,
        activity_slug: 'quad-adventure',
      }),
    (error) => {
      assert.equal(error.status, 409);
      return true;
    }
  );
});

test('keeps activity and pack capacity pools independent', () => {
  const activitySlots = getActivityAvailability(
    'quad-adventure',
    DATE
  );

  const packSlots = getPackAvailability('the-sunset', DATE);

  assert.equal(activitySlots.length, 4);
  assert.equal(packSlots.length, 4);
  assert.equal(activitySlots[0].capacity, CAPACITY_PER_SLOT);
  assert.equal(activitySlots[0].booked_guests, 2);
  assert.equal(packSlots[0].booked_guests, 3);
  assert.equal(activitySlots[0].available, true);
});

test('enforces the capacity of 8 guests per slot', () => {
  const filling = createNewBooking({
    ...BASE,
    email: 'filler@example.com',
    activity_slug: 'quad-adventure',
    time: '14:00',
    guests: CAPACITY_PER_SLOT,
  });

  assert.equal(filling.guests, CAPACITY_PER_SLOT);

  assert.throws(
    () =>
      createNewBooking({
        ...BASE,
        email: 'too-many@example.com',
        activity_slug: 'quad-adventure',
        time: '14:00',
        guests: 1,
      }),
    (error) => {
      assert.equal(error.status, 409);
      assert.equal(error.remaining_guests, 0);
      return true;
    }
  );
});

test('reports a full slot as unavailable', () => {
  createNewBooking({
    ...BASE,
    email: 'full@example.com',
    activity_slug: 'quad-adventure',
    time: '16:30',
    guests: CAPACITY_PER_SLOT,
  });

  const slot = getActivityAvailability(
    'quad-adventure',
    DATE
  ).find((entry) => entry.time === '16:30');

  assert.equal(slot.available, false);
  assert.equal(slot.remaining_guests, 0);
});

test('a cancelled booking releases its capacity and allows a new one', () => {
  cancelAdminBooking(
    getAllBookings({}).find(
      (row) => row.email === 'full@example.com'
    ).id
  );

  const replacement = createNewBooking({
    ...BASE,
    email: 'replacement@example.com',
    activity_slug: 'quad-adventure',
    time: '16:30',
    guests: 2,
  });

  assert.equal(replacement.status, 'NOT PAID YET');
});

test('guest access echoes back the code they just proved they hold', () => {
  const created = createNewBooking({
    ...BASE,
    email: 'guest@example.com',
    activity_slug: 'quad-adventure',
    time: '17:30',
  });

  const found = getBookingByGuestAccess(
    created.booking_reference,
    created.access_code
  );

  assert.equal(found.id, created.id);

  // Safe to return: the caller had to supply this exact code to get here,
  // and the guest ticket needs it to rebuild the check-in QR later.
  assert.equal(found.access_code, created.access_code);

  assert.throws(
    () =>
      getBookingByGuestAccess(
        created.booking_reference,
        'AAAA-AAAA-AAAA'
      ),
    (error) => {
      assert.equal(error.status, 401);
      return true;
    }
  );
});

test('admin view masks the access code but keeps a support hint', () => {
  const [row] = getAllBookings({});

  const admin = toAdminBooking(row);

  assert.equal(admin.access_code, undefined);
  assert.ok(admin.access_code_hint.endsWith(row.access_code.slice(-4)));
  assert.equal(admin.id, row.id);
});

test('admin filters work on status, activity and pack', () => {
  assert.equal(
    getAllBookings({ activity: 'quad-adventure' }).length > 0,
    true
  );

  assert.equal(
    getAllBookings({ pack: 'the-sunset' }).length,
    1
  );

  assert.equal(
    getAllBookings({ activity: 'quad-adventure', pack: 'the-sunset' })
      .length,
    0
  );

  assert.equal(
    getAllBookings({ status: 'NOT PAID YET' }).every(
      (row) => row.status === 'NOT PAID YET'
    ),
    true
  );
});
