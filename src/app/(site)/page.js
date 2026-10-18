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
import { HeroImageCycler } from '@/components/site/HeroImageCycler.js';
import { categoryKey } from '@/lib/format.js';

export default async function HomePage() {
  const { t, locale, currency } = await getI18n();
  const activities = getActivities(locale);
  const packs = getPacks(locale);
  const categories = [
    ...new Set(
      activities.map(
        (activity) => activity.category
      )
    ),
  ];

  return (
    <>
      <section className="on-dark relative isolate flex aspect-[2/1] w-full items-center overflow-hidden bg-ink text-cream sm:aspect-auto sm:min-h-[520px] lg:min-h-[760px]">
        <HeroImageCycler />

        <div className="page-shell relative z-20 flex min-h-full w-full flex-col justify-end">
          <div className="flex flex-row flex-wrap items-center justify-end gap-2 pb-3 pt-2 sm:gap-3 sm:pb-10 lg:pb-14">
            <Button
              href="/experiences"
              size="lg"
              className="!border-[#ff7f00] !bg-[#ff7f00] !px-3.5 !py-2 !text-[11px] !text-white hover:!bg-[#e06d00] sm:!px-7 sm:!py-4 sm:!text-sm"
            >
              {t('home.ctaExperiences')}
            </Button>

            <Button
              href="/packs"
              variant="onDark"
              size="lg"
              className="!px-3.5 !py-2 !text-[11px] sm:!px-7 sm:!py-4 sm:!text-sm"
            >
              {t('home.ctaPacks')}
            </Button>
          </div>
        </div>
      </section>

      

      <section className="page-shell grid gap-10 py-16 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="eyebrow">{t('home.faqEyebrow')}</p>
          <h2 className="mt-2 text-4xl">{t('home.faqTitle')}</h2>
          <p className="mt-4 max-w-md text-muted">{t('home.faqLead')}</p>
        </div>
        <div className="flex flex-col gap-3">
          {[
            ['home.faqPaymentQuestion', 'home.faqPaymentAnswer'],
            ['home.faqBeginnerQuestion', 'home.faqBeginnerAnswer'],
            ['home.faqBringQuestion', 'home.faqBringAnswer'],
            ['home.faqMeetingQuestion', 'home.faqMeetingAnswer'],
          ].map(([question, answer]) => (
            <details key={question} className="group rounded-2xl border border-ink/10 bg-surface px-5 py-4 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                {t(question)}
                <span className="text-xl text-terra group-open:hidden">+</span>
                <span className="hidden text-xl text-terra group-open:inline">−</span>
              </summary>
              <p className="pt-3 text-sm leading-6 text-muted">{t(answer)}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-ink/5">
        <div className="page-shell grid gap-8 py-16 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <p className="eyebrow">{t('home.locationEyebrow')}</p>
            <h2 className="mt-2 text-4xl">{t('home.locationTitle')}</h2>
            <p className="mt-4 max-w-xl text-muted">{t('home.locationText')}</p>
            <a
              href="https://maps.google.com/?q=Timlaline+Dunes+Morocco"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex font-bold text-terra underline underline-offset-4"
            >
              {t('home.locationCta')}
            </a>
          </div>
          <div className="overflow-hidden rounded-[28px] border border-sand/40 bg-surface p-2 shadow-[0_20px_60px_rgba(42,33,26,0.08)]">
            <iframe
              title={t('home.locationTitle')}
              src="https://www.google.com/maps?q=Timlaline%20Dunes%20Morocco&output=embed"
              className="h-72 w-full rounded-[22px] border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>

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
              currency={currency}
            />
          ))}
        </div>
      </section>

      <WaveEdge
        above
        tone="ink"
      />

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

          <div className="relative min-h-[420px]">
            <div className="absolute inset-x-8 top-0 overflow-hidden rounded-[2rem] border border-cream/20 shadow-[0_28px_70px_rgba(0,0,0,0.22)] sm:inset-x-12">
              <Image
                src="/timlaline-desert-landscape-atlantic-morocco.jpg"
                alt=""
                width={900}
                height={1100}
                className="h-[360px] w-full object-cover sm:h-[420px]"
              />
            </div>

            <div className="card-interactive absolute left-0 top-16 rounded-2xl border border-cream/20 bg-ink/75 px-4 py-3 backdrop-blur-md">
              <p className="font-display text-3xl">{activities.length}</p>
              <p className="text-xs uppercase tracking-[0.14em] text-cream/70">
                {t('home.statsExperiences')}
              </p>
            </div>

            <div className="card-interactive absolute right-0 top-44 rounded-2xl border border-cream/20 bg-ink/75 px-4 py-3 backdrop-blur-md">
              <p className="font-display text-3xl">{packs.length}</p>
              <p className="text-xs uppercase tracking-[0.14em] text-cream/70">
                {t('home.statsPacks')}
              </p>
            </div>

            <div className="card-interactive absolute bottom-0 left-8 rounded-2xl border border-sand/40 bg-terra-deep/90 px-4 py-3 backdrop-blur-md sm:left-16">
              <p className="font-display text-3xl">100%</p>
              <p className="text-xs uppercase tracking-[0.14em] text-cream/80">
                {t('home.statsGuiding')}
              </p>
            </div>
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
              currency={currency}
            />
          ))}
        </div>
      </section>
    </>
  );
}
