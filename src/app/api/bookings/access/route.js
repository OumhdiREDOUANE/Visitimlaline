import {
  getBookingByGuestAccess,
} from '@/lib/services/booking.service';

export async function POST(request) {
  try {
    const body = await request.json();

    const booking = getBookingByGuestAccess(
      body.booking_reference,
      body.access_code
    );

    return Response.json({
      success: true,
      data: booking,
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