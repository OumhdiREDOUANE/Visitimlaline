import { getI18n } from '@/lib/i18n/server.js';
import { getSessionUser } from '@/lib/auth/guards.js';
import { Header } from '@/components/site/Header.js';
import { Footer } from '@/components/site/Footer.js';
import { WaveEdge } from '@/components/ui/WaveEdge.js';

export default async function SiteLayout({
  children,
}) {
  const { t } = await getI18n();
  const user = await getSessionUser();

  return (
    <>
      <Header t={t} user={user} />
      <main className="flex-1">{children}</main>
      {/* Site-wide, so every page's footer closes on the wave instead of a
          straight rule. Placed outside <main> and <footer> on purpose: see
          WaveEdge.js on why the mask must not sit inside the footer's
          subtree. */}
      <WaveEdge above tone="ink" />
      <Footer t={t} />
    </>
  );
}
