import { getActivityBySlug } from '../db/activities.js';
import { getPackBySlug } from '../db/packs.js';
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

} from '../db/bookings.js';

import {
  dbTransaction,
  commitTransaction,
  rollbackTransaction,
} from '../db/index.js';

import {
  SLOTS,
  CAPACITY_PER_SLOT,
} from './availability.service.js';

import { calculateBookingPrice } from './pricing.service.js';

import { validateBooking } from '../validation/booking.validation.js';

import { createArrivalNotification } from './notification.service.js';
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

/**
 * An access code lets a guest open their own ticket, so it must never leave
 * the admin endpoints: only its last block stays readable for support.
 */
export function toAdminBooking(booking) {
  if (!booking) {
    return null;
  }

  const { access_code: accessCode, ...rest } = booking;

  return {
    ...rest,
    access_code_hint: accessCode
      ? `••••-••••-${String(accessCode).slice(-4)}`
      : null,
  };
}

function readSlug(value) {
  return typeof value === 'string'
    ? value.trim()
    : '';
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

  const activitySlug = readSlug(data.activity_slug);
  const packSlug = readSlug(data.pack_slug);
  const email = data.email.trim().toLowerCase();
  const time = data.time.trim();
  const guests = Number(data.guests);
  const scope = { activitySlug, packSlug };

  // ==========================================
  // 2. VALID TIME SLOT
  // ==========================================

  if (!SLOTS.includes(time)) {
    const error = new Error('Invalid time slot');
    error.status = 422;
    throw error;
  }

  // ==========================================
  // 3. RESOLVE THE BOOKED PRODUCT
  // ==========================================

  let source;
  let missingLabel;

  if (activitySlug) {
    source = getActivityBySlug(activitySlug);
    missingLabel = 'Activity not found';
  } else {
    source = getPackBySlug(packSlug);
    missingLabel = 'Pack not found';
  }

  if (!source) {
    const error = new Error(missingLabel);
    error.status = 404;
    throw error;
  }

  // ==========================================
  // 4. DUPLICATE BOOKING CHECK
  // ==========================================

  const duplicate = findDuplicateBooking(
    scope,
    email,
    data.date,
    time
  );

  if (duplicate) {
    const error = new Error(
      'A booking already exists for this customer, product, date and time'
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
      scope,
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

    const pricing = calculateBookingPrice(
      source,
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
      activity_slug: activitySlug || null,
      pack_slug: packSlug || null,
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
  const scope = {
    activitySlug: booking.activity_slug,
    packSlug: booking.pack_slug,
  };

  const duplicate = findDuplicateBooking(
    scope,
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
    scope,
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

/**
 * The guest-facing shape of a booking. The plain row is returned because the
 * guest has just proved they hold the access code, so echoing it back
 * discloses nothing they do not already have — and it is what lets a guest
 * who bookmarked /ticket reopen the same scannable QR months later.
 *
 * The QR itself is rendered on the server so the encoder never ships to the
 * browser; buildScanPayload rejects anything without a valid pair, so an
 * admin-shaped booking simply gets a null here instead of throwing.
 */
export async function toGuestTicket(booking) {
  if (!booking) {
    return null;
  }

  const { renderQrDataUrl } = await import('../qr/render.js');

  return {
    ...booking,
    qr_code: await renderQrDataUrl(booking),
  };
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