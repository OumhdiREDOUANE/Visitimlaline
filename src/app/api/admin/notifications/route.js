import { requireRole } from '@/lib/auth';
import { getAdminNotifications } from '@/lib/services/notification.service';

export async function GET(request) {
  try {
    const user = requireRole(request, ['admin']);

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
    const status = error.status || 500;

    return Response.json(
      {
        success: false,
        error:
          status === 500
            ? 'Failed to fetch notifications'
            : error.message,
      },
      {
        status,
      }
    );
  }
}