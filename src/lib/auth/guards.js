import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE } from '../auth/index.js';
import { getCurrentUser } from '../services/auth.service.js';

/** Session user for a server component, or null. */
export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value ?? null;

  if (!token) {
    return null;
  }

  return getCurrentUser(token);
}

export async function requireUser(nextPath) {
  const user = await getSessionUser();

  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(nextPath || '/admin/bookings')}`
    );
  }

  return user;
}

export async function requireAdmin(nextPath) {
  const user = await requireUser(nextPath);

  if (user.role !== 'admin') {
    redirect('/staff/check-in');
  }

  return user;
}
