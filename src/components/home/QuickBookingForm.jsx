'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuickBookingForm({ activities = [] }) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState('');

  const categories = useMemo(() => {
    const set = new Set(activities.map((activity) => activity.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [activities]);

  const visibleActivities = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'all') {
      return activities;
    }

    return activities.filter((activity) => activity.category === selectedCategory);
  }, [activities, selectedCategory]);

  function handleSubmit(event) {
    event.preventDefault();
    const targetSlug = selectedActivity || visibleActivities[0]?.slug;
    if (!targetSlug) {
      return;
    }
    router.push(`/experiences/${targetSlug}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-4xl rounded-[32px] border border-[#D9B98C]/30 bg-[#F5EFE5] p-4 shadow-[0_25px_80px_rgba(23,19,15,0.1)] sm:p-6">
      <div className="mb-4 text-center sm:text-left">
        <p className="text-xs uppercase tracking-[0.32em] text-[#B85F32]">What do you want to experience?</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] transition ${
                selectedCategory === category
                  ? 'border-[#B85F32] bg-[#B85F32] text-white'
                  : 'border-[#D9B98C] bg-white text-[#17130F] hover:border-[#B85F32]'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <select
            value={selectedActivity}
            onChange={(event) => setSelectedActivity(event.target.value)}
            className="min-h-[52px] flex-1 rounded-2xl border border-[#D9B98C] bg-white px-4 py-3 text-[#17130F] outline-none focus:border-[#B85F32]"
          >
            <option value="">Choose experience</option>
            {visibleActivities.map((activity) => (
              <option key={activity.slug} value={activity.slug}>
                {activity.title}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="min-h-[52px] rounded-full bg-[#B85F32] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#9d4d26]"
          >
            Check availability
          </button>
        </div>
      </div>
    </form>
  );
}
