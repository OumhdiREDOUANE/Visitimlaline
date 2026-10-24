import { logRequest } from '@/lib/observability/route';
import { requireRole } from '@/lib/auth';

import {
  getBookingDetails,
  toAdminBooking,
} from '@/lib/services/booking.service';

async function handleGET(request, { params }) {
  try {
    requireRole(request, ['admin', 'staff']);

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

    const booking = getBookingDetails(Number(id));

    return Response.json(
      {
        success: true,
        data: toAdminBooking(booking),
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
            ? 'Failed to fetch booking details'
            : error.message,
      },
      { status }
    );
  }
}

export const GET = logRequest(handleGET, 'GET /api/admin/bookings/{id}');
