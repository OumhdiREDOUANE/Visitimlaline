import Link from 'next/link';

import { getI18n } from '@/lib/i18n/server.js';
import { requireAdmin } from '@/lib/auth/guards.js';
import {
  getAdminNotifications,
  getAdminReadNotifications,
  getAdminUnreadNotifications,
} from '@/lib/services/notification.service.js';
import { formatDateTime } from '@/lib/format.js';
import { Card } from '@/components/ui/Card.js';
import { Badge } from '@/components/ui/Badge.js';
import { EmptyState } from '@/components/ui/EmptyState.js';
import { NotificationToggle } from '@/components/admin/NotificationToggle.js';

const FILTERS = {
  all: getAdminNotifications,
  read: getAdminReadNotifications,
  unread: getAdminUnreadNotifications,
};

export default async function NotificationsPage({
  searchParams,
}) {
  const { t, locale } = await getI18n();
  await requireAdmin('/admin/notifications');

  const params = await searchParams;
  const filter = FILTERS[(params?.filter ?? '').toString()]
    ? (params?.filter ?? '').toString()
    : 'all';

  // better-sqlite3 returns null-prototype rows, which cannot cross the
  // server/client boundary.
  const notifications = FILTERS[filter]().map(
    (notification) => ({ ...notification })
  );

  return (
    <div className="page-shell flex flex-col gap-8 py-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl">
          {t('notifications.title')}
        </h1>
        <p className="max-w-xl text-muted">
          {t('notifications.lead')}
        </p>
      </header>

      <nav className="flex flex-wrap gap-2">
        {['all', 'unread', 'read'].map((value) => (
          <Link
            key={value}
            href={`/admin/notifications?filter=${value}`}
            className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
              filter === value
                ? 'border-terra bg-terra text-white'
                : 'border-ink/15 hover:border-ink/40'
            }`}
          >
            {t(`notifications.${value}`)}
          </Link>
        ))}
      </nav>

      {notifications.length > 0 ? (
        <div className="flex flex-col gap-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className="flex flex-col gap-3 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      tone={
                        notification.read_at
                          ? 'neutral'
                          : 'positive'
                      }
                    >
                      {notification.read_at
                        ? t('notifications.read')
                        : t('notifications.unread')}
                    </Badge>

                    <span className="text-xs text-muted">
                      {t('notifications.createdAt', {
                        time: formatDateTime(
                          notification.created_at,
                          locale
                        ),
                      })}
                    </span>
                  </div>

                  <Link
                    href={`/admin/bookings?selected=${notification.booking_id}`}
                    className="mt-2 block"
                  >
                    <pre className="whitespace-pre-wrap font-sans text-sm text-ink underline underline-offset-4">
                      {notification.message}
                    </pre>
                  </Link>
                </div>

                <NotificationToggle
                  notification={notification}
                />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title={t('notifications.empty')} />
      )}
    </div>
  );
}
