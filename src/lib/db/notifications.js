import { db } from './index';

export function createNotification({
  booking_id,
  type,
  message,
}) {
  const statement = db.prepare(`
    INSERT INTO notifications (
      booking_id,
      type,
      message
    )
    VALUES (?, ?, ?)
  `);

  const result = statement.run(
    booking_id,
    type,
    message
  );

  return Number(result.lastInsertRowid);
}

export function getAllNotifications() {
  const statement = db.prepare(`
    SELECT
      id,
      booking_id,
      type,
      message,
      created_at,
      read_at
    FROM notifications
    ORDER BY created_at DESC, id DESC
  `);

  return statement.all();
}