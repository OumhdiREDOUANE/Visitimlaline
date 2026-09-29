import { logRequest } from '@/lib/observability/route';
import { requireRole } from '@/lib/auth';
import {
  markBookingArrivedByAccess,
  toAdminBooking,
} from '@/lib/services/booking.service';

async function handlePOST(request) {
  try {
    requireRole(request, ['admin', 'staff']);

    const body = await request.json();

    const booking =
      await markBookingArrivedByAccess(
        body.booking_reference,
        body.access_code
      );

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
            ? 'Failed to mark booking as arrived'
            : error.message,
      },
      { status }
    );
  }
}

export const POST = logRequest(
  handlePOST,
  'POST /api/admin/bookings/arrive'
);
