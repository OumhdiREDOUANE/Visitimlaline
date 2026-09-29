/**
 * Client-side diagnostics.
 *
 * Browser errors are written to the console only: shipping them over the
 * network would need a new endpoint and a telemetry policy (see
 * PROJECT_MAP.md > ORPHANS & PENDING).
 */

const isDev = process.env.NODE_ENV !== 'production';

export function logClientError(message, context) {
  if (isDev) {
    console.error(`[client] ${message}`, context ?? null);

    return;
  }

  console.error(`[client] ${message}`);
}
