'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentUser, logoutUser } from '@/lib/frontend/api';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/packs', label: 'Packs' },
  { href: '/login', label: 'Login' },
  { href: '/admin', label: 'Admin' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null));
  }, []);

  async function handleLogout() {
    try {
      await logoutUser();
      setUser(null);
      window.location.href = '/';
    } catch {
      setUser(null);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#17130F]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#F5EFE5]">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D9B98C]/50 bg-[#D9B98C]/10 text-base text-[#D9B98C]">V</span>
          Visitimlaline
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${isActive ? 'text-[#D9B98C]' : 'text-[#F5EFE5]/80 hover:text-[#F5EFE5]'}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-[#F5EFE5]/80">{user.name}</span>
              <button onClick={handleLogout} className="rounded-full border border-[#D9B98C]/40 bg-transparent px-4 py-2 text-sm font-semibold text-[#F5EFE5] transition hover:border-[#D9B98C] hover:text-[#D9B98C]">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="rounded-full bg-[#B85F32] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#9d4d26]">
              Staff Login
            </Link>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="rounded-full border border-[#D9B98C]/40 p-2 text-[#F5EFE5] md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
        >
          ☰
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/10 bg-[#17130F] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-3 py-2 text-sm font-medium ${pathname === item.href ? 'bg-[#D9B98C]/10 text-[#D9B98C]' : 'text-[#F5EFE5]/80 hover:bg-white/5'}`}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <button onClick={handleLogout} className="rounded-xl bg-[#B85F32] px-3 py-2 text-sm font-semibold text-white">
                Logout
              </button>
            ) : (
              <Link href="/login" className="rounded-xl bg-[#B85F32] px-3 py-2 text-center text-sm font-semibold text-white">Staff Login</Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
