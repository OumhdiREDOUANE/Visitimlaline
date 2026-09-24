import { requireRole } from '@/lib/auth';
import { getAdminBookings } from '@/lib/services/booking.service';

export async function GET(request) {
  try {
    requireRole(request, ['admin', 'staff']);

    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const activity = searchParams.get('activity');

    const bookings = getAdminBookings({
      status: status || null,
      activity: activity || null,
    });

    return Response.json(
      {
        success: true,
        filters: {
          status: status || null,
          activity: activity || null,
        },
        data: bookings,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    const statusCode = error.status || 500;

    return Response.json(
      {
        success: false,
        error:
          statusCode === 500
            ? 'Failed to fetch admin bookings'
            : error.message,
      },
      {
        status: statusCode,
      }
    );
  }
}