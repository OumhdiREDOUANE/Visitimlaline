import test from 'node:test';
import assert from 'node:assert/strict';

import { logger, __testing } from '../src/lib/observability/logger.js';

function capture({ level = 'info' } = {}) {
  const previousLevel = process.env.LOG_LEVEL;
  process.env.LOG_LEVEL = level;

  const out = [];
  const err = [];
  const originalOut = process.stdout.write;
  const originalErr = process.stderr.write;

  process.stdout.write = (chunk) => {
    out.push(String(chunk));
    return true;
  };

  process.stderr.write = (chunk) => {
    err.push(String(chunk));
    return true;
  };

  return {
    out,
    err,
    /** Only our own JSON lines: the test runner also writes to stdout. */
    records() {
      return [...out, ...err]
        .filter((chunk) => chunk.startsWith('{"ts"'))
        .map((chunk) => JSON.parse(chunk));
    },
    restore() {
      process.env.LOG_LEVEL = previousLevel;
      process.stdout.write = originalOut;
      process.stderr.write = originalErr;
    },
  };
}

const flush = () => new Promise((resolve) => setImmediate(resolve));

test('an info record is one JSON line on stdout', async () => {
  const sink = capture({ level: 'info' });

  try {
    logger.info('booking.created', {
      bookingId: 7,
      total: 90,
    });

    await flush();

    const records = sink.records();

    assert.equal(records.length, 1);

    const record = records[0];

    assert.equal(record.level, 'info');
    assert.equal(record.msg, 'booking.created');
    assert.equal(record.bookingId, 7);
    assert.ok(record.ts);
  } finally {
    sink.restore();
  }
});

test('debug is filtered out below the configured level', async () => {
  const sink = capture({ level: 'warn' });

  try {
    logger.debug('noise');
    logger.info('noise');
    logger.warn('kept');

    await flush();

    const records = sink.records();

    assert.equal(records.length, 1);
    assert.equal(records[0].msg, 'kept');
    assert.equal(records[0].level, 'warn');
  } finally {
    sink.restore();
  }
});

test('secrets are always redacted', async () => {
  const sink = capture({ level: 'info' });

  try {
    logger.info('auth.login', {
      email: 'staff@visimlaline.test',
      password: 'hunter2',
      access_code: 'ABCD-EFGH-IJKL',
      token: 'deadbeef',
      nested: { password_hash: 'x', safe: 'kept' },
    });

    await flush();

    const line = sink.records()[0];

    const serialised = JSON.stringify(line);

    assert.ok(!serialised.includes('hunter2'));
    assert.ok(!serialised.includes('ABCD-EFGH-IJKL'));
    assert.ok(!serialised.includes('deadbeef'));
    assert.ok(serialised.includes('[redacted]'));
    assert.ok(serialised.includes('staff@visimlaline.test'));
    assert.ok(serialised.includes('kept'));
  } finally {
    sink.restore();
  }
});

test('errors are serialised, deep objects are capped, nothing throws', async () => {
  const sink = capture({ level: 'info' });

  try {
    const circular = { name: 'loop' };
    circular.self = circular;

    logger.error('route.unhandled', {
      error: new TypeError('boom'),
      circular,
      deep: { a: { b: { c: { d: 1 } } } },
      long: 'x'.repeat(5000),
    });

    await flush();

    const record = sink.records()[0];

    assert.equal(record.level, 'error');
    assert.equal(record.msg, 'route.unhandled');
    assert.equal(record.error.name, 'TypeError');
    assert.equal(record.deep.a, '[object]');
    assert.ok(record.long.endsWith('…[truncated]'));
  } finally {
    sink.restore();
  }
});

test('an invalid level falls back to the environment default', () => {
  const previous = process.env.LOG_LEVEL;
  process.env.LOG_LEVEL = 'nonsense';

  try {
    assert.ok(
      Object.values(__testing.LEVELS).includes(
        __testing.resolveThreshold()
      )
    );
  } finally {
    process.env.LOG_LEVEL = previous;
  }
});

test('the redactor handles primitives and null', () => {
  assert.equal(__testing.redact(null), null);
  assert.equal(__testing.redact(5), 5);
  assert.deepEqual(
    __testing.redact([1, 'a']),
    [1, 'a']
  );
  assert.equal(
    __testing.redact({ a: { b: 1 } }).a.b,
    1
  );
});
