import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getI18n } from '@/lib/i18n/server.js';
import { getActivities } from '@/lib/services/activity.service.js';
import { ActivityCard } from '@/components/site/ActivityCard.js';
import { Card } from '@/components/ui/Card.js';
import { Badge } from '@/components/ui/Badge.js';
import { Button } from '@/components/ui/Button.js';
import { categoryKey, formatDurationRange, formatMoney } from '@/lib/format.js';

export async function generateMetadata({
  params,
}) {
  const { slug } = await params;
  const activity = getActivities().find(
    (item) => item.slug === slug
  );

  return {
    title: activity
      ? `${activity.title} — Visitimlaline`
      : undefined,
  };
}

export default async function ActivityPage({
  params,
}) {
  const { t, locale } = await getI18n();
  const { slug } = await params;
  const activities = getActivities();
  const activity = activities.find(
    (item) => item.slug === slug
  );

  if (!activity) {
    notFound();
  }

  const related = activities
    .filter((item) => item.slug !== activity.slug)
    .sort((a, b) => {
      const sameA = a.category === activity.category ? 0 : 1;
      const sameB = b.category === activity.category ? 0 : 1;

      return sameA - sameB;
    })
    .slice(0, 3);

  const duration = formatDurationRange(
    activity.duration_min,
    activity.duration_max,
    t
  );

  return (
    <>
      <section className="page-shell grid gap-10 py-12 lg:grid-cols-[1.15fr_1fr] lg:items-start">
        <div className="flex flex-col gap-5">
          <Link
            href="/experiences"
            className="text-xs font-bold uppercase tracking-[0.14em] text-muted hover:text-terra"
          >
            ← {t('activity.backToExperiences')}
          </Link>

          <Badge tone="accent" className="w-fit">
            {t(
              `category.${categoryKey(activity.category)}`,
              null,
              activity.category
            )}
          </Badge>

          <h1 className="text-5xl">{activity.title}</h1>

          <p className="text-lg text-muted">
            {activity.description}
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <p className="text-sm text-muted">
              {t('common.from')}{' '}
              <span className="text-2xl font-bold text-ink">
                {formatMoney(
                  activity.price_from,
                  locale
                )}
              </span>{' '}
              {t('common.perPerson')}
            </p>

            <p className="text-sm text-muted">
              {t('activity.itinerary')} · {duration}
            </p>
          </div>

          <div>
            <Button
              href={`/booking?type=activity&slug=${activity.slug}`}
              size="lg"
            >
              {t('activity.checkAvailability')}
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <Image
            src={activity.hero}
            alt={activity.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="page-shell grid gap-6 pb-12 sm:grid-cols-2 lg:grid-cols-3">
        <ContentList
          title={t('activity.included')}
          items={activity.inclusions}
        />

        <ContentList
          title={t('activity.goodToKnow')}
          items={activity.good_to_know}
        />

        <Card
          className="p-5 sm:col-span-2 lg:col-span-1"
        >
          <h2 className="text-lg">
            {t('activity.itinerary')}
          </h2>

          <ol className="mt-4 flex flex-col gap-4">
            {(activity.itinerary ?? []).map(
              ([label, text]) => (
                <li
                  key={label}
                  className="border-l-2 border-terra pl-4"
                >
                  <p className="text-sm font-bold">
                    {label}
                  </p>
                  <p className="text-sm text-muted">
                    {text}
                  </p>
                </li>
              )
            )}
          </ol>
        </Card>
      </section>

      {(activity.gallery ?? []).length > 0 ? (
        <section className="page-shell flex flex-col gap-4 pb-12">
          <h2 className="text-2xl">
            {t('activity.gallery')}
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            {activity.gallery.map((source) => (
              <div
                key={source}
                className="relative aspect-[4/3] overflow-hidden rounded-xl"
              >
                <Image
                  src={source}
                  alt={activity.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="bg-ink/5">
          <div className="page-shell flex flex-col gap-8 py-14">
            <h2 className="text-3xl">
              {t('activity.relatedTitle')}
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ActivityCard
                  key={item.slug}
                  activity={item}
                  t={t}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

function ContentList({ title, items }) {
  return (
    <Card
      className="p-5"
    >
      <h2 className="text-lg">{title}</h2>

      <ul className="mt-4 flex flex-col gap-3">
        {(items ?? []).map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm"
          >
            <span
              aria-hidden
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terra"
            />
            <span className="text-muted">{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
