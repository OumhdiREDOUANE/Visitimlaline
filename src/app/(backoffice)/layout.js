import Link from 'next/link';

import { getI18n } from '@/lib/i18n/server.js';
import { requireUser } from '@/lib/auth/guards.js';
import { SignOutButton } from '@/components/backoffice/SignOutButton.js';
import { LocaleSwitcher } from '@/components/site/LocaleSwitcher.js';

const adminLinks = [
  { href: '/admin/bookings', key: 'nav.bookings' },
  {
    href: '/admin/notifications',
    key: 'nav.notifications',
  },
  { href: '/staff/check-in', key: 'nav.checkIn' },
];

const staffLinks = [
  { href: '/staff/check-in', key: 'nav.checkIn' },
];

export default async function BackofficeLayout({
  children,
}) {
  const { t } = await getI18n();
  const user = await requireUser('/admin/bookings');
  const links =
    user.role === 'admin' ? adminLinks : staffLinks;

  return (
    <div className="flex min-h-full flex-col bg-cream">
      <header className="no-print border-b border-cream/15 bg-ink text-cream shadow-[0_12px_40px_rgb(42_33_26_/_12%)]">
        <div className="page-shell flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-display text-lg font-semibold uppercase tracking-[0.22em]"
            >
              Visitimlaline
            </Link>

            <nav className="flex flex-wrap items-center gap-4 text-sm">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-cream/80 transition-colors hover:text-sand"
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <p className="hidden text-xs uppercase tracking-[0.14em] text-cream/60 sm:block">
              {t('backoffice.welcome', {
                name: user.name,
              })}
            </p>

            <LocaleSwitcher />

            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
