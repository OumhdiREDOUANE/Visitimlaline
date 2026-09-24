import { requireRole } from '@/lib/auth';
import {  markBookingArrivedByAccess } from '@/lib/services/booking.service';

export async function POST(request) {
  try {
    const user = requireRole(request, ['admin', 'staff']);

   const body = await request.json();

  

    const booking =
      await markBookingArrivedByAccess(
        body.booking_reference,
        body.access_code
      );


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