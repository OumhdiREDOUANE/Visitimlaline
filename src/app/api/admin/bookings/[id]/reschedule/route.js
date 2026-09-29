import { logRequest } from '@/lib/observability/route';
import { requireRole } from '@/lib/auth';

import {
  rescheduleAdminBooking,
  toAdminBooking,
} from '@/lib/services/booking.service';

async function handlePATCH(request, { params }) {
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

    const body = await request.json();

    const booking = rescheduleAdminBooking(
      Number(id),
      body
    );

    return Response.json(
      {
        success: true,
        message: 'Booking rescheduled successfully',
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
            ? 'Failed to reschedule booking'
            : error.message,
        ...(error.remaining_guests !== undefined && {
          remaining_guests: error.remaining_guests,
        }),
      },
      { status }
    );
  }
}

export const PATCH = logRequest(handlePATCH, 'PATCH /api/admin/bookings/{id}/reschedule');
