import { requireRole } from '@/lib/auth';

import {
  cancelAdminBooking,
} from '@/lib/services/booking.service';

export async function PATCH(request, { params }) {
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

    const booking = cancelAdminBooking(Number(id));

    return Response.json(
      {
        success: true,
        message: 'Booking cancelled successfully',
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
            ? 'Failed to cancel booking'
            : error.message,
      },
      { status }
    );
  }
}