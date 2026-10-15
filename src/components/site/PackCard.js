import { Card } from '@/components/ui/Card.js';
import { Button } from '@/components/ui/Button.js';
import { CardImageCycler } from '@/components/site/CardImageCycler.js';
import { formatMoney } from '@/lib/format.js';

const PACK_IMAGES = {
  'the-adventurer': [
    '/images/quad/timlaline-quad-adventure-desert-dunes1.webp',
    '/images/quad/timlaline-atv-desert-adventure-morocco.webp',
    '/images/quad/timlaline-quad-ride-sunset-desert.webp',
    '/images/quad/timlaline-quad-riding-golden-dunes.webp',
    '/images/sandboard/timlaline-sandboarding-desert-dunes1.webp',
    '/images/sandboard/timlaline-sandboard-ride-golden-dunes.webp',
    '/images/sandboard/timlaline-sandboarding-adventure-morocco.webp',
    '/images/caves/timlaline-cave-exploration-desert.webp',
    '/images/caves/timlaline-canyon-nature-tour-morocco1.webp',
  ],
  'the-sunset': [
    '/images/camel tour/timlaline-camel-caravan-desert-timlaline.webp',
    '/images/camel tour/timlaline-camel-ride-desert-morocco1.webp',
    '/images/camel tour/timlaline-camel-ride-sunset-timlaline.webp',
    '/images/camel tour/timlaline-camel-tour-golden-dunes.webp',
    '/images/sandboard/timlaline-sandboarding-desert-dunes1.webp',
    '/images/sandboard/timlaline-sandboard-ride-golden-dunes.webp',
    '/images/sunset/timlaline-sunset-experience-desert1.webp',
    '/images/sunset/timlaline-desert-sunset-atlantic-coast.webp',
  ],
  'the-complete-experience': [
    '/images/quad/timlaline-quad-adventure-desert-dunes1.webp',
    '/images/quad/timlaline-atv-desert-adventure-morocco.webp',
    '/images/camel tour/timlaline-camel-caravan-desert-timlaline.webp',
    '/images/camel tour/timlaline-camel-ride-sunset-timlaline.webp',
    '/images/caves/timlaline-cave-exploration-desert.webp',
    '/images/caves/timlaline-canyon-to-beach-nature-tour.webp',
    '/images/sunset/timlaline-sunset-experience-desert1.webp',
    '/images/sunset/timlaline-moroccan-tea-sunset-timlaline.webp',
  ],
};

export function PackCard({
  pack,
  t,
  locale,
  currency = 'MAD',
  /*
   * The card sits under a section <h2> on the home page (h3 is right) and
   * directly under the page <h1> on the listing pages (h2 is right).
   */
  titleAs: TitleTag = 'h3',
}) {
  const allImages = [
    pack.hero,
    ...(PACK_IMAGES[pack.slug] ?? []),
  ].filter(Boolean);

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-ink/10 bg-surface shadow-[0_14px_40px_-12px_rgba(42,33,26,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:border-terra/35 hover:shadow-[0_26px_60px_-15px_rgba(184,95,50,0.20)]">
      <CardImageCycler images={allImages} alt={pack.title}>
        <span className="absolute left-3.5 top-3.5 z-10 rounded-full border border-cream/15 bg-ink/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-cream backdrop-blur-md">
          {t('nav.packs')}
        </span>
        {pack.duration ? (
          <span className="absolute bottom-3 left-3.5 z-10 inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1 text-xs font-bold text-ink shadow-sm backdrop-blur-md">
            <span aria-hidden>⏱</span>
            {pack.duration}
          </span>
        ) : null}
      </CardImageCycler>

      <div className="flex flex-1 flex-col gap-3.5 p-6">
        <TitleTag className="text-2xl font-bold tracking-tight text-ink transition-colors group-hover:text-terra">
          {pack.title}
        </TitleTag>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted">
          {pack.description}
        </p>

        <ul className="mt-1 flex flex-col gap-2 text-sm">
          {(pack.includes ?? []).map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terra/12 text-xs font-bold text-terra"
              >
                ✓
              </span>
              <span className="font-medium text-ink/85">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-ink/10 pt-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              {t('common.from')}
            </span>
            <p className="text-xl font-extrabold tracking-tight text-ink">
              {formatMoney(pack.price_from, locale, currency)}{' '}
              <span className="text-xs font-normal text-muted">
                {t('common.perPerson')}
              </span>
            </p>
          </div>

          <Button
            href={`/booking?type=pack&slug=${pack.slug}`}
            variant="secondary"
            size="sm"
            className="shrink-0 whitespace-nowrap rounded-full !border-terra !bg-terra !px-5 !py-2.5 text-xs font-bold uppercase tracking-[0.1em] !text-white shadow-sm hover:!bg-terra-deep"
          >
            {t('packs.choose')}
            <span
              aria-hidden
              className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
