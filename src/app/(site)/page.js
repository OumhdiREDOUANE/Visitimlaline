import Image from 'next/image';
import Link from 'next/link';

import { getI18n } from '@/lib/i18n/server.js';
import { getActivities } from '@/lib/services/activity.service.js';
import { getPacks } from '@/lib/services/pack.service.js';
import { ActivityCard } from '@/components/site/ActivityCard.js';
import { CategoryPill } from '@/components/site/CategoryPill.js';
import { PackCard } from '@/components/site/PackCard.js';
import { WaveEdge } from '@/components/ui/WaveEdge.js';
import { Button } from '@/components/ui/Button.js';
import { categoryKey } from '@/lib/format.js';

export default async function HomePage() {
  const { t, locale } = await getI18n();
  const activities = getActivities();
  const packs = getPacks();
  const hero = activities[0] ?? packs[0];
  const categories = [
    ...new Set(
      activities.map(
        (activity) => activity.category
      )
    ),
  ];

  return (
    <>
      <section className="on-dark relative isolate flex min-h-[760px] items-center overflow-hidden bg-ink text-cream">
        {hero ? (
          <Image
            src={hero.hero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover"
          />
        ) : null}

        {/* The hero photo is bright sand, so the scrim is weighted to the
            left: the copy sits on the darkest part of the gradient and the
            image keeps its light on the right instead of being flattened
            by a uniform opacity. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-r from-ink/95 via-ink/70 to-ink/20"
        />

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-linear-to-t from-ink to-transparent"
        />

        <div className="page-shell flex w-full flex-col gap-6 py-20 sm:py-24">
          <p className="eyebrow">{t('home.eyebrow')}</p>

          <h1 className="max-w-4xl text-5xl sm:text-6xl lg:text-7xl">
            {t('home.title')}
          </h1>

          <p className="max-w-xl text-base text-cream/85 sm:text-lg">
            {t('home.subtitle')}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              href="/experiences"
              size="lg"
            >
              {t('home.ctaExperiences')}
            </Button>

            <Button
              href="/packs"
              variant="onDark"
              size="lg"
            >
              {t('home.ctaPacks')}
            </Button>
          </div>
        </div>
      </section>

      {/* The hero is `overflow-hidden` to clip its fill image, so a fringe
          hung off it would be cut off; the strip between the two is where the
          hero's ink reaches down from. */}
      <WaveEdge
        above
        tone="ink"
      />

      <section className="border-b border-ink/10 bg-surface">
        <div className="page-shell flex flex-wrap items-center gap-x-4 gap-y-3 py-5">
          <p className="eyebrow">
            {t('home.categoryEyebrow')}
          </p>

          <div className="flex flex-wrap gap-2">
            <CategoryPill
              href="/experiences"
              label={t('experiences.all')}
            />

            {categories.map((category) => (
              <CategoryPill
                key={category}
                href={`/experiences?category=${category}`}
                label={t(
                  `category.${categoryKey(category)}`,
                  null,
                  category
                )}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell flex flex-col gap-8 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{t('home.paceEyebrow')}</p>
            <h2 className="mt-2 text-4xl">
              {t('home.paceTitle')}
            </h2>
          </div>

          <Link
            href="/experiences"
            className="text-sm font-bold text-terra underline underline-offset-4"
          >
            {t('activity.backToExperiences')}
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.slug}
              activity={activity}
              t={t}
              locale={locale}
            />
          ))}
        </div>
      </section>

      <section className="on-dark bg-forest text-cream">
        <div className="page-shell grid gap-10 py-20 sm:grid-cols-2 sm:items-center">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">{t('home.storyEyebrow')}</p>
            <h2 className="text-4xl">
              {t('home.storyTitle')}
            </h2>
            <p className="text-cream/85">
              {t('home.storyText')}
            </p>
            <div>
              <Button
                href="/experiences"
                variant="onDark"
              >
                {t('home.storyCta')}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            {[
              activities.length,
              packs.length,
            ].map((value, index) => (
              <div
                key={index}
                className="rounded-2xl border border-cream/15 bg-ink/10 px-4 py-8"
              >
                <p className="font-display text-4xl">
                  {value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-cream/70">
                  {index === 0
                    ? t('nav.experiences')
                    : t('nav.packs')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The forest block's colour drips off its bottom edge into the pack grid. */}
      <WaveEdge tone="forest" />

      <section className="page-shell flex flex-col gap-8 py-16">
        <div>
          <p className="eyebrow">{t('home.packEyebrow')}</p>
          <h2 className="mt-2 text-4xl">
            {t('home.packTitle')}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
            <PackCard
              key={pack.slug}
              pack={pack}
              t={t}
              locale={locale}
            />
          ))}
        </div>
      </section>
    </>
  );
}
