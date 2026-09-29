/**
 * The one string a guest ticket and a staff phone must agree on.
 *
 * It carries exactly the two fields that POST /api/admin/bookings/arrive
 * already expects, so a scan is nothing more than autofilling that form:
 * no new route, no new secret, no schema change, no second source of truth.
 *
 *   BK-1A2B3C4D|HJ7K-9F2P-QR5T
 *
 * Both halves are validated on the way out as well as on the way in, so a
 * malformed booking can never be turned into a QR that scans to something
 * the endpoint would reject.
 */

// Booking references are BK- + 8 hex digits, upper case.
const REFERENCE = /^BK-[0-9A-F]{8}$/;

// Access codes are three blocks of four. The generator draws from an
// alphabet with I, O, 0 and 1 removed, so those can never appear.
const ACCESS_CODE = /^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/;

const SEPARATOR = '|';

/**
 * @param {{ booking_reference?: string, access_code?: string }} booking
 * @returns {string|null} the payload, or null when the booking cannot be
 *   represented (admin payloads mask the access code, so they correctly
 *   produce nothing).
 */
export function buildScanPayload(booking) {
  const reference = booking?.booking_reference;
  const code = booking?.access_code;

  if (
    typeof reference !== 'string' ||
    typeof code !== 'string'
  ) {
    return null;
  }

  if (
    !REFERENCE.test(reference) ||
    !ACCESS_CODE.test(code)
  ) {
    return null;
  }

  return `${reference}${SEPARATOR}${code}`;
}

/**
 * Tolerant on purpose: a camera decoder may hand back the content with
 * surrounding whitespace or line breaks, and some normalise case. Strict on
 * everything else, so a random QR in the wild is rejected rather than
 * half-filled.
 *
 * @param {unknown} text
 * @returns {{ booking_reference: string, access_code: string }|null}
 */
export function parseScanPayload(text) {
  if (typeof text !== 'string') {
    return null;
  }

  const normalised = text.replace(/\s+/g, '').toUpperCase();
  const parts = normalised.split(SEPARATOR);

  if (parts.length !== 2) {
    return null;
  }

  const [booking_reference, access_code] = parts;

  if (
    !REFERENCE.test(booking_reference) ||
    !ACCESS_CODE.test(access_code)
  ) {
    return null;
  }

  return { booking_reference, access_code };
}
