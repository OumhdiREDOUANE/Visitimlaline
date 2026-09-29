import { logger } from '@/lib/observability/logger';
import { logRequest } from '@/lib/observability/route';
import { NextResponse } from 'next/server';

import { SESSION_COOKIE } from '@/lib/auth';
import {
  clearLoginFailures,
  isLoginBlocked,
  loginThrottleKey,
  recordLoginFailure,
} from '@/lib/auth/rate-limit';
import { validateLogin } from '@/lib/validation/auth.validation';
import { loginUser } from '@/lib/services/auth.service';

async function handlePOST(request) {
  let email = null;
  let throttleKey = null;

  try {
    const body = await request.json();

    const validation = validateLogin(body);

    if (!validation.valid) {
      return Response.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.errors,
        },
        {
          status: 422,
        }
      );
    }

    email = String(body.email)
      .trim()
      .toLowerCase();

    throttleKey = loginThrottleKey(
      request,
      email
    );

    const blocked = isLoginBlocked(throttleKey);

    if (blocked) {
      logger.warn('auth.login_throttled', {
        email,
        failures: blocked.failures,
        retryAfterSeconds: blocked.retryAfterSeconds,
      });

      return Response.json(
        {
          success: false,
          error: 'Too many failed attempts',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(
              blocked.retryAfterSeconds
            ),
          },
        }
      );
    }

    const result = loginUser(email, body.password);

    clearLoginFailures(throttleKey);

    logger.info('auth.login', {
      userId: result.user.id,
      role: result.user.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: result.user,
        },
      },
      {
        status: 200,
      }
    );

    response.cookies.set(SESSION_COOKIE, result.session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(result.session.expiresAt),
    });

    return response;
  } catch (error) {
    const status = error.status || 500;

    // Only a rejected credential counts against the throttle. A malformed
    // body has already returned above, and a 500 is our fault, not a guess.
    if (
      throttleKey &&
      (status === 401 || status === 403)
    ) {
      recordLoginFailure(throttleKey);
    }

    logger.warn('auth.login_failed', {
      status,
      email,
      error: error.message,
    });

    return Response.json(
      {
        success: false,
        error:
          status === 500 ? 'Login failed' : error.message,
      },
      {
        status,
      }
    );
  }
}

export const POST = logRequest(
  handlePOST,
  'POST /api/auth/login'
);
