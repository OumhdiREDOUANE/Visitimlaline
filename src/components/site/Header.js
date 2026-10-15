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
<<<<<<< HEAD
      <div className="page-shell flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-3 sm:py-4">
        <Link
          href="/"
          className="flex shrink-0 items-center"
=======
      <div className="page-shell flex flex-wrap items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="flex items-center"
>>>>>>> 59b0c7035139a35202498435e99dd26c89619577
        >
          <Image
            src="/visitimlaline logo.png"
            alt="Visitimlaline"
            width={220}
            height={64}
            priority
            className="h-10 w-auto object-contain mix-blend-multiply"
          />
        </Link>

        <nav className="flex w-full flex-wrap items-center justify-end gap-x-4 gap-y-3 text-xs uppercase tracking-[0.14em] sm:w-auto sm:flex-nowrap sm:gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
<<<<<<< HEAD
              className="relative whitespace-nowrap font-semibold text-ink/80 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-terra after:transition-all hover:text-terra hover:after:w-full"
=======
              className="font-semibold text-ink/80 transition-colors hover:text-terra"
>>>>>>> 59b0c7035139a35202498435e99dd26c89619577
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
<<<<<<< HEAD
              className="relative whitespace-nowrap font-semibold text-ink/80 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-terra after:transition-all hover:text-terra hover:after:w-full"
=======
              className="font-semibold text-ink/80 transition-colors hover:text-terra"
>>>>>>> 59b0c7035139a35202498435e99dd26c89619577
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
<<<<<<< HEAD
              className="relative whitespace-nowrap font-semibold text-ink/80 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-terra after:transition-all hover:text-terra hover:after:w-full"
=======
              className="font-semibold text-ink/80 transition-colors hover:text-terra"
>>>>>>> 59b0c7035139a35202498435e99dd26c89619577
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
