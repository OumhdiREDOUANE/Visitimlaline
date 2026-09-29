import { logger } from '@/lib/observability/logger';
import { logRequest } from '@/lib/observability/route';
import { NextResponse } from 'next/server';

import { getTokenFromRequest, SESSION_COOKIE } from '@/lib/auth';
import { logoutUser } from '@/lib/services/auth.service';

async function handlePOST(request) {
  try {
    const token = getTokenFromRequest(request);

    if (token) {
      logoutUser(token);
    }

    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      {
        status: 200,
      }
    );

    response.cookies.set(SESSION_COOKIE, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    logger.error('auth.logout_failed', {
      error,
    });

    return Response.json(
      {
        success: false,
        error: 'Logout failed',
      },
      {
        status: 500,
      }
    );
  }
}

export const POST = logRequest(
  handlePOST,
  'POST /api/auth/logout'
);
