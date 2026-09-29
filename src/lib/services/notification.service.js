import {
  createNotification,
  getAllNotifications,
  getUnreadNotifications,
  getReadNotifications,
  markNotificationAsRead,
  markNotificationAsUnread,
} from '../db/notifications.js';

import { logger } from '../observability/logger.js';
import { sendTelegramMessage } from './telegram.service.js';

export async function createArrivalNotification(booking) {
 const product = booking.activity_slug
   ? `Activity: ${booking.activity_slug}`
   : `Pack: ${booking.pack_slug}`;

 const message = `
🔔 New Arrival

Booking: #${booking.id}
Customer: ${booking.customer_name}
${product}
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
    logger.warn('telegram.notification_failed', {
      notificationId,
      bookingId: booking.id,
      error: error.message,
    });
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