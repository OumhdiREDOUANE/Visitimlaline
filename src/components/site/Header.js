import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/Button.js';
import { LocaleSwitcher } from './LocaleSwitcher.js';

const links = [
  { href: '/experiences', key: 'nav.experiences' },
  { href: '/packs', key: 'nav.packs' },
  { href: '/ticket', key: 'ticket.eyebrow' },
];

export function Header({ t, user }) {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-ink/10 bg-[#FAF0DB] text-ink shadow-[0_12px_40px_rgb(42_33_26_/_12%)] backdrop-blur-md">
      <div className="page-shell flex flex-wrap items-center justify-between gap-2 py-2.5 sm:gap-5 sm:py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/visitimlaline logo.png"
            alt="Visitimlaline"
            width={220}
            height={64}
            priority
            className="h-10 w-auto object-contain mix-blend-multiply"
          />
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] sm:gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative font-semibold text-ink/80 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-terra after:transition-all hover:text-terra hover:after:w-full"
            >
              {t(link.key)}
            </Link>
          ))}

          <LocaleSwitcher tone="light" />

          {user ? (
            <Link
              href={
                user.role === 'admin'
                  ? '/admin/bookings'
                  : '/staff/check-in'
              }
              className="relative font-semibold text-ink/80 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-terra after:transition-all hover:text-terra hover:after:w-full"
            >
              {t(user.role === 'admin' ? 'nav.bookings' : 'nav.checkIn')}
            </Link>
          ) : (
            <Link
              href="/login"
              className="relative font-semibold text-ink/80 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-terra after:transition-all hover:text-terra hover:after:w-full"
            >
              {t('nav.login')}
            </Link>
          )}

          <Button href="/booking" size="sm">
            {t('nav.book')}
          </Button>
        </nav>
      </div>
    </header>
  );
}
