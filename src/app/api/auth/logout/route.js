import { NextResponse } from 'next/server';

import {
  getTokenFromRequest,
} from '@/lib/auth';

import {
  logoutUser,
} from '@/lib/services/auth.service';

export async function POST(request) {
  try {
    const token =
      getTokenFromRequest(request);

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

    response.cookies.set(
      'visimlaline_session',
      '',
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      }
    );

    return response;
  } catch (error) {
    console.error(
      'POST /api/auth/logout error:',
      error
    );

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