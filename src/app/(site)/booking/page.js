import { getI18n } from '@/lib/i18n/server.js';
import { getActivities } from '@/lib/services/activity.service.js';
import { getPacks } from '@/lib/services/pack.service.js';
import { BookingWizard } from '@/components/booking/BookingWizard.js';

export default async function BookingPage({
  searchParams,
}) {
  const { t } = await getI18n();
  const params = await searchParams;
  const type =
    (params?.type ?? '').toString() === 'pack'
      ? 'pack'
      : 'activity';
  const slug = (params?.slug ?? '').toString();

  return (
    <div className="page-shell flex flex-col gap-8 py-16 sm:py-20">
      <header className="flex flex-col gap-3">
        <p className="eyebrow">{t('booking.eyebrow')}</p>
        <h1 className="max-w-2xl text-5xl sm:text-6xl">
          {t('booking.title')}
        </h1>
      </header>

      <BookingWizard
        activities={getActivities()}
        packs={getPacks()}
        initialType={type}
        initialSlug={slug}
      />
    </div>
  );
}
