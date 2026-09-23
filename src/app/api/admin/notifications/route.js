import { getAdminNotifications } from '@/lib/services/notification.service';

export async function GET() {
  try {
    const notifications = getAdminNotifications();

    return Response.json(
      {
        success: true,
        data: notifications,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
   

    return Response.json(
      {
        success: false,
        error: 'Failed to fetch notifications',
      },
      {
        status: 500,
      }
    );
  }
}