import Image from 'next/image';

import { Card } from '@/components/ui/Card.js';
import { Button } from '@/components/ui/Button.js';
import { formatMoney } from '@/lib/format.js';

export function PackCard({
  pack,
  t,
  locale,
  /*
   * The card sits under a section <h2> on the home page (h3 is right) and
   * directly under the page <h1> on the listing page (h2 is right).
   */
  titleAs: TitleTag = 'h3',
}) {
  return (
    <Card
      className="flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={pack.hero}
          alt={pack.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <TitleTag className="text-xl">
          {pack.title}
        </TitleTag>

        <p className="text-xs uppercase tracking-[0.14em] text-muted">
          {pack.duration}
        </p>

        <p className="text-sm text-muted">
          {pack.description}
        </p>

        <ul className="flex flex-col gap-1.5 text-sm">
          {(pack.includes ?? []).map((item) => (
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

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <p className="text-sm text-muted">
            {t('common.from')}{' '}
            <span className="text-base font-bold text-ink">
              {formatMoney(pack.price_from, locale)}
            </span>{' '}
            {t('common.perPerson')}
          </p>

          <Button
            href={`/booking?type=pack&slug=${pack.slug}`}
            size="sm"
          >
            {t('packs.choose')}
          </Button>
        </div>
      </div>
    </Card>
  );
}
