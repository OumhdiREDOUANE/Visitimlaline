import Link from 'next/link';

export function Footer({ t }) {
  return (
    <footer className="no-print bg-ink py-16 text-cream">
      <div className="page-shell grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-semibold uppercase tracking-[0.2em]">
            Visitimlaline
          </p>
          <p className="mt-2 text-sm text-cream/70">
            {t('footer.tagline')}
          </p>
          <p className="mt-4 text-sm leading-6 text-cream/80">
            {t('footer.location')}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sand">{t('footer.quickLinks')}</p>
          <nav className="mt-4 flex flex-col gap-3 text-sm text-cream/80">
            <Link href="/experiences" className="hover:text-cream">{t('nav.experiences')}</Link>
            <Link href="/packs" className="hover:text-cream">{t('nav.packs')}</Link>
            <Link href="/booking" className="hover:text-cream">{t('nav.book')}</Link>
            <Link href="/ticket" className="hover:text-cream">{t('ticket.eyebrow')}</Link>
          </nav>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sand">{t('footer.contact')}</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-cream/80">
            <a href="https://maps.google.com/?q=Timlaline+Dunes+Morocco" target="_blank" rel="noreferrer" className="hover:text-cream">{t('footer.maps')}</a>
            <a href="https://wa.me/21272912433 " target="_blank" rel="noreferrer" className="hover:text-cream">WhatsApp</a>
            <a href="https://instagram.com/visitimlaline" target="_blank" rel="noreferrer" className="hover:text-cream">Instagram</a>
          </div>
        </div>
        <p className="text-xs uppercase tracking-[0.16em] text-cream/70 md:col-span-3">
          © {new Date().getFullYear()} — {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
