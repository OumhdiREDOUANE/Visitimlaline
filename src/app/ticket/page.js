'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { accessBooking } from '@/lib/frontend/api';

function TicketPageContent() {
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ reference: '', accessCode: '' });

  useEffect(() => {
    const reference = searchParams.get('reference');
    const accessCode = searchParams.get('access_code');

    if (!reference || !accessCode) {
      setLoading(false);
      return;
    }

    async function loadBooking() {
      try {
        setLoading(true);
        const data = await accessBooking(reference, accessCode);
        setBooking(data);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load your ticket.');
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [searchParams]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await accessBooking(form.reference, form.accessCode);
      setBooking(data);
    } catch (loadError) {
      setError(loadError.message || 'Invalid booking reference or access code.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <main className="page-shell py-16 text-center text-[#17130F]">Loading your ticket…</main>;
  }

  if (!booking) {
    return (
      <main className="page-shell flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-lg rounded-[32px] border border-[#D9B98C]/40 bg-[#F5EFE5] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.32em] text-[#B85F32]">Booking access</p>
          <h1 className="mt-3 text-4xl">Your ticket</h1>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.18em] text-[#17130F]/70">Booking reference</label>
              <input
                value={form.reference}
                onChange={(event) => setForm((value) => ({ ...value, reference: event.target.value }))}
                className="w-full rounded-2xl border border-[#D9B98C] bg-white px-4 py-3 text-[#17130F] outline-none focus:border-[#B85F32]"
                placeholder="BK-..."
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.18em] text-[#17130F]/70">Access code</label>
              <input
                value={form.accessCode}
                onChange={(event) => setForm((value) => ({ ...value, accessCode: event.target.value }))}
                className="w-full rounded-2xl border border-[#D9B98C] bg-white px-4 py-3 text-[#17130F] outline-none focus:border-[#B85F32]"
                placeholder="XXXX-XXXX-XXXX"
              />
            </div>

            {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

            <button type="submit" className="w-full rounded-full bg-[#B85F32] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#9d4d26]">
              View ticket
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell py-16">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-[#D9B98C]/40 bg-[#17130F] p-6 text-[#F5EFE5] shadow-[0_30px_80px_rgba(23,19,15,0.18)] sm:p-10">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.42em] text-[#D9B98C]">Visitimlaline</p>
          <h1 className="mt-4 text-3xl sm:text-4xl">{booking.activity_slug || 'Experience booking'}</h1>
        </div>

        <div className="mt-8 grid gap-5 rounded-[24px] border border-[#D9B98C]/25 bg-white/5 p-5 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-[#D9B98C]">Date & time</p>
            <p className="mt-2 text-xl font-semibold">{booking.date} · {booking.time}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-[#D9B98C]">Guests</p>
            <p className="mt-2 text-xl font-semibold">{booking.guests} guests</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-[#D9B98C]">Reference</p>
            <p className="mt-2 text-xl font-semibold">#{booking.booking_reference}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-[#D9B98C]">Status</p>
            <p className="mt-2 text-xl font-semibold">{booking.status}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-6 rounded-[24px] border border-[#D9B98C]/25 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-[#D9B98C]">Customer</p>
            <p className="mt-2 text-lg font-semibold">{booking.customer_name}</p>
          </div>
          <div className="rounded-[20px] border border-[#D9B98C]/35 bg-[#F5EFE5] px-5 py-4 text-center text-[#17130F]">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#17130F]/60">Access code</p>
            <p className="mt-2 text-xl font-bold">{booking.access_code}</p>
          </div>
        </div>

        <div className="mt-8 rounded-[24px] border border-dashed border-[#D9B98C]/50 bg-white/5 p-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#D9B98C]">QR placeholder</p>
          <div className="mx-auto mt-4 grid h-28 w-28 grid-cols-4 gap-1 rounded-xl bg-[#F5EFE5] p-3 text-[10px] text-[#17130F]">
            {Array.from({ length: 16 }).map((_, index) => (
              <span key={index} className={index % 2 === 0 ? 'bg-[#17130F]' : 'bg-transparent'} />
            ))}
          </div>
          <p className="mt-4 text-sm text-[#F5EFE5]/80">Booking access details are ready for check-in at the site.</p>
        </div>
      </div>
    </main>
  );
}

export default function TicketPage() {
  return (
    <Suspense fallback={<main className="page-shell py-16 text-center text-[#17130F]">Loading your ticket…</main>}>
      <TicketPageContent />
    </Suspense>
  );
}
