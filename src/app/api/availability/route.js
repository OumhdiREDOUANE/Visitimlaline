import { getAvailability } from '@/lib/services/availability.service';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const activity = searchParams.get('activity');
    const date = searchParams.get('date');

    if (!activity) {
      return Response.json(
        {
          success: false,
          error: 'Activity is required',
        },
        { status: 400 }
      );
    }

    if (!date) {
      return Response.json(
        {
          success: false,
          error: 'Date is required',
        },
        { status: 400 }
      );
    }

    const slots = getAvailability(activity, date);

    return Response.json(
      {
        success: true,
        data: {
          activity,
          date,
          slots,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    

    return Response.json(
      {
        success: false,
        error: 'Failed to check availability',
      },
      { status: 500 }
    );
  }
}