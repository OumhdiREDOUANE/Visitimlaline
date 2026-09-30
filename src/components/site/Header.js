import Link from 'next/link';

import { Button } from '@/components/ui/Button.js';
import { LocaleSwitcher } from './LocaleSwitcher.js';

const links = [
  { href: '/experiences', key: 'nav.experiences' },
  { href: '/packs', key: 'nav.packs' },
  { href: '/ticket', key: 'ticket.eyebrow' },
];

export function Header({ t, user }) {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-white/10 bg-ink/90 text-cream shadow-[0_12px_40px_rgb(42_33_26_/_12%)] backdrop-blur-md">
      <div className="page-shell flex flex-wrap items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="font-display text-lg font-semibold uppercase tracking-[0.28em] text-cream"
        >
          Visitimlaline
        </Link>

        <nav className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.14em] sm:gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-semibold text-cream/80 transition-colors hover:text-sand"
            >
              {t(link.key)}
            </Link>
          ))}

          <LocaleSwitcher />

          {user ? (
            <Link
              href={
                user.role === 'admin'
                  ? '/admin/bookings'
                  : '/staff/check-in'
              }
              className="font-semibold text-cream/80 transition-colors hover:text-sand"
            >
              {t(
                user.role === 'admin'
                  ? 'nav.bookings'
                  : 'nav.checkIn'
              )}
            </Link>
          ) : (
            <Link
              href="/login"
              className="font-semibold text-cream/80 transition-colors hover:text-sand"
            >
              {t('nav.login')}
            </Link>
          )}

          <Button
            href="/booking"
            size="sm"
          >
            {t('nav.book')}
          </Button>
        </nav>
      </div>
    </header>
  );
}
