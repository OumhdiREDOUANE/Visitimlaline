'use client';

import { useEffect, useMemo, useState } from 'react';
import { checkInBooking, fetchAdminBookings, fetchAdminNotifications, getCurrentUser, markNotificationRead, markNotificationUnread } from '@/lib/frontend/api';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [lookup, setLookup] = useState({ reference: '', code: '' });
  const [checkInState, setCheckInState] = useState({ message: '', kind: '' });

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser || !['admin', 'staff'].includes(currentUser.role)) {
          window.location.href = '/login';
          return;
        }

        setUser(currentUser);
        const [adminBookings, adminNotifications] = await Promise.all([
          fetchAdminBookings(),
          fetchAdminNotifications(filter),
        ]);

        setBookings(adminBookings);
        setNotifications(adminNotifications);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load admin data.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [filter]);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read_at).length, [notifications]);

  async function refreshNotifications(nextFilter = filter) {
    try {
      const data = await fetchAdminNotifications(nextFilter);
      setNotifications(data);
    } catch {
      setError('Notifications could not be refreshed.');
    }
  }

  async function toggleRead(id, read) {
    try {
      if (read) {
        await markNotificationRead(id);
      } else {
        await markNotificationUnread(id);
      }

      await refreshNotifications();
    } catch {
      setError('Notification update failed.');
    }
  }

  async function handleCheckIn(event) {
    event.preventDefault();
    setCheckInState({ message: '', kind: '' });

    try {
      const booking = await checkInBooking(lookup.reference, lookup.code);
      setCheckInState({ message: `Booking ${booking.booking_reference} marked as arrived.`, kind: 'success' });
      setLookup({ reference: '', code: '' });
      const refreshedBookings = await fetchAdminBookings();
      setBookings(refreshedBookings);
    } catch (error) {
      setCheckInState({ message: error.message || 'Check-in failed.', kind: 'error' });
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-12 text-[#17130F]">Loading administrator dashboard…</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[28px] bg-[#17130F] px-6 py-12 text-[#F5EFE5]">
        <p className="text-xs uppercase tracking-[0.32em] text-[#D9B98C]">Admin dashboard</p>
        <h1 className="mt-4 text-4xl font-semibold">Welcome back, {user?.name || 'Staff'}</h1>
        <p className="mt-3 max-w-2xl text-[#F5EFE5]/75">Monitor bookings, arrivals, and operational alerts for Visitimlaline.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-[#D9B98C]/40 bg-[#F5EFE5] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#17130F]">Check-in desk</h2>
            <span className="rounded-full bg-[#D9B98C]/20 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#17130F]">{unreadCount} unread</span>
          </div>
          <form onSubmit={handleCheckIn} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.18em] text-[#17130F]/70">Booking reference</label>
              <input
                value={lookup.reference}
                onChange={(event) => setLookup((value) => ({ ...value, reference: event.target.value }))}
                className="w-full rounded-2xl border border-[#D9B98C] bg-white px-4 py-3 text-[#17130F] outline-none focus:border-[#B85F32]"
                placeholder="BK-..."
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.18em] text-[#17130F]/70">Access code</label>
              <input
                value={lookup.code}
                onChange={(event) => setLookup((value) => ({ ...value, code: event.target.value }))}
                className="w-full rounded-2xl border border-[#D9B98C] bg-white px-4 py-3 text-[#17130F] outline-none focus:border-[#B85F32]"
                placeholder="XXXX-XXXX-XXXX"
              />
            </div>
            <button type="submit" className="w-full rounded-full bg-[#B85F32] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#9d4d26]">
              Mark client arrived
            </button>
          </form>
          {checkInState.message ? (
            <p className={`mt-4 rounded-2xl px-4 py-3 text-sm ${checkInState.kind === 'success' ? 'border border-green-200 bg-green-50 text-green-700' : 'border border-red-200 bg-red-50 text-red-700'}`}>
              {checkInState.message}
            </p>
          ) : null}
        </section>

        <section className="rounded-[28px] border border-[#D9B98C]/40 bg-[#F5EFE5] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#17130F]">Notifications</h2>
            <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-full border border-[#D9B98C] bg-white px-3 py-2 text-sm text-[#17130F]">
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          <div className="space-y-3">
            {notifications.length ? (
              notifications.map((notification) => (
                <div key={notification.id} className={`rounded-2xl border p-4 ${notification.read_at ? 'border-[#17130F]/10 bg-white/70' : 'border-[#D9B98C] bg-[#D9B98C]/10'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[#17130F]">{notification.type}</p>
                    <button onClick={() => toggleRead(notification.id, !notification.read_at)} className="text-xs uppercase tracking-[0.18em] text-[#B85F32]">
                      {notification.read_at ? 'Mark unread' : 'Mark read'}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-[#17130F]/75">{notification.message}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#17130F]/55">{new Date(notification.created_at).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#D9B98C] bg-white p-6 text-sm text-[#17130F]/60">No notifications found.</div>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-[28px] border border-[#D9B98C]/40 bg-[#F5EFE5] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#17130F]">Bookings</h2>
          <span className="text-sm text-[#17130F]/60">{bookings.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-[#17130F]">
            <thead>
              <tr className="border-b border-[#17130F]/10 text-[#17130F]/70">
                <th className="px-3 py-3 font-semibold">Reference</th>
                <th className="px-3 py-3 font-semibold">Customer</th>
                <th className="px-3 py-3 font-semibold">Activity</th>
                <th className="px-3 py-3 font-semibold">Date</th>
                <th className="px-3 py-3 font-semibold">Guests</th>
                <th className="px-3 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-[#17130F]/10 align-top">
                  <td className="px-3 py-3 font-semibold text-[#B85F32]">#{booking.booking_reference}</td>
                  <td className="px-3 py-3">{booking.customer_name}</td>
                  <td className="px-3 py-3">{booking.activity_slug}</td>
                  <td className="px-3 py-3">{booking.date} • {booking.time}</td>
                  <td className="px-3 py-3">{booking.guests}</td>
                  <td className="px-3 py-3"><span className="rounded-full bg-[#D9B98C]/20 px-2 py-1 text-xs uppercase tracking-[0.12em]">{booking.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
