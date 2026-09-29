'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { apiFetch } from '@/lib/api-client.js';
import { logClientError } from '@/lib/observability/client.js';
import { useI18n } from '@/components/providers/LocaleProvider.js';
import { Button } from '@/components/ui/Button.js';

export function NotificationToggle({ notification }) {
  const { t } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const read = notification.read_at !== null;

  const toggle = async () => {
    setLoading(true);

    const result = await apiFetch(
      `/api/admin/notifications/${notification.id}/${
        read ? 'unread' : 'read'
      }`,
      { method: 'PATCH', body: {} }
    );

    setLoading(false);

    if (!result.ok) {
      logClientError('admin.notification_toggle_failed', {
        notificationId: notification.id,
        status: result.status,
      });

      return;
    }

    router.refresh();
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={toggle}
      disabled={loading}
    >
      {read
        ? t('notifications.markUnread')
        : t('notifications.markRead')}
    </Button>
  );
}
