import { getBookedGuests } from '../db/bookings.js';

export const SLOTS = [
  '10:00',
  '14:00',
  '16:30',
  '17:30',
];

export const CAPACITY_PER_SLOT = 8;

function buildSlots(scope, date) {
  return SLOTS.map((time) => {
    const bookedGuests = getBookedGuests(
      scope,
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

export function getActivityAvailability(
  activitySlug,
  date
) {
  return buildSlots(
    { activitySlug, packSlug: null },
    date
  );
}

export function getPackAvailability(
  packSlug,
  date
) {
  return buildSlots(
    { activitySlug: null, packSlug },
    date
  );
}
