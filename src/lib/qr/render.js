import QRCode from 'qrcode';

import { buildScanPayload } from './payload.js';

/**
 * Server-only QR rendering. Keeping the encoder on the server means the
 * Reed-Solomon implementation never reaches the browser bundle — the ticket
 * receives a finished image, the staff phone only ever needs a decoder.
 *
 * @param {{ booking_reference?: string, access_code?: string }} booking
 * @returns {Promise<string|null>} a data URL, or null when the booking has
 *   no scannable pair.
 */
export async function renderQrDataUrl(booking) {
  const payload = buildScanPayload(booking);

  if (!payload) {
    return null;
  }

  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 320,
    color: {
      dark: '#260707ff',
      light: '#ffffffff',
    },
  });
}
