import { getActivityBySlug } from '../db/activities';

import {
  createBooking,
  findDuplicateBooking,
  getBookedGuests,
  getBookingById,
  markBookingAsArrived,
  getAllBookings
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

    const bookingId = createBooking({
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
export function markBookingArrived(id) {
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

  createArrivalNotification(updatedBooking);

  return updatedBooking;
}


export function getAdminBookings() {
  return getAllBookings();
}