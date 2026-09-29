/**
 * Route logging wrapper.
 *
 * Usage inside an App Router route handler:
 *
 *   async function handleGET(request) { ... }
 *   export const GET = logRequest(handleGET, 'GET /api/activities');
 *
 * It adds a request id, the duration and the final status, and guarantees that
 * an unhandled throw is logged before it propagates.
 */

import { logger } from './logger.js';

export function logRequest(handler, route) {
  return async function loggedHandler(request, context) {
    const startedAt = process.hrtime.bigint();
    const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

    let response;

    try {
      response = await handler(request, context);
    } catch (error) {
      const durationMs = elapsed(startedAt);

      logger.error('route.unhandled', {
        requestId,
        route,
        method: request.method,
        durationMs,
        error,
      });

      throw error;
    }

    const durationMs = elapsed(startedAt);
    const status = response?.status ?? 200;
    const context_ = {
      requestId,
      route,
      method: request.method,
      status,
      durationMs,
    };

    if (status >= 500) {
      logger.error('route.completed', context_);
    } else if (status >= 400) {
      logger.warn('route.completed', context_);
    } else {
      logger.info('route.completed', context_);
    }

    return response;
  };
}

function elapsed(startedAt) {
  return Number(process.hrtime.bigint() - startedAt) / 1e6;
}
