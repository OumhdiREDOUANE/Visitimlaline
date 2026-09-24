import { requireRole } from '@/lib/auth';

import {
  markAdminNotificationAsUnread,
} from '@/lib/services/notification.service';

export async function PATCH(request, { params }) {
  try {
    requireRole(request, ['admin']);

    const { id } = await params;

    if (!id || !/^\d+$/.test(id)) {
      return Response.json(
        {
          success: false,
          error: 'Invalid notification ID',
        },
        { status: 400 }
      );
    }

    const notificationId = Number(id);

    const changes =
      markAdminNotificationAsUnread(notificationId);

    if (changes === 0) {
      return Response.json(
        {
          success: false,
          error: 'Notification not found',
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Notification marked as unread',
        data: {
          id: notificationId,
          read: false,
        },
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
            ? 'Failed to mark notification as unread'
            : error.message,
      },
      { status }
    );
  }
}