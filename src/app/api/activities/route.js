import { getActivities } from '@/lib/services/activity.service';

export async function GET() {
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