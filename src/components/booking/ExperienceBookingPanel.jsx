'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBooking, fetchAvailability } from '@/lib/frontend/api';

function formatDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getDefaultDate() {
  const today = new Date();
  const next = new Date(today);
  next.setDate(today.getDate() + 2);
  return next.toISOString().slice(0, 10);
}

export default function ExperienceBookingPanel({ activity }) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(getDefaultDate());
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (!activity?.slug) return;

    async function loadSlots() {
      setLoadingSlots(true);
      try {
        const data = await fetchAvailability(activity.slug, selectedDate);
        const nextSlots = data.slots || [];
        setSlots(nextSlots);

        const firstAvailable = nextSlots.find((slot) => slot.available);
        setSelectedTime(firstAvailable ? firstAvailable.time : nextSlots[0]?.time || '');
      } catch {
        setSlots([]);
        setSelectedTime('');
      } finally {
        setLoadingSlots(false);
      }
    }

    loadSlots();
  }, [activity, selectedDate]);

  const subtotal = useMemo(() => Number(activity?.price_from || 0) * Number(guests || 1), [activity, guests]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedTime) {
      setBookingError('Please choose an available time slot.');
      return;
    }

    if (!customer.firstName || !customer.lastName || !customer.email || !customer.phone) {
      setBookingError('Please complete all customer details.');
      return;
    }

    setBookingError('');
    setIsSubmitting(true);

    try {
      const booking = await createBooking({
        activity_slug: activity.slug,
        customer_name: `${customer.firstName} ${customer.lastName}`.trim(),
        email: customer.email,
        phone: customer.phone,
        date: selectedDate,
        time: selectedTime,
        guests,
      });

      router.push(`/ticket?reference=${encodeURIComponent(booking.booking_reference)}&access_code=${encodeURIComponent(booking.access_code)}`);
    } catch (error) {
      setBookingError(error.message || 'Booking could not be created.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-[28px] border border-[#D9B98C]/30 bg-[#F5EFE5] p-5 shadow-[0_30px_80px_rgba(23,19,15,0.12)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-[#B85F32]">Book your experience</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#17130F]">{activity?.title}</h3>
        </div>
        <div className="rounded-full bg-[#D9B98C]/20 px-3 py-2 text-sm font-semibold text-[#17130F]">
          {activity?.price_from ? `${Math.round(activity.price_from)} MAD` : 'Price on request'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.18em] text-[#17130F]/70">Date</label>
          <input
            type="date"
            value={selectedDate}
            min={getDefaultDate()}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="w-full rounded-2xl border border-[#D9B98C] bg-white px-4 py-3 text-[#17130F] outline-none ring-0 transition focus:border-[#B85F32]"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#17130F]/70">Time</span>
            {loadingSlots ? <span className="text-xs text-[#17130F]/60">Checking availability…</span> : null}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {slots.length ? (
              slots.map((slot) => {
                const isSelected = slot.time === selectedTime;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                      slot.available
                        ? isSelected
                          ? 'border-[#B85F32] bg-[#B85F32] text-white'
                          : 'border-[#D9B98C] bg-white text-[#17130F] hover:border-[#B85F32]'
                        : 'cursor-not-allowed border-[#17130F]/10 bg-[#17130F]/5 text-[#17130F]/40'
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })
            ) : (
              <div className="col-span-2 rounded-2xl border border-dashed border-[#D9B98C] bg-white px-4 py-4 text-sm text-[#17130F]/60">
                No time slots available for this date.
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.18em] text-[#17130F]/70">Guests</label>
          <div className="flex items-center justify-between rounded-2xl border border-[#D9B98C] bg-white px-4 py-3">
            <button type="button" onClick={() => setGuests((value) => Math.max(1, value - 1))} className="h-9 w-9 rounded-full bg-[#17130F] text-lg text-[#F5EFE5]">−</button>
            <span className="text-lg font-semibold text-[#17130F]">{guests}</span>
            <button type="button" onClick={() => setGuests((value) => Math.min(8, value + 1))} className="h-9 w-9 rounded-full bg-[#17130F] text-lg text-[#F5EFE5]">+</button>
          </div>
        </div>

        <div className="space-y-4 border-t border-[#17130F]/10 pt-4">
          <div className="flex items-center justify-between text-[#17130F]/70">
            <span>{guests} guests</span>
            <span>{subtotal} MAD</span>
          </div>
          <div className="flex items-center justify-between text-lg font-semibold text-[#17130F]">
            <span>Total</span>
            <span>{subtotal} MAD</span>
          </div>
        </div>

        <div className="space-y-3 border-t border-[#17130F]/10 pt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={customer.firstName}
              onChange={(event) => setCustomer((value) => ({ ...value, firstName: event.target.value }))}
              placeholder="First name"
              className="rounded-2xl border border-[#D9B98C] bg-white px-4 py-3 text-[#17130F] outline-none focus:border-[#B85F32]"
            />
            <input
              type="text"
              value={customer.lastName}
              onChange={(event) => setCustomer((value) => ({ ...value, lastName: event.target.value }))}
              placeholder="Last name"
              className="rounded-2xl border border-[#D9B98C] bg-white px-4 py-3 text-[#17130F] outline-none focus:border-[#B85F32]"
            />
          </div>
          <input
            type="email"
            value={customer.email}
            onChange={(event) => setCustomer((value) => ({ ...value, email: event.target.value }))}
            placeholder="Email"
            className="w-full rounded-2xl border border-[#D9B98C] bg-white px-4 py-3 text-[#17130F] outline-none focus:border-[#B85F32]"
          />
          <input
            type="tel"
            value={customer.phone}
            onChange={(event) => setCustomer((value) => ({ ...value, phone: event.target.value }))}
            placeholder="WhatsApp / phone"
            className="w-full rounded-2xl border border-[#D9B98C] bg-white px-4 py-3 text-[#17130F] outline-none focus:border-[#B85F32]"
          />
        </div>

        {bookingError ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{bookingError}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting || !selectedTime || !slots.some((slot) => slot.time === selectedTime && slot.available)}
          className="w-full rounded-full bg-[#B85F32] px-5 py-3 text-base font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#9d4d26] disabled:cursor-not-allowed disabled:bg-[#B85F32]/50"
        >
          {isSubmitting ? 'Confirming booking…' : 'Book now'}
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-[#17130F]/10 bg-white/70 p-4 text-sm text-[#17130F]/70">
        <p className="font-semibold text-[#17130F]">Booking summary</p>
        <div className="mt-2 flex items-center justify-between">
          <span>{activity?.title}</span>
          <span>{formatDate(selectedDate)}</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span>{selectedTime || 'No time selected'}</span>
          <span>{guests} guest(s)</span>
        </div>
      </div>
    </div>
  );
}
