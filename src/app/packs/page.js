import Image from 'next/image';
import Link from 'next/link';
import { getPacks } from '@/lib/services/pack.service';

export default function PacksPage() {
  const packs = getPacks();

  return (
    <main className="page-shell py-12 sm:py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.32em] text-[#B85F32]">Packs</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Build your perfect Timlaline day.</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {packs.map((pack) => (
          <article key={pack.slug} className="overflow-hidden rounded-[28px] border border-[#D9B98C]/40 bg-[#F5EFE5] shadow-[0_20px_60px_rgba(23,19,15,0.05)]">
            <div className="relative h-72 overflow-hidden">
              <Image src={pack.hero || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39'} alt={pack.title} fill className="object-cover" />
            </div>
            <div className="p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#B85F32]">Experience pack</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#17130F]">{pack.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#17130F]/70">{pack.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-[#17130F]/10 pt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#17130F]/55">Duration</p>
                  <p className="text-lg font-semibold text-[#17130F]">{pack.duration || 'Flexible'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#17130F]/55">From</p>
                  <p className="text-xl font-semibold text-[#B85F32]">{Math.round(Number(pack.price_from || 0))} MAD</p>
                </div>
              </div>
              <div className="mt-5">
                <Link href="/experiences" className="inline-flex rounded-full bg-[#B85F32] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#9d4d26]">
                  Explore pack
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
