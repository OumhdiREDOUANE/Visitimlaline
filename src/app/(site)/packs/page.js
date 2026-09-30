import { getI18n } from '@/lib/i18n/server.js';
import { getPacks } from '@/lib/services/pack.service.js';
import { PackCard } from '@/components/site/PackCard.js';
import { EmptyState } from '@/components/ui/EmptyState.js';

export default async function PacksPage() {
  const { t, locale } = await getI18n();
  const packs = getPacks();

  return (
    <div className="page-shell flex flex-col gap-10 py-16 sm:py-20">
      <header className="flex flex-col gap-4">
        <p className="eyebrow">{t('packs.eyebrow')}</p>
        <h1 className="max-w-2xl text-5xl sm:text-6xl">
          {t('packs.title')}
        </h1>
        <p className="max-w-2xl text-muted">
          {t('packs.lead')}
        </p>
      </header>

      {packs.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
            <PackCard
              key={pack.slug}
              pack={pack}
              t={t}
              locale={locale}
              titleAs="h2"
            />
          ))}
        </div>
      ) : (
        <EmptyState title={t('experiences.empty')} />
      )}
    </div>
  );
}
