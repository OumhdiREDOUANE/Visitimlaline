import { logRequest } from '@/lib/observability/route';
import { requireRole } from '@/lib/auth';
import {
  getAdminBookings,
  toAdminBooking,
} from '@/lib/services/booking.service';

async function handleGET(request) {
  try {
    requireRole(request, ['admin', 'staff']);

    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const activity = searchParams.get('activity');
    const pack = searchParams.get('pack');

    const filters = {
      status: status || null,
      activity: activity || null,
      pack: pack || null,
    };

    const bookings = getAdminBookings(filters);

    return Response.json(
      {
        success: true,
        filters,
        data: bookings.map(toAdminBooking),
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

export const GET = logRequest(handleGET, 'GET /api/admin/bookings');
