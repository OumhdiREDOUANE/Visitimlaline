async function fetchJson(path, options = {}) {
  const requestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    cache: options.cache || 'no-store',
  };

  const response = await fetch(path, requestInit);
  const text = await response.text();
  let payload = {};

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { error: text };
    }
  }

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed');
  }

  return payload;
}

export async function fetchActivities() {
  const payload = await fetchJson('/api/activities');
  return payload.data || [];
}

export async function fetchActivityBySlug(slug) {
  const payload = await fetchJson(`/api/activities/${slug}`);
  return payload.data || null;
}

export async function fetchPacks() {
  const payload = await fetchJson('/api/packs');
  return payload.data || [];
}

export async function fetchAvailability(activitySlug, date) {
  const params = new URLSearchParams({
    activity: activitySlug,
    date,
  });

  const payload = await fetchJson(`/api/availability?${params.toString()}`);
  return payload.data || { slots: [] };
}

export async function createBooking(payload) {
  const response = await fetchJson('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function accessBooking(reference, code) {
  const response = await fetchJson('/api/bookings/access', {
    method: 'POST',
    body: JSON.stringify({
      booking_reference: reference,
      access_code: code,
    }),
  });

  return response.data;
}

export async function loginUser(email, password) {
  const response = await fetchJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  return response.data;
}

export async function getCurrentUser() {
  try {
    const response = await fetchJson('/api/auth/me');
    return response.data?.user || null;
  } catch {
    return null;
  }
}

export async function logoutUser() {
  const response = await fetchJson('/api/auth/logout', {
    method: 'POST',
  });

  return response;
}

export async function fetchAdminBookings(filters = {}) {
  const params = new URLSearchParams();

  if (filters.status) params.set('status', filters.status);
  if (filters.activity) params.set('activity', filters.activity);

  const response = await fetchJson(`/api/admin/bookings${params.toString() ? `?${params.toString()}` : ''}`);
  return response.data || [];
}

export async function fetchAdminNotifications(filter = 'all') {
  const response = await fetchJson(`/api/admin/notifications?filter=${encodeURIComponent(filter)}`);
  return response.data || [];
}

export async function markNotificationRead(id) {
  const response = await fetchJson(`/api/admin/notifications/${id}/read`, {
    method: 'PATCH',
  });

  return response.data;
}

export async function markNotificationUnread(id) {
  const response = await fetchJson(`/api/admin/notifications/${id}/unread`, {
    method: 'PATCH',
  });

  return response.data;
}

export async function checkInBooking(reference, code) {
  const response = await fetchJson('/api/admin/bookings/arrive', {
    method: 'POST',
    body: JSON.stringify({
      booking_reference: reference,
      access_code: code,
    }),
  });

  return response.data;
}
