import { Card } from '@/components/ui/Card.js';
import { Button } from '@/components/ui/Button.js';
import { CardImageCycler } from '@/components/site/CardImageCycler.js';

import {
  formatDurationRange,
  formatMoney,
} from '@/lib/format.js';

export function ActivityCard({
  activity,
  t,
  locale,
  currency = 'MAD',
  titleAs: TitleTag = 'h3',
}) {
  const duration = formatDurationRange(
    activity.duration_min,
    activity.duration_max,
    t
  );
  const category = activity.category
    ? t(`category.${activity.category}`)
    : null;
  const allImages = [
    ...new Set([
      activity.hero,
      ...(activity.gallery ?? []),
    ].filter(Boolean)),
  ];

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-ink/10 bg-surface shadow-[0_14px_40px_-12px_rgba(42,33,26,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:border-terra/35 hover:shadow-[0_26px_60px_-15px_rgba(184,95,50,0.20)]">
      <CardImageCycler images={allImages} alt={activity.title}>
        {category ? (
          <span className="absolute left-3.5 top-3.5 z-10 rounded-full border border-cream/15 bg-ink/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-cream backdrop-blur-md">
            {category}
          </span>
        ) : null}
        {duration ? (
          <span className="absolute bottom-3 left-3.5 z-10 inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1 text-xs font-bold text-ink shadow-sm backdrop-blur-md">
            <span aria-hidden>⏱</span>
            {duration}
          </span>
        ) : null}
      </CardImageCycler>

      <div className="flex flex-1 flex-col gap-3.5 p-6">
        <TitleTag className="text-2xl font-bold tracking-tight text-ink transition-colors group-hover:text-terra">
          {activity.title}
        </TitleTag>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted">
          {activity.description}
        </p>

        <ul className="mt-1 flex flex-col gap-2 text-sm">
          {(activity.inclusions ?? []).slice(0, 3).map((item) => (
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
              {formatMoney(activity.price_from, locale, currency)}{' '}
              <span className="text-xs font-normal text-muted">
                {t('common.perPerson')}
              </span>
            </p>
          </div>

          <Button
            href={`/experiences/${activity.slug}`}
            variant="secondary"
            size="sm"
            className="shrink-0 whitespace-nowrap rounded-full !border-terra !bg-terra !px-5 !py-2.5 text-xs font-bold uppercase tracking-[0.1em] !text-white shadow-sm hover:!bg-terra-deep"
          >
            {t('common.viewDetails')}
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
