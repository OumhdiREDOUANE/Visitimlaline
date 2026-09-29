import { logRequest } from '@/lib/observability/route';
import { getActivity } from '@/lib/services/activity.service';

async function handleGET(request, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return Response.json(
        {
          success: false,
          error: 'Activity slug is required',
        },
        {
          status: 400,
        }
      );
    }

    const activity = getActivity(slug);

    if (!activity) {
      return Response.json(
        {
          success: false,
          error: 'Activity not found',
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        data: activity,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    

    return Response.json(
      {
        success: false,
        error: 'Failed to fetch activity',
      },
      {
        status: 500,
      }
    );
  }
}

export const GET = logRequest(handleGET, 'GET /api/activities/{slug}');
