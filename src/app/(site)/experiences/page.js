import Link from 'next/link';

import { getI18n } from '@/lib/i18n/server.js';
import { getActivities } from '@/lib/services/activity.service.js';
import { ActivityCard } from '@/components/site/ActivityCard.js';
import { CategoryPill } from '@/components/site/CategoryPill.js';
import { EmptyState } from '@/components/ui/EmptyState.js';
import { categoryKey } from '@/lib/format.js';

export default async function ExperiencesPage({
  searchParams,
}) {
  const { t, locale } = await getI18n();
  const activities = getActivities();
  const params = await searchParams;
  const active = (params?.category ?? '').toString();
  const categories = [
    ...new Set(
      activities.map(
        (activity) => activity.category
      )
    ),
  ];

  const visible = active
    ? activities.filter(
        (activity) => activity.category === active
      )
    : activities;

  return (
    <div className="page-shell flex flex-col gap-10 py-12">
      <header className="flex flex-col gap-4">
        <p className="eyebrow">{t('experiences.eyebrow')}</p>
        <h1 className="max-w-2xl text-5xl">
          {t('experiences.title')}
        </h1>
        <p className="max-w-2xl text-muted">
          {t('experiences.lead')}
        </p>
      </header>

      <nav className="flex flex-wrap items-center gap-2">
        <CategoryPill
          href="/experiences"
          active={!active}
          label={t('experiences.all')}
        />

        {categories.map((category) => (
          <CategoryPill
            key={category}
            href={`/experiences?category=${category}`}
            active={active === category}
            label={t(
              `category.${categoryKey(category)}`,
              null,
              category
            )}
          />
        ))}
      </nav>

      {visible.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((activity) => (
            <ActivityCard
              key={activity.slug}
              activity={activity}
              t={t}
              locale={locale}
              titleAs="h2"
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={t('experiences.empty')}
          action={
            <Link
              href="/experiences"
              className="text-sm font-bold text-terra underline underline-offset-4"
            >
              {t('experiences.all')}
            </Link>
          }
        />
      )}
    </div>
  );
}
