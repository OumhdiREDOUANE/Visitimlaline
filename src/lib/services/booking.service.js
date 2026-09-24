import { getActivityBySlug } from '../db/activities';
import crypto from 'node:crypto';

import {
  createBooking,
  findDuplicateBooking,
  getBookedGuests,
  getBookingById,
  markBookingAsArrived,
   getBookingByAccess,
  getAllBookings,
  cancelBooking,
  rescheduleBooking,

} from '../db/bookings';

import {
  dbTransaction,
  commitTransaction,
  rollbackTransaction,
} from '../db/index';

import {
  SLOTS,
  CAPACITY_PER_SLOT,
} from './availability.service';

import { calculateActivityPrice } from './pricing.service';

import { validateBooking } from '../validation/booking.validation';

import { createArrivalNotification } from './notification.service';
function generateBookingReference() {
  return `BK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

function generateAccessCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  let code = '';

  for (let i = 0; i < 12; i++) {
    const index = crypto.randomInt(0, chars.length);
    code += chars[index];
  }

  return `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}`;
}
export function createNewBooking(data) {
  // ==========================================
  // 1. VALIDATION
  // ==========================================

  const validation = validateBooking(data);

  if (!validation.valid) {
    const error = new Error('Validation failed');
    error.status = 422;
    error.details = validation.errors;
    throw error;
  }

  const activitySlug = data.activity_slug.trim();
  const email = data.email.trim().toLowerCase();
  const time = data.time.trim();
  const guests = Number(data.guests);

  // ==========================================
  // 2. VALID TIME SLOT
  // ==========================================

  if (!SLOTS.includes(time)) {
    const error = new Error('Invalid time slot');
    error.status = 422;
    throw error;
  }

  // ==========================================
  // 3. GET ACTIVITY FROM DATABASE
  // ==========================================

  const activity = getActivityBySlug(activitySlug);

  if (!activity) {
    const error = new Error('Activity not found');
    error.status = 404;
    throw error;
  }

  // ==========================================
  // 4. DUPLICATE BOOKING CHECK
  // ==========================================

  const duplicate = findDuplicateBooking(
    activitySlug,
    email,
    data.date,
    time
  );

  if (duplicate) {
    const error = new Error(
      'A booking already exists for this customer, activity, date and time'
    );

    error.status = 409;
    error.booking = duplicate;

    throw error;
  }

  // ==========================================
  // 5. TRANSACTION
  // ==========================================

  dbTransaction();

  try {
    // ------------------------------------------
    // Check current capacity
    // ------------------------------------------

    const bookedGuests = getBookedGuests(
      activitySlug,
      data.date,
      time
    );

    const remainingGuests =
      CAPACITY_PER_SLOT - bookedGuests;

    // ------------------------------------------
    // Not enough capacity
    // ------------------------------------------

    if (guests > remainingGuests) {
      const error = new Error(
        `Only ${Math.max(remainingGuests, 0)} guest(s) remaining for this slot`
      );

      error.status = 409;
      error.booked_guests = bookedGuests;
      error.remaining_guests = Math.max(
        remainingGuests,
        0
      );

      throw error;
    }

    // ------------------------------------------
    // Calculate price from DB
    // ------------------------------------------

    const pricing = calculateActivityPrice(
      activity,
      guests
    );

    // ------------------------------------------
    // Create booking
    // ------------------------------------------
const bookingReference = generateBookingReference();
const accessCode = generateAccessCode();

const bookingId = createBooking({
  booking_reference: bookingReference,
  access_code: accessCode,
      activity_slug: activitySlug,
      pack_slug: null,
      customer_name: data.customer_name.trim(),
      email,
      phone: data.phone.trim(),
      date: data.date,
      time,
      guests,
      base_price: pricing.base_price,
      addon_price: pricing.addon_price,
      total_price: pricing.total_price,
      status: 'NOT PAID YET',
    });

    const booking = getBookingById(bookingId);

    commitTransaction();

    return booking;
  } catch (error) {
    rollbackTransaction();
    throw error;
  }
}
export async function   markBookingArrived(id) {
  const booking = getBookingById(id);

  if (!booking) {
    const error = new Error('Booking not found');
    error.status = 404;
    throw error;
  }

  if (booking.status === 'ARRIVED') {
    const error = new Error('Booking is already marked as arrived');
    error.status = 409;
    throw error;
  }

  const changes = markBookingAsArrived(id);

  if (changes === 0) {
    const error = new Error('Unable to mark booking as arrived');
    error.status = 409;
    throw error;
  }

  const updatedBooking = getBookingById(id);

  await createArrivalNotification(updatedBooking);

  return updatedBooking;
}


export function getAdminBookings(filters = {}) {
  return getAllBookings(filters);
}
export function cancelAdminBooking(id) {
  const booking = getBookingById(id);

  if (!booking) {
    const error = new Error('Booking not found');
    error.status = 404;
    throw error;
  }

  if (booking.status === 'CANCELLED') {
    const error = new Error('Booking is already cancelled');
    error.status = 409;
    throw error;
  }

  if (booking.status === 'ARRIVED') {
    const error = new Error(
      'Cannot cancel a booking that has already arrived'
    );
    error.status = 409;
    throw error;
  }

  const changes = cancelBooking(id);

  if (changes === 0) {
    const error = new Error('Unable to cancel booking');
    error.status = 409;
    throw error;
  }

  return getBookingById(id);
}
export function rescheduleAdminBooking(id, data) {
  const booking = getBookingById(id);

  if (!booking) {
    const error = new Error('Booking not found');
    error.status = 404;
    throw error;
  }

  if (booking.status === 'CANCELLED') {
    const error = new Error(
      'Cannot reschedule a cancelled booking'
    );
    error.status = 409;
    throw error;
  }

  if (booking.status === 'ARRIVED') {
    const error = new Error(
      'Cannot reschedule a booking that has already arrived'
    );
    error.status = 409;
    throw error;
  }

  const date = data.date?.trim();
  const time = data.time?.trim();

  if (!date || !time) {
    const error = new Error(
      'Date and time are required'
    );
    error.status = 422;
    throw error;
  }

  if (!SLOTS.includes(time)) {
    const error = new Error('Invalid time slot');
    error.status = 422;
    throw error;
  }

  // إذا ما تبدل والو
  if (
    booking.date === date &&
    booking.time === time
  ) {
    const error = new Error(
      'Booking is already scheduled for this date and time'
    );
    error.status = 409;
    throw error;
  }

  // Check duplicate booking
  const duplicate = findDuplicateBooking(
    booking.activity_slug,
    booking.email,
    date,
    time
  );

  if (
    duplicate &&
    Number(duplicate.id) !== Number(id)
  ) {
    const error = new Error(
      'A booking already exists for this customer, activity, date and time'
    );

    error.status = 409;
    error.booking = duplicate;

    throw error;
  }

  // Check capacity
  const bookedGuests = getBookedGuests(
    booking.activity_slug,
    date,
    time
  );

  const remainingGuests =
    CAPACITY_PER_SLOT - bookedGuests;

  if (booking.guests > remainingGuests) {
    const error = new Error(
      `Only ${Math.max(remainingGuests, 0)} guest(s) remaining for this slot`
    );

    error.status = 409;
    error.booked_guests = bookedGuests;
    error.remaining_guests = Math.max(
      remainingGuests,
      0
    );

    throw error;
  }

  const changes = rescheduleBooking(
    id,
    date,
    time
  );

  if (changes === 0) {
    const error = new Error(
      'Unable to reschedule booking'
    );
    error.status = 409;
    throw error;
  }

  return getBookingById(id);
}
export function getAdminBookingDetails(id) {
  const booking = getBookingById(id);

  if (!booking) {
    const error = new Error('Booking not found');
    error.status = 404;
    throw error;
  }

  return booking;
}
export function getBookingByGuestAccess(
  bookingReference,
  accessCode
) {
  const reference = bookingReference?.trim();
  const code = accessCode?.trim();

  if (!reference || !code) {
    const error = new Error(
      'Booking reference and access code are required'
    );

    error.status = 422;
    throw error;
  }

  const booking = getBookingByAccess(
    reference,
    code
  );

  if (!booking) {
    const error = new Error(
      'Invalid booking reference or access code'
    );

    error.status = 401;
    throw error;
  }

  return booking;
}
export async function markBookingArrivedByAccess(
  bookingReference,
  accessCode
) {
  const reference = bookingReference?.trim();
  const code = accessCode?.trim();

  if (!reference || !code) {
    const error = new Error(
      'Booking reference and access code are required'
    );

    error.status = 422;
    throw error;
  }

  const booking = getBookingByAccess(
    reference,
    code
  );

  if (!booking) {
    const error = new Error(
      'Invalid booking reference or access code'
    );

    error.status = 404;
    throw error;
  }

  if (booking.status === 'ARRIVED') {
    const error = new Error(
      'Booking is already marked as arrived'
    );

    error.status = 409;
    throw error;
  }

  if (booking.status === 'CANCELLED') {
    const error = new Error(
      'Cannot mark a cancelled booking as arrived'
    );

    error.status = 409;
    throw error;
  }

  const changes = markBookingAsArrived(
    booking.id
  );

  if (changes === 0) {
    const error = new Error(
      'Unable to mark booking as arrived'
    );

    error.status = 409;
    throw error;
  }

  const updatedBooking =
    getBookingById(booking.id);

  await createArrivalNotification(
    updatedBooking
  );

  return updatedBooking;
}