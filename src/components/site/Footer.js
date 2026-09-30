export function Footer({ t }) {
  return (
    <footer className="no-print bg-ink py-16 text-cream">
      <div className="page-shell flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-2xl font-semibold uppercase tracking-[0.2em]">
            Visitimlaline
          </p>
          <p className="mt-2 text-sm text-cream/70">
            {t('footer.tagline')}
          </p>
        </div>

        {/* cream/50 lands on 4.47:1 against the ink background, just under
            the 4.5:1 floor for body text — cream/60 clears it at ~6:1. */}
        <p className="text-xs uppercase tracking-[0.16em] text-cream/60">
          © {new Date().getFullYear()} — {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
