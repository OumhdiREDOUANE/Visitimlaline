/**
 * Login throttle: a fixed window of consecutive failures per
 * (client address, account) pair.
 *
 * It counts *failures*, not attempts, so a member of staff who fat-fingers
 * their password twice is not punished, and a successful sign-in wipes the
 * counter. The window is per pair rather than per address so one attacker
 * cannot lock a known account out from the outside, and so a shared office
 * address does not throttle two different people against each other.
 *
 * State is in memory on purpose: this app is deployed as a single local
 * process (see §0), and a shared store would be a dependency and a schema
 * for a threat a LAN deployment does not have. The consequence is that a
 * restart clears the counters, which is the correct trade here.
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;

/** @type {Map<string, { count: number, firstAt: number }>} */
const failures = new Map();

/**
 * Best-effort client address. `x-forwarded-for` is first because a reverse
 * proxy is the only thing that sets it, and the left-most entry is the
 * original client. Falls back to a constant so the throttle still works when
 * no proxy is present — everything then shares one bucket, which is
 * conservative rather than wrong.
 *
 * @param {import('next/server').NextRequest} request
 * @param {string} email already normalised to lower case
 */
export function loginThrottleKey(
  request,
  email
) {
  const forwarded = request.headers
    .get('x-forwarded-for')
    ?.split(',')[0]
    ?.trim();
  const address =
    forwarded ||
    request.headers.get('x-real-ip') ||
    'unknown';

  return `${address}|${email}`;
}

/** Drops entries whose window has closed, so the map cannot grow forever. */
function sweep(now) {
  for (const [key, entry] of failures) {
    if (now - entry.firstAt >= WINDOW_MS) {
      failures.delete(key);
    }
  }
}

/**
 * @param {string} key
 * @param {number} [now]
 * @returns {{ failures: number, retryAfterSeconds: number }|null} null when
 *   the caller may attempt a sign-in.
 */
export function isLoginBlocked(
  key,
  now = Date.now()
) {
  sweep(now);

  const entry = failures.get(key);

  if (!entry || entry.count < MAX_FAILURES) {
    return null;
  }

  const remaining = WINDOW_MS - (now - entry.firstAt);

  if (remaining <= 0) {
    failures.delete(key);
    return null;
  }

  return {
    failures: entry.count,
    retryAfterSeconds: Math.ceil(remaining / 1000),
  };
}

export function recordLoginFailure(
  key,
  now = Date.now()
) {
  const entry = failures.get(key);

  if (!entry || now - entry.firstAt >= WINDOW_MS) {
    failures.set(key, {
      count: 1,
      firstAt: now,
    });

    return;
  }

  entry.count += 1;
}

export function clearLoginFailures(key) {
  failures.delete(key);
}

export const LOGIN_WINDOW_MS = WINDOW_MS;
export const LOGIN_MAX_FAILURES = MAX_FAILURES;
