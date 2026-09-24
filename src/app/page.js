import Image from 'next/image';
import Link from 'next/link';
import { getActivities } from '@/lib/services/activity.service';
import { getPacks } from '@/lib/services/pack.service';
import QuickBookingForm from '@/components/home/QuickBookingForm';

const trustPoints = [
  'Local guides',
  'Real experiences',
  'Easy booking',
  'Small groups',
  'Clear arrival info',
];

export default function HomePage() {
  const activities = getActivities();
  const packs = getPacks();

  return (
    <main className="pb-24">
      <section className="relative overflow-hidden bg-[#17130F] text-[#F5EFE5]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
            alt="Timlaline desert adventure"
            fill
            priority
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,185,140,0.18),transparent_30%),linear-gradient(90deg,rgba(23,19,15,0.82),rgba(23,19,15,0.4))]" />
        </div>

        <div className="page-shell relative z-10 flex min-h-[760px] items-center py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.42em] text-[#D9B98C]">Timlaline · Morocco</p>
            <h1 className="mt-6 text-5xl font-semibold leading-[0.95] sm:text-6xl lg:text-7xl">
              ADVENTURE<br />STARTS HERE.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#F5EFE5]/80">
              Explore the landscapes, caves and sunsets of Timlaline.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/experiences" className="rounded-full bg-[#B85F32] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#9d4d26]">
                Book an experience
              </Link>
              <Link href="/experiences" className="rounded-full border border-[#D9B98C]/40 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#F5EFE5] transition hover:border-[#D9B98C] hover:text-[#D9B98C]">
                Explore
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-[#F5EFE5]/80">
              {['Quad', 'Sunset', 'Caves', 'Local experiences'].map((tag) => (
                <span key={tag} className="rounded-full border border-[#D9B98C]/30 bg-white/5 px-3 py-2">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell -mt-10 relative z-20">
        <QuickBookingForm activities={activities} />
      </section>

      <section className="page-shell mt-20 sm:mt-24">
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[#B85F32]">Choose your experience</p>
            <h2 className="mt-3 text-4xl sm:text-5xl">Adventure built for the moment.</h2>
          </div>
          <Link href="/experiences" className="hidden text-sm font-semibold uppercase tracking-[0.18em] text-[#17130F] md:inline-flex">
            View all →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {activities.map((activity) => (
            <article key={activity.slug} className="group overflow-hidden rounded-[28px] border border-[#D9B98C]/40 bg-[#F5EFE5] shadow-[0_20px_60px_rgba(23,19,15,0.05)] transition hover:-translate-y-1">
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={activity.hero || activity.gallery?.[0] || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39'}
                  alt={activity.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-[#D9B98C] bg-[#D9B98C]/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[#17130F]">{activity.category}</span>
                  <span className="text-xs uppercase tracking-[0.18em] text-[#17130F]/60">{activity.duration_min}–{activity.duration_max} min</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#17130F]">{activity.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#17130F]/70">{activity.description}</p>
                <div className="mt-5 flex items-center justify-between border-t border-[#17130F]/10 pt-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#17130F]/55">From</p>
                    <p className="text-xl font-semibold text-[#B85F32]">{Math.round(Number(activity.price_from || 0))} MAD</p>
                  </div>
                  <Link href={`/experiences/${activity.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#17130F]">
                    Explore →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 bg-[#17130F] py-20 text-[#F5EFE5]">
        <div className="page-shell grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[#D9B98C]">It’s not just a tour.</p>
            <h2 className="mt-4 text-4xl sm:text-5xl">It’s the memory.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#F5EFE5]/80">
              Ride. Explore. Watch the sun disappear. Discover Timlaline through a cinematic, locally guided adventure designed to slow the world down.
            </p>
          </div>
          <div className="relative h-[420px] overflow-hidden rounded-[32px]">
            <Image
              src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80"
              alt="Sunset in Timlaline"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="page-shell mt-20">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.32em] text-[#B85F32]">Make a day of it</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">Curated experiences, together.</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {packs.map((pack) => (
            <article key={pack.slug} className="overflow-hidden rounded-[28px] border border-[#D9B98C]/40 bg-[#F5EFE5]">
              <div className="relative h-64 overflow-hidden">
                <Image src={pack.hero || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39'} alt={pack.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#B85F32]">Pack</p>
                <h3 className="mt-3 text-3xl">{pack.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#17130F]/70">{pack.description}</p>
                <div className="mt-5 flex items-center justify-between border-t border-[#17130F]/10 pt-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#17130F]/55">From</p>
                    <p className="text-xl font-semibold text-[#B85F32]">{Math.round(Number(pack.price_from || 0))} MAD</p>
                  </div>
                  <Link href="/packs" className="text-sm font-semibold uppercase tracking-[0.18em] text-[#17130F]">Explore</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-shell mt-20">
        <div className="rounded-[32px] bg-[#D9B98C]/15 p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.32em] text-[#B85F32]">Why Visitimlaline?</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">Built for people who want the real story.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {trustPoints.map((point) => (
              <div key={point} className="rounded-[24px] border border-[#D9B98C]/40 bg-white/70 p-5 text-[#17130F]">
                <div className="mb-4 h-11 w-11 rounded-full bg-[#17130F] text-lg text-[#F5EFE5] flex items-center justify-center">✓</div>
                <p className="text-lg font-semibold">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell mt-20">
        <div className="rounded-[32px] bg-[#17130F] px-6 py-12 text-[#F5EFE5] sm:px-8 lg:px-12">
          <p className="text-xs uppercase tracking-[0.32em] text-[#D9B98C]">Your adventure is waiting</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">Choose your experience. Pick your date. See you in Timlaline.</h2>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/experiences" className="inline-flex items-center justify-center rounded-full bg-[#B85F32] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#9d4d26]">
              Book now →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
