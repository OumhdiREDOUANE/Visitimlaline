'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { fetchActivities } from '@/lib/frontend/api';

export default function ExperiencesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadActivities() {
      try {
        setLoading(true);
        const data = await fetchActivities();
        setActivities(data);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load experiences.');
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, []);

  const filteredActivities = useMemo(() => {
    if (!search.trim()) {
      return activities;
    }

    const normalized = search.toLowerCase();
    return activities.filter((activity) =>
      [activity.title, activity.category, activity.description].join(' ').toLowerCase().includes(normalized)
    );
  }, [activities, search]);

  return (
    <main className="page-shell py-12 sm:py-16">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-[#B85F32]">Experiences</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Find your next Timlaline moment.</h1>
        </div>
        <div className="w-full max-w-md">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by activity, category or keyword"
            className="w-full rounded-full border border-[#D9B98C] bg-white px-4 py-3 text-[#17130F] outline-none focus:border-[#B85F32]"
          />
        </div>
      </div>

      {loading ? <div className="rounded-[28px] border border-dashed border-[#D9B98C] bg-white/70 p-12 text-center text-[#17130F]/70">Loading activities…</div> : null}
      {error ? <div className="rounded-[28px] border border-red-200 bg-red-50 p-5 text-red-700">{error}</div> : null}

      {!loading && !error && !filteredActivities.length ? (
        <div className="rounded-[28px] border border-dashed border-[#D9B98C] bg-white/70 p-12 text-center text-[#17130F]/70">
          No activities match your search.
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredActivities.map((activity) => (
            <article key={activity.slug} className="overflow-hidden rounded-[28px] border border-[#D9B98C]/40 bg-[#F5EFE5] shadow-[0_20px_60px_rgba(23,19,15,0.05)]">
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={activity.hero || activity.gallery?.[0] || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39'}
                  alt={activity.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full border border-[#D9B98C] bg-[#D9B98C]/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[#17130F]">{activity.category}</span>
                  <span className="text-xs uppercase tracking-[0.18em] text-[#17130F]/60">{activity.duration_min}–{activity.duration_max} min</span>
                </div>
                <h2 className="text-2xl font-semibold text-[#17130F]">{activity.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#17130F]/70">{activity.description}</p>
                <div className="mt-5 flex items-center justify-between border-t border-[#17130F]/10 pt-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#17130F]/55">Starting from</p>
                    <p className="text-xl font-semibold text-[#B85F32]">{Math.round(Number(activity.price_from || 0))} MAD</p>
                  </div>
                  <Link href={`/experiences/${activity.slug}`} className="rounded-full bg-[#B85F32] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#9d4d26]">
                    Book now
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </main>
  );
}
