'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/frontend/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(form.email, form.password);
      router.push('/admin');
      router.refresh();
    } catch (loginError) {
      setError(loginError.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-lg rounded-[32px] border border-[#D9B98C]/40 bg-[#F5EFE5] p-6 shadow-[0_25px_80px_rgba(23,19,15,0.08)] sm:p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-[#B85F32]">Staff access</p>
        <h1 className="mt-3 text-4xl">Login</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.18em] text-[#17130F]/70">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))}
              className="w-full rounded-2xl border border-[#D9B98C] bg-white px-4 py-3 text-[#17130F] outline-none focus:border-[#B85F32]"
              placeholder="name@visitimlaline.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.18em] text-[#17130F]/70">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((value) => ({ ...value, password: event.target.value }))}
              className="w-full rounded-2xl border border-[#D9B98C] bg-white px-4 py-3 text-[#17130F] outline-none focus:border-[#B85F32]"
              placeholder="••••••••"
            />
          </div>

          {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <button type="submit" disabled={loading} className="w-full rounded-full bg-[#B85F32] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#9d4d26] disabled:cursor-not-allowed disabled:bg-[#B85F32]/60">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
