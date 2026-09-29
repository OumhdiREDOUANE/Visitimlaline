import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildScanPayload,
  parseScanPayload,
} from '../src/lib/qr/payload.js';
import { renderQrDataUrl } from '../src/lib/qr/render.js';

const VALID = {
  booking_reference: 'BK-1A2B3C4D',
  access_code: 'HJ7K-9F2P-QR5T',
};

test('a real booking round-trips through the payload', () => {
  const payload = buildScanPayload(VALID);

  assert.equal(payload, 'BK-1A2B3C4D|HJ7K-9F2P-QR5T');
  assert.deepEqual(parseScanPayload(payload), VALID);
});

test('codes drawn from the real alphabet all round-trip', () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  for (let i = 0; i < 500; i++) {
    const booking = {
      booking_reference: `BK-${(i * 2654435761)
        .toString(16)
        .slice(-8)
        .padStart(8, '0')
        .toUpperCase()}`,
      access_code: Array.from(
        { length: 12 },
        (_, k) => chars[(i * 7 + k * 11) % chars.length]
      )
        .join('')
        .replace(/^(.{4})(.{4})(.{4})$/, '$1-$2-$3'),
    };

    assert.deepEqual(
      parseScanPayload(buildScanPayload(booking)),
      booking
    );
  }
});

test('decoders that add whitespace or lowercase still work', () => {
  assert.deepEqual(
    parseScanPayload('  bk-1a2b3c4d | hj7k-9f2p-qr5t\n'),
    VALID
  );
  assert.deepEqual(
    parseScanPayload('BK-1A2B3C4D\n|HJ7K-9F2P-QR5T'),
    VALID
  );
});

test('an admin payload with a masked access code renders nothing', () => {
  assert.equal(
    buildScanPayload({
      booking_reference: 'BK-1A2B3C4D',
      access_code_hint: 'QR5T',
    }),
    null
  );
  assert.equal(buildScanPayload({}), null);
  assert.equal(buildScanPayload(null), null);
});

test('a reference or code outside the real format is refused', () => {
  // Lowercase hex reference, wrong length, and a code using the characters
  // the generator excludes.
  assert.equal(
    buildScanPayload({ ...VALID, booking_reference: 'BK-1a2b3c4d' }),
    null
  );
  assert.equal(
    buildScanPayload({ ...VALID, booking_reference: 'BK-1234567' }),
    null
  );
  assert.equal(
    buildScanPayload({ ...VALID, access_code: 'HJ7K-9F2P-QR5' }),
    null
  );
  assert.equal(
    buildScanPayload({ ...VALID, access_code: 'HJ7K-9F2P-QR5I' }),
    null
  );
  assert.equal(
    buildScanPayload({ ...VALID, access_code: 'HJ7K-9F2P-QR50' }),
    null
  );
});

test('a foreign or corrupt QR is rejected instead of half-filled', () => {
  const junk = [
    '',
    'https://example.com',
    'BK-1A2B3C4D',
    'BJ7K-9F2P-QR5T|HJ7K-9F2P-QR5T',
    'BK-1A2B3C4D|HJ7K-9F2P-QR5T|EXTRA',
    'BK-1A2B3C4D;HJ7K-9F2P-QR5T',
    'BK-1A2B3C4D | HJ7K 9F2P QR5T',
    'DROP TABLE bookings',
    null,
    undefined,
    42,
    {},
    ['BK-1A2B3C4D|HJ7K-9F2P-QR5T'],
  ];

  for (const value of junk) {
    assert.equal(
      parseScanPayload(value),
      null,
      `should have rejected: ${JSON.stringify(value)}`
    );
  }
});

test('a guest booking renders a PNG data URL', async () => {
  const url = await renderQrDataUrl(VALID);

  assert.match(url, /^data:image\/png;base64,[A-Za-z0-9+/=]+$/);
  // Long enough to be a real image, short enough to sit in a JSON body.
  assert.ok(url.length > 200 && url.length < 8000, `length ${url.length}`);
});

test('an admin-shaped booking renders no QR at all', async () => {
  assert.equal(
    await renderQrDataUrl({
      booking_reference: 'BK-1A2B3C4D',
      access_code_hint: '••••-••••-QR5T',
    }),
    null
  );
  assert.equal(await renderQrDataUrl(null), null);
});
