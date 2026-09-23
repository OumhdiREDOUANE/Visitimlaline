import { getAdminBookings } from '@/lib/services/booking.service';

export async function GET() {
  try {
    const bookings = getAdminBookings();

    return Response.json(
      {
        success: true,
        data: bookings,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    

    return Response.json(
      {
        success: false,
        error: 'Failed to fetch admin bookings',
      },
      {
        status: 500,
      }
    );
  }
}