import Image from 'next/image';

import { Card } from '@/components/ui/Card.js';
import { Button } from '@/components/ui/Button.js';

import {
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
  className="flex h-full flex-col overflow-hidden"
>
      <div className="experience-image-frame relative aspect-[16/10] w-full overflow-hidden rounded-[22px]">
        <Image
          src={activity.hero}
          alt={activity.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="experience-card-image object-cover"
        />

      </div>

      {/* Duration sits below the image so it never covers the photography. */}
      {duration ? (
        <span className="mt-3 ml-12 inline-flex self-start rounded-full bg-[#A75D3B] px-3 py-2 text-xs font-bold text-cream">
          {duration}
        </span>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <TitleTag className="inline-block rounded-xl bg-cream px-3 py-2 text-xl">
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
          <p className="inline-block rounded-xl bg-cream px-3 py-2 text-sm text-muted">
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
            className="!border-[#A75D3B] !bg-[#A75D3B] !text-cream hover:!border-[#3D2314] hover:!bg-[#3D2314]"
          >
            {t('common.viewDetails')}
          </Button>
        </div>
      </div>
    </Card>
  </>
  );
}
