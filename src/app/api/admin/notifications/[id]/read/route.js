import { requireRole } from '@/lib/auth';

import {
  markAdminNotificationAsRead,
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
      markAdminNotificationAsRead(notificationId);

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
        message: 'Notification marked as read',
        data: {
          id: notificationId,
          read: true,
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
            ? 'Failed to mark notification as read'
            : error.message,
      },
      { status }
    );
  }
}