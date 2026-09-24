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
export function getUnreadNotifications() {
  const statement = db.prepare(`
    SELECT
      id,
      booking_id,
      type,
      message,
      created_at,
      read_at
    FROM notifications
    WHERE read_at IS NULL
    ORDER BY created_at DESC, id DESC
  `);

  return statement.all();
}

export function getReadNotifications() {
  const statement = db.prepare(`
    SELECT
      id,
      booking_id,
      type,
      message,
      created_at,
      read_at
    FROM notifications
    WHERE read_at IS NOT NULL
    ORDER BY created_at DESC, id DESC
  `);

  return statement.all();
}

export function markNotificationAsRead(id) {
  const statement = db.prepare(`
    UPDATE notifications
    SET read_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  const result = statement.run(id);

  return result.changes;
}

export function markNotificationAsUnread(id) {
  const statement = db.prepare(`
    UPDATE notifications
    SET read_at = NULL
    WHERE id = ?
  `);

  const result = statement.run(id);

  return result.changes;
}