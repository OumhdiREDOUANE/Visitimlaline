import test from 'node:test';
import assert from 'node:assert/strict';

import {
  categoryKey,
  formatDate,
  formatDateTime,
  formatMoney,
  intlLocale,
  parseSqliteDate,
  statusKey,
  todayISO,
} from '../src/lib/format.js';

test('money is rendered in dirhams with no decimals', () => {
  assert.match(formatMoney(90, 'fr'), /90/);
  assert.match(formatMoney(90, 'fr'), /MAD/);
  assert.match(formatMoney(90, 'en'), /90/);
  assert.equal(formatMoney('not a number', 'fr'), formatMoney(0, 'fr'));
});

test('a booking date never shifts with the timezone', () => {
  assert.equal(
    formatDate('2026-10-10', 'fr'),
    '10 octobre 2026'
  );

  assert.equal(
    formatDate('2026-01-01', 'en'),
    'January 01, 2026'
  );

  assert.equal(formatDate('', 'fr'), '');
  assert.equal(formatDate(undefined, 'fr'), '');
});

test('SQLite timestamps are read as UTC', () => {
  const parsed = parseSqliteDate('2026-09-22 14:50:36');

  assert.equal(parsed.toISOString(), '2026-09-22T14:50:36.000Z');
  assert.equal(parseSqliteDate(null), null);
  assert.equal(parseSqliteDate('  '), null);
  assert.equal(parseSqliteDate('nonsense'), null);
});

test('timestamps are displayed in the local timezone of the shop', () => {
  const formatted = formatDateTime(
    '2026-09-22 14:50:36',
    'fr'
  );

  assert.ok(formatted.length > 0);
  assert.match(formatted, /2026/);
  assert.equal(formatDateTime(null, 'fr'), '');
});

test('status and category keys are stable', () => {
  assert.equal(statusKey('NOT PAID YET'), 'notPaidYet');
  assert.equal(statusKey('ARRIVED'), 'arrived');
  assert.equal(statusKey('CANCELLED'), 'cancelled');
  assert.equal(statusKey('WHATEVER'), 'unknown');
  assert.equal(categoryKey('Quad'), 'quad');
  assert.equal(categoryKey(' Cave '), 'cave');
  assert.equal(categoryKey(null), '');
});

test('todayISO returns a YYYY-MM-DD string', () => {
  assert.match(todayISO(), /^\d{4}-\d{2}-\d{2}$/);
});

test('unknown locales fall back to French formatting', () => {
  assert.equal(intlLocale('de'), 'fr-MA');
  assert.equal(intlLocale('en'), 'en-MA');
});
