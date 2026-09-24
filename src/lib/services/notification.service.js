import {
  createNotification,
  getAllNotifications,
  getUnreadNotifications,
  getReadNotifications,
  markNotificationAsRead,
  markNotificationAsUnread,
} from '../db/notifications';

import { sendTelegramMessage } from './telegram.service';

export async function createArrivalNotification(booking) {
 const message = `
🔔 New Arrival

Booking: #${booking.id}
Customer: ${booking.customer_name}
Activity: ${booking.activity_slug}
Date: ${booking.date}
Time: ${booking.time}
Guests: ${booking.guests}
Status: ${booking.status}
`.trim();

  const notificationId = createNotification({
    booking_id: booking.id,
    type: 'ARRIVAL',
    message,
  });

  try {
    await sendTelegramMessage(message);
  } catch (error) {
    console.error(
      'Failed to send Telegram notification:',
      error.message
    );
  }

  return notificationId;
}

export function getAdminNotifications() {
  return getAllNotifications();
}

export function getAdminUnreadNotifications() {
  return getUnreadNotifications();
}

export function getAdminReadNotifications() {
  return getReadNotifications();
}

export function markAdminNotificationAsRead(id) {
  return markNotificationAsRead(id);
}

export function markAdminNotificationAsUnread(id) {
  return markNotificationAsUnread(id);
}