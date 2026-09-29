import { logger } from '@/lib/observability/logger';
import { logRequest } from '@/lib/observability/route';
import { createNewBooking, toGuestTicket } from '@/lib/services/booking.service';

async function handlePOST(request) {
  try {
    const body = await request.json();

    const booking = createNewBooking(body);

    logger.info('booking.created', {
      bookingId: booking.id,
      reference: booking.booking_reference,
      activity: booking.activity_slug,
      pack: booking.pack_slug,
      date: booking.date,
      time: booking.time,
      guests: booking.guests,
      total: booking.total_price,
    });

    return Response.json(
      {
        success: true,
        data: await toGuestTicket(booking),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    const status = error.status || 500;

    logger.warn('booking.rejected', {
      status,
      reason: error.message,
      remainingGuests: error.remaining_guests,
    });

    return Response.json(
      {
        success: false,
        error:
          status === 500
            ? 'Failed to create booking'
            : error.message,
        ...(error.details && {
          details: error.details,
        }),
        ...(error.remaining_guests !== undefined && {
          remaining_guests: error.remaining_guests,
        }),
      },
      {
        status,
      }
    );
  }
}

export const POST = logRequest(
  handlePOST,
  'POST /api/bookings'
);
