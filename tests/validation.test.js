import test from 'node:test';
import assert from 'node:assert/strict';

import { validateBooking } from '../src/lib/validation/booking.validation.js';
import { validateLogin } from '../src/lib/validation/auth.validation.js';

const valid = {
  activity_slug: 'quad-adventure',
  customer_name: 'Sara',
  email: 'sara@example.com',
  phone: '+212600000000',
  date: '2026-10-10',
  time: '10:00',
  guests: 2,
};

test('a complete activity booking is valid', () => {
  assert.deepEqual(validateBooking(valid), {
    valid: true,
    errors: {},
  });
});

test('a complete pack booking is valid', () => {
  const result = validateBooking({
    ...valid,
    activity_slug: undefined,
    pack_slug: 'the-sunset',
  });

  assert.equal(result.valid, true);
});

test('exactly one product is required', () => {
  const none = validateBooking({
    ...valid,
    activity_slug: '  ',
  });

  assert.equal(none.valid, false);
  assert.ok(none.errors.activity_slug);

  const both = validateBooking({
    ...valid,
    pack_slug: 'the-sunset',
  });

  assert.equal(both.valid, false);
  assert.equal(
    both.errors.activity_slug,
    both.errors.pack_slug
  );
});

test('email, date and guests are checked like the API expects', () => {
  assert.ok(
    validateBooking({ ...valid, email: 'nope' }).errors.email
  );

  assert.ok(
    validateBooking({ ...valid, date: '10-10-2026' }).errors.date
  );

  assert.ok(
    validateBooking({ ...valid, guests: 0 }).errors.guests
  );

  assert.ok(
    validateBooking({ ...valid, guests: 9 }).errors.guests
  );

  assert.ok(
    validateBooking({ ...valid, guests: 2.5 }).errors.guests
  );

  assert.equal(
    validateBooking({ ...valid, guests: '4' }).valid,
    true
  );
});

test('a non object payload is rejected', () => {
  assert.equal(validateBooking(null).valid, false);
  assert.ok(validateBooking('string').errors.body);
});

test('login validation only requires an email and a password', () => {
  assert.deepEqual(
    validateLogin({ email: 'a@b.co', password: 'x' }),
    { valid: true, errors: {} }
  );

  assert.ok(validateLogin({ password: 'x' }).errors.email);
  assert.ok(validateLogin({ email: 'a@b.co' }).errors.password);
  assert.ok(validateLogin(undefined).errors.body);
});
