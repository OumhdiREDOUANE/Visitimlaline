import test from 'node:test';
import assert from 'node:assert/strict';

import {
  clearLoginFailures,
  isLoginBlocked,
  loginThrottleKey,
  recordLoginFailure,
  LOGIN_MAX_FAILURES,
  LOGIN_WINDOW_MS,
} from '../src/lib/auth/rate-limit.js';

/**
 * The login endpoint had no throttle at all: it relied on bcrypt plus a
 * 7-day token, which stops nothing against an online guessing loop. This
 * locks a fixed window of consecutive failures per client/account pair.
 */

const fakeRequest = (headers = {}) => ({
  headers: {
    get: (name) => headers[name.toLowerCase()] ?? null,
  },
});

test('the key pairs the client address with the account', () => {
  const request = fakeRequest({
    'x-forwarded-for': '203.0.113.7, 10.0.0.1',
  });

  assert.equal(
    loginThrottleKey(request, 'a@b.test'),
    '203.0.113.7|a@b.test'
  );
});

test('the key falls back through x-real-ip and then to a constant', () => {
  assert.equal(
    loginThrottleKey(fakeRequest({ 'x-real-ip': '198.51.100.4' }), 'a@b.test'),
    '198.51.100.4|a@b.test'
  );
  assert.equal(
    loginThrottleKey(fakeRequest(), 'a@b.test'),
    'unknown|a@b.test'
  );
});

test('the key separates accounts on the same address and vice versa', () => {
  const request = fakeRequest({ 'x-forwarded-for': '203.0.113.7' });

  assert.notEqual(
    loginThrottleKey(request, 'a@b.test'),
    loginThrottleKey(request, 'c@d.test')
  );
  assert.notEqual(
    loginThrottleKey(request, 'a@b.test'),
    loginThrottleKey(fakeRequest({ 'x-forwarded-for': '203.0.113.8' }), 'a@b.test')
  );
});

test('a fresh key is not blocked', () => {
  const key = 'fresh-key-not-blocked';

  clearLoginFailures(key);

  assert.equal(isLoginBlocked(key), null);
});

test('failures only start blocking once the window budget is spent', () => {
  const key = 'ramp-key';

  clearLoginFailures(key);

  for (let i = 0; i < LOGIN_MAX_FAILURES; i++) {
    assert.equal(
      isLoginBlocked(key),
      null,
      `blocked early, after ${i + 1} failure(s)`
    );
    recordLoginFailure(key);
  }

  const blocked = isLoginBlocked(key);

  assert.ok(blocked, 'not blocked after the budget was spent');
  assert.equal(blocked.failures, LOGIN_MAX_FAILURES);
  assert.ok(blocked.retryAfterSeconds > 0);
  assert.ok(
    blocked.retryAfterSeconds <= LOGIN_WINDOW_MS / 1000
  );

  clearLoginFailures(key);
});

test('a successful sign-in clears the counter', () => {
  const key = 'cleared-key';

  clearLoginFailures(key);
  recordLoginFailure(key);
  recordLoginFailure(key);

  assert.equal(isLoginBlocked(key), null);

  // A success in between must restart the budget, not merely top it up.
  clearLoginFailures(key);

  for (let i = 0; i < LOGIN_MAX_FAILURES - 1; i++) {
    recordLoginFailure(key);
  }

  assert.equal(
    isLoginBlocked(key),
    null,
    'the pre-success count survived into the new window'
  );

  // And the budget really is spent from zero, not from wherever it was.
  recordLoginFailure(key);

  assert.ok(
    isLoginBlocked(key),
    'a full window of failures after a success must block'
  );

  clearLoginFailures(key);
});

test('the window reopens once it has elapsed', () => {
  const key = 'window-key';
  const start = 1_700_000_000_000;

  clearLoginFailures(key);

  for (let i = 0; i < LOGIN_MAX_FAILURES; i++) {
    recordLoginFailure(key, start);
  }

  assert.ok(isLoginBlocked(key, start), 'should be blocked inside the window');

  const afterWindow = isLoginBlocked(
    key,
    start + LOGIN_WINDOW_MS + 1
  );

  assert.equal(
    afterWindow,
    null,
    'still blocked after the window closed'
  );

  // And the counter restarts rather than resuming at the old total.
  assert.equal(isLoginBlocked(key, start + LOGIN_WINDOW_MS + 1), null);
  recordLoginFailure(key, start + LOGIN_WINDOW_MS + 1);
  assert.equal(isLoginBlocked(key, start + LOGIN_WINDOW_MS + 1), null);

  clearLoginFailures(key);
});

test('the blocked reply reports a shrinking retry-after', () => {
  const key = 'retry-key';
  const start = 1_700_000_000_000;

  clearLoginFailures(key);

  for (let i = 0; i < LOGIN_MAX_FAILURES; i++) {
    recordLoginFailure(key, start);
  }

  const early = isLoginBlocked(key, start);
  const late = isLoginBlocked(key, start + LOGIN_WINDOW_MS - 1000);

  assert.ok(early.retryAfterSeconds > late.retryAfterSeconds);
  assert.equal(late.retryAfterSeconds, 1);

  clearLoginFailures(key);
});
