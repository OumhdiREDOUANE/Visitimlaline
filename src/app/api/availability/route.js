import {
  getActivityAvailability,
  getPackAvailability,
} from '@/lib/services/availability.service';
import { logRequest } from '@/lib/observability/route';

async function handleGET(request) {
  try {
    const { searchParams } = new URL(
      request.url
    );

    const activity = (
      searchParams.get('activity') || ''
    ).trim();

    const pack = (
      searchParams.get('pack') || ''
    ).trim();

    const date = (
      searchParams.get('date') || ''
    ).trim();

    if (!activity && !pack) {
      return Response.json(
        {
          success: false,
          error: 'Activity or pack is required',
        },
        { status: 400 }
      );
    }

    if (activity && pack) {
      return Response.json(
        {
          success: false,
          error:
            'Send either an activity or a pack, not both',
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

    const slots = activity
      ? getActivityAvailability(
          activity,
          date
        )
      : getPackAvailability(pack, date);

    return Response.json(
      {
        success: true,
        data: {
          activity: activity || null,
          pack: pack || null,
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

export const GET = logRequest(handleGET, 'GET /api/availability');
