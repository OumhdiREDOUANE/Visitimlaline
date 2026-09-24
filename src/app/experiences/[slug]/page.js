import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getActivity } from '@/lib/services/activity.service';
import ExperienceBookingPanel from '@/components/booking/ExperienceBookingPanel';

function formatDuration(activity) {
  if (!activity) return 'Flexible';
  const min = Number(activity.duration_min || 0);
  const max = Number(activity.duration_max || 0);

  if (min && max && min !== max) {
    return `${min}–${max} min`;
  }

  if (min) {
    return `${min} min`;
  }

  return 'Flexible duration';
}

export default function ExperienceDetailPage({ params }) {
  const { slug } = params;
  const activity = getActivity(slug);

  if (!activity) {
    notFound();
  }

  const images = Array.isArray(activity.gallery) && activity.gallery.length ? activity.gallery : [activity.hero];
  const inclusions = Array.isArray(activity.inclusions) ? activity.inclusions : [];
  const goodToKnow = Array.isArray(activity.good_to_know) ? activity.good_to_know : [];
  const itinerary = Array.isArray(activity.itinerary) ? activity.itinerary : [];

  return (
    <main className="page-shell py-10 sm:py-14">
      <Link href="/experiences" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#17130F]">
        ← Experiences
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-[#B85F32]">{activity.category}</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">{activity.title}</h1>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-[#17130F]/70">
            <span className="rounded-full border border-[#D9B98C] bg-[#D9B98C]/10 px-3 py-1">{formatDuration(activity)}</span>
            <span className="rounded-full border border-[#D9B98C] bg-[#D9B98C]/10 px-3 py-1">From {Math.round(Number(activity.price_from || 0))} MAD</span>
            <span className="rounded-full border border-[#D9B98C] bg-[#D9B98C]/10 px-3 py-1">Small group experience</span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {images.slice(0, 4).map((image, index) => (
              <div key={`${image}-${index}`} className={index === 0 ? 'relative h-[420px] md:col-span-2 overflow-hidden rounded-[28px]' : 'relative h-56 overflow-hidden rounded-[28px]'}>
                <Image src={image} alt={`${activity.title} gallery ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[28px] border border-[#D9B98C]/40 bg-[#F5EFE5] p-6 sm:p-8">
            <h2 className="text-3xl">About the experience</h2>
            <p className="mt-4 text-base leading-8 text-[#17130F]/75">{activity.description}</p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-[28px] border border-[#D9B98C]/40 bg-[#F5EFE5] p-6">
              <h3 className="text-2xl">What’s included</h3>
              <ul className="mt-4 space-y-3 text-[#17130F]/75">
                {inclusions.length ? inclusions.map((item) => <li key={item} className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-[#B85F32]" /> <span>{item}</span></li>) : <li>No inclusion list provided.</li>}
              </ul>
            </section>

            <section className="rounded-[28px] border border-[#D9B98C]/40 bg-[#F5EFE5] p-6">
              <h3 className="text-2xl">Good to know</h3>
              <ul className="mt-4 space-y-3 text-[#17130F]/75">
                {goodToKnow.length ? goodToKnow.map((item) => <li key={item} className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-[#3D4A38]" /> <span>{item}</span></li>) : <li>No extra notes available.</li>}
              </ul>
            </section>
          </div>

          <section className="mt-8 rounded-[28px] border border-[#D9B98C]/40 bg-[#F5EFE5] p-6 sm:p-8">
            <h3 className="text-2xl">Your experience / itinerary</h3>
            <div className="mt-6 space-y-5">
              {itinerary.length ? itinerary.map(([step, detail], index) => (
                <div key={`${step}-${index}`} className="flex gap-4 rounded-2xl border border-[#17130F]/10 bg-white/70 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#17130F] text-sm font-semibold text-[#F5EFE5]">{index + 1}</div>
                  <div>
                    <p className="text-lg font-semibold text-[#17130F]">{step}</p>
                    <p className="mt-1 text-[#17130F]/75">{detail}</p>
                  </div>
                </div>
              )) : <p className="text-[#17130F]/70">No itinerary details available yet.</p>}
            </div>
          </section>
        </div>

        <div className="lg:sticky lg:top-28">
          <ExperienceBookingPanel activity={activity} />
        </div>
      </div>
    </main>
  );
}
