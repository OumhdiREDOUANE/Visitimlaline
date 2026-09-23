import { getBookingById } from '@/lib/db/bookings';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id || !/^\d+$/.test(id)) {
      return Response.json(
        {
          success: false,
          error: 'Invalid booking ID',
        },
        { status: 400 }
      );
    }

    const booking = getBookingById(Number(id));

    if (!booking) {
      return Response.json(
        {
          success: false,
          error: 'Booking not found',
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        data: booking,
      },
      { status: 200 }
    );
  } catch (error) {
   

    return Response.json(
      {
        success: false,
        error: 'Failed to fetch booking',
      },
      { status: 500 }
    );
  }
}