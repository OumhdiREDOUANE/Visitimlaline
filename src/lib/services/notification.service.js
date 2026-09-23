
import {
  createNotification,
  getAllNotifications,
} from '../db/notifications';

export function createArrivalNotification(booking) {
  return createNotification({
    booking_id: booking.id,
    type: 'ARRIVAL',
    message: `Customer ${booking.customer_name} has arrived.`,
  });
}

export function getAdminNotifications() {
  return getAllNotifications();
}