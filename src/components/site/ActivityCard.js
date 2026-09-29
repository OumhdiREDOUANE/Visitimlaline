import Image from 'next/image';

import { Card } from '@/components/ui/Card.js';
import { Badge } from '@/components/ui/Badge.js';
import { Button } from '@/components/ui/Button.js';

import {
  categoryKey,
  formatDurationRange,
  formatMoney,
} from '@/lib/format.js';

export function ActivityCard({
  activity,
  t,
  locale,
  /*
   * The card sits under a section <h2> on the home page (h3 is right) and
   * directly under the page <h1> on the listing pages (h2 is right).
   */
  titleAs: TitleTag = 'h3',
}) {
  const duration = formatDurationRange(
    activity.duration_min,
    activity.duration_max,
    t
  );

  return (
    <>
<Card
  wave="frame"
  className="flex h-full flex-col overflow-hidden"
>
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={activity.hero}
          alt={activity.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />

        {/* Duration rides on the photo: it is the question people ask
            before they click, and the detail page repeats it. */}
        {duration ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-bold text-cream">
            {duration}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <Badge tone="accent">
          {t(
            `category.${categoryKey(activity.category)}`,
            null,
            activity.category
          )}
        </Badge>

        <TitleTag className="text-xl">
          {activity.title}
        </TitleTag>

        <p className="text-sm text-muted">
          {activity.description}
        </p>

        <ul className="flex flex-col gap-1.5 text-sm">
          {(activity.inclusions ?? []).slice(0, 3).map((item) => (
            <li
              key={item}
              className="flex gap-2"
            >
              <span
                aria-hidden
                className="font-bold text-terra"
              >
                ✓
              </span>
              <span className="text-muted">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <p className="text-sm text-muted">
            {t('common.from')}{' '}
            <span className="text-base font-bold text-ink">
              {formatMoney(
                activity.price_from,
                locale
              )}
            </span>{' '}
            {t('common.perPerson')}
          </p>

          <Button
            href={`/experiences/${activity.slug}`}
            variant="secondary"
            size="sm"
          >
            {t('common.viewDetails')}
          </Button>
        </div>
      </div>
    </Card>
  </>
  );
}
