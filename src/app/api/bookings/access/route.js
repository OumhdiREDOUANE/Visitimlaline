import { logRequest } from '@/lib/observability/route';
import {
  getBookingByGuestAccess,
  toGuestTicket,
} from '@/lib/services/booking.service';

async function handlePOST(request) {
  try {
    const body = await request.json();

    const booking = getBookingByGuestAccess(
      body.booking_reference,
      body.access_code
    );

    return Response.json({
      success: true,
      data: await toGuestTicket(booking),
    });
  } catch (error) {
    const status = error.status || 500;

    return Response.json(
      {
        success: false,
        error:
          status === 500
            ? 'Failed to access booking'
            : error.message,
      },
      {
        status,
      }
    );
  }
}

export const POST = logRequest(
  handlePOST,
  'POST /api/bookings/access'
);
