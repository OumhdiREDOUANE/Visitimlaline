/**
 * Single fetch wrapper for every client-side call to the App Router API.
 *
 * It never throws: it always resolves to
 * { ok, status, data, error, details, remainingGuests, message }.
 */

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export async function apiFetch(
  path,
  { method = 'GET', body, signal } = {}
) {
  const hasBody = body !== undefined;

  let response;

  try {
    response = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: hasBody ? JSON_HEADERS : undefined,
      body: hasBody ? JSON.stringify(body) : undefined,
      ...(signal ? { signal } : {}),
    });
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw error;
    }

    return failure(0, 'network');
  }

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.success) {
    return {
      ...failure(
        response.status,
        payload?.error || `http_${response.status}`
      ),
      details: payload?.details ?? null,
      remainingGuests:
        payload?.remaining_guests === undefined
          ? null
          : payload.remaining_guests,
    };
  }

  return {
    ok: true,
    status: response.status,
    data: payload.data ?? null,
    message: payload.message ?? null,
    filters: payload.filters ?? null,
    filter: payload.filter ?? null,
    error: null,
    details: null,
    remainingGuests: null,
  };
}

function failure(status, error) {
  return {
    ok: false,
    status,
    data: null,
    message: null,
    filters: null,
    filter: null,
    error,
    details: null,
    remainingGuests: null,
  };
}
