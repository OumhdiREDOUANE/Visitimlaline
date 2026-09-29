import { logRequest } from '@/lib/observability/route';
import { getActivities } from '@/lib/services/activity.service';

async function handleGET() {
  try {
    const activities = getActivities();

    return Response.json(
      {
        success: true,
        data: activities,
      },
      {
        status: 200,
      }
    );
  } catch (error) {


    return Response.json(
      {
        success: false,
        error: 'Failed to fetch activities',
      },
      {
        status: 500,
      }
    );
  }
}

export const GET = logRequest(handleGET, 'GET /api/activities');
