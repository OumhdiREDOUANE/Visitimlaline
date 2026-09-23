import { requireRole } from '@/lib/auth';
import { getAdminBookings } from '@/lib/services/booking.service';

export async function GET(request) {
  try {
    const user = requireRole(request, ['admin', 'staff']);

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
    const status = error.status || 500;

    return Response.json(
      {
        success: false,
        error:
          status === 500
            ? 'Failed to fetch admin bookings'
            : error.message,
      },
      {
        status,
      }
    );
  }
}