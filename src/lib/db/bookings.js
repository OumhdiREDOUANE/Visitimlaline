import { db } from './index';

export function getBookedGuests(activitySlug, date, time) {
  const statement = db.prepare(`
    SELECT COALESCE(SUM(guests), 0) AS booked_guests
    FROM bookings
    WHERE activity_slug = ?
      AND date = ?
      AND time = ?
      AND status != 'CANCELLED'
  `);

  const result = statement.get(
    activitySlug,
    date,
    time
  );

  return Number(result.booked_guests || 0);
}

export function findDuplicateBooking(
  activitySlug,
  email,
  date,
  time
) {
  const statement = db.prepare(`
    SELECT
      id,
      activity_slug,
      customer_name,
      email,
      date,
      time,
      guests,
      total_price,
      status
    FROM bookings
    WHERE activity_slug = ?
      AND email = ?
      AND date = ?
      AND time = ?
      AND status != 'CANCELLED'
    LIMIT 1
  `);

  return statement.get(
    activitySlug,
    email,
    date,
    time
  );
}

export function createBooking(data) {
  const statement = db.prepare(`
    INSERT INTO bookings (
      activity_slug,
      pack_slug,
      customer_name,
      email,
      phone,
      date,
      time,
      guests,
      base_price,
      addon_price,
      total_price,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = statement.run(
    data.activity_slug,
    data.pack_slug ?? null,
    data.customer_name,
    data.email,
    data.phone,
    data.date,
    data.time,
    data.guests,
    data.base_price,
    data.addon_price,
    data.total_price,
    data.status
  );

  return Number(result.lastInsertRowid);
}

export function getBookingById(id) {
  const statement = db.prepare(`
    SELECT
      id,
      activity_slug,
      pack_slug,
      customer_name,
      email,
      phone,
      date,
      time,
      guests,
      base_price,
      addon_price,
      total_price,
      status,
      created_at,
      arrived_at
    FROM bookings
    WHERE id = ?
    LIMIT 1
  `);

  return statement.get(id);
}
export function markBookingAsArrived(id) {
  const statement = db.prepare(`
    UPDATE bookings
    SET
      status = 'ARRIVED',
      arrived_at = CURRENT_TIMESTAMP
    WHERE id = ?
      AND status != 'ARRIVED'
  `);

  const result = statement.run(id);

  return result.changes;
}
export function getAllBookings() {
  const statement = db.prepare(`
    SELECT
      id,
      activity_slug,
      pack_slug,
      customer_name,
      email,
      phone,
      date,
      time,
      guests,
      base_price,
      addon_price,
      total_price,
      status,
      created_at,
      arrived_at
    FROM bookings
    ORDER BY date ASC, time ASC, id DESC
  `);

  return statement.all();
}