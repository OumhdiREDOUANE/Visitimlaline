import { createNewBooking } from '@/lib/services/booking.service';

export async function POST(request) {
  try {
    const body = await request.json();

    const booking = createNewBooking(body);

    return Response.json(
      {
        success: true,
        data: booking,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    

    const status = error.status || 500;

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