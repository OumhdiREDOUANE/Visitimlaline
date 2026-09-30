import { getI18n } from '@/lib/i18n/server.js';
import { getActivities } from '@/lib/services/activity.service.js';
import { getPacks } from '@/lib/services/pack.service.js';
import { TicketLookup } from '@/components/site/TicketLookup.js';
import { Button } from '@/components/ui/Button.js';

export default async function TicketPage() {
  const { t } = await getI18n();

  const products = Object.fromEntries(
    [...getActivities(), ...getPacks()].map((item) => [
      item.slug,
      item.title,
    ])
  );

  return (
    <div className="page-shell flex flex-col gap-8 py-16 sm:py-20">
      <header className="flex flex-col gap-3">
        <p className="eyebrow">{t('ticket.eyebrow')}</p>
        <h1 className="max-w-2xl text-5xl sm:text-6xl">
          {t('ticket.title')}
        </h1>
        <p className="max-w-xl text-muted">
          {t('ticket.lead')}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_1fr]">
        <TicketLookup products={products} />

        <aside className="rounded-[28px] border border-sand/40 bg-ink/5 p-6 shadow-[0_20px_60px_rgba(42,33,26,0.05)]">
          <p className="text-sm font-bold">
            {t('ticket.newBooking')}
          </p>
          <p className="mt-2 text-sm text-muted">
            {t('booking.paymentNote')}
          </p>
          <div className="mt-4">
            <Button href="/booking" size="sm">
              {t('nav.book')}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
