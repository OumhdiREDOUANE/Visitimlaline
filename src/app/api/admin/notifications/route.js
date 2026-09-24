import { requireRole } from '@/lib/auth';

import {
  getAdminNotifications,
  getAdminUnreadNotifications,
  getAdminReadNotifications,
} from '@/lib/services/notification.service';

export async function GET(request) {
  try {
    requireRole(request, ['admin']);

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';

    let notifications;

    switch (filter) {
      case 'all':
        notifications = getAdminNotifications();
        break;

      case 'unread':
        notifications = getAdminUnreadNotifications();
        break;

      case 'read':
        notifications = getAdminReadNotifications();
        break;

      default:
        return Response.json(
          {
            success: false,
            error: 'Invalid filter. Use: all, unread, or read',
          },
          { status: 400 }
        );
    }

    return Response.json(
      {
        success: true,
        filter,
        data: notifications,
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
            ? 'Failed to fetch notifications'
            : error.message,
      },
      { status }
    );
  }
}