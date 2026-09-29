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
    <header className="no-print sticky top-0 z-30 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <div className="page-shell flex flex-wrap items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="font-display text-xl tracking-tight"
        >
          Visitimlaline
        </Link>

        <nav className="flex flex-wrap items-center gap-5 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-semibold hover:text-terra"
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
              className="font-semibold hover:text-terra"
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
              className="font-semibold hover:text-terra"
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
