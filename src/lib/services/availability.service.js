import { getBookedGuests } from '../db/bookings';

export const SLOTS = [
  '10:00',
  '14:00',
  '16:30',
  '17:30',
];

export const CAPACITY_PER_SLOT = 8;

export function getAvailability(activitySlug, date) {
  return SLOTS.map((time) => {
    const bookedGuests = getBookedGuests(
      activitySlug,
      date,
      time
    );

    const remainingGuests = Math.max(
      CAPACITY_PER_SLOT - bookedGuests,
      0
    );

    return {
      time,
      capacity: CAPACITY_PER_SLOT,
      booked_guests: bookedGuests,
      remaining_guests: remainingGuests,
      available: remainingGuests > 0,
    };
  });
}