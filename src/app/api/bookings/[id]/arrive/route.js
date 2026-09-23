import { markBookingArrived } from '@/lib/services/booking.service';

export async function POST(request, { params }) {
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

    const booking = markBookingArrived(Number(id));

    return Response.json(
      {
        success: true,
        data: booking,
      },
      { status: 200 }
    );
  } catch (error) {
    

    const status = error.status || 500;

    return Response.json(
      {
        success: false,
        error:
          status === 500
            ? 'Failed to mark booking as arrived'
            : error.message,
      },
      { status }
    );
  }
}