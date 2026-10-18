
import { getI18n } from '@/lib/i18n/server.js';
import { requireAdmin } from '@/lib/auth/guards.js';
import { getActivities } from '@/lib/services/activity.service.js';
import { getPacks } from '@/lib/services/pack.service.js';
import { Card } from '@/components/ui/Card.js';
import { InlinePriceEditor } from '@/components/admin/InlinePriceEditor.js';

export const dynamic = 'force-dynamic';

export default async function AdminPricesPage() {
  const { t, locale } = await getI18n();

  await requireAdmin('/admin/prices');

  const activities = getActivities(locale);
  const packs = getPacks(locale);

  const labels = {
    currency: t('adminPrices.currency'),
    save: t('adminPrices.save'),
    cancel: t('adminPrices.cancel'),
    saving: t('adminPrices.saving'),
    saved: t('adminPrices.saved'),
    invalidPrice: t('adminPrices.invalidPrice'),
    saveError: t('adminPrices.saveError'),
  };

  return (
    <main className="page-shell flex flex-col gap-8 py-10">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted">
          {t('adminPrices.administration')}
        </p>

        <h1 className="text-4xl">
          {t('adminPrices.title')}
        </h1>

        <p className="max-w-xl text-muted">
          {t('adminPrices.lead')}
        </p>

        <p className="text-sm text-muted">
          {t('adminPrices.instructions')}
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl">
            {t('adminPrices.activities')}
          </h2>
          <span className="text-sm text-muted">
            {activities.length}
          </span>
        </div>

        {activities.length ? (
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[38rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-[0.1em] text-muted">
                  <th className="px-4 py-3">
                    {t('adminPrices.activity')}
                  </th>
                  <th className="px-4 py-3">
                    {t('adminPrices.category')}
                  </th>
                  <th className="px-4 py-3">
                    {t('adminPrices.basePrice')}
                  </th>
                </tr>
              </thead>

              <tbody>
                {activities.map((activity) => (
                  <tr
                    key={activity.id}
                    className="border-b border-ink/5 last:border-0"
                  >
                    <td className="px-4 py-4 font-semibold">
                      {activity.title}
                    </td>

                    <td className="px-4 py-4 text-muted">
                      {activity.category || '—'}
                    </td>

                    <td className="px-4 py-3">
                      <InlinePriceEditor
                        id={activity.id}
                        type="activity"
                        title={activity.title}
                        initialPrice={activity.price_from}
                        locale={locale}
                        labels={labels}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : (
          <Card className="p-6 text-muted">
            {t('adminPrices.noActivities')}
          </Card>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl">
            {t('adminPrices.packs')}
          </h2>
          <span className="text-sm text-muted">
            {packs.length}
          </span>
        </div>

        {packs.length ? (
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[38rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-[0.1em] text-muted">
                  <th className="px-4 py-3">
                    {t('adminPrices.packs')}
                  </th>
                  <th className="px-4 py-3">
                    {t('adminPrices.duration')}
                  </th>
                  <th className="px-4 py-3">
                    {t('adminPrices.basePrice')}
                  </th>
                </tr>
              </thead>

              <tbody>
                {packs.map((pack) => (
                  <tr
                    key={pack.id}
                    className="border-b border-ink/5 last:border-0"
                  >
                    <td className="px-4 py-4 font-semibold">
                      {pack.title}
                    </td>

                    <td className="px-4 py-4 text-muted">
                      {pack.duration || '—'}
                    </td>

                    <td className="px-4 py-3">
                      <InlinePriceEditor
                        id={pack.id}
                        type="pack"
                        title={pack.title}
                        initialPrice={pack.price_from}
                        locale={locale}
                        labels={labels}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : (
          <Card className="p-6 text-muted">
            {t('adminPrices.noPacks')}
          </Card>
        )}
      </section>
    </main>
  );
}
