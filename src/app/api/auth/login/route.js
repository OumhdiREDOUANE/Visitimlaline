import { NextResponse } from 'next/server';

import { validateLogin } from '@/lib/validation/auth.validation';

import {
  loginUser,
} from '@/lib/services/auth.service';

export async function POST(request) {
  try {
    const body = await request.json();

    const validation =
      validateLogin(body);

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

    const result = loginUser(
      body.email,
      body.password
    );

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

    response.cookies.set(
      'visitmlaline_session',
      result.session.token,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(
          result.session.expiresAt
        ),
      }
    );

    return response;
  } catch (error) {
    console.error(
      'POST /api/auth/login error:',
      error
    );

    const status =
      error.status || 500;

    return Response.json(
      {
        success: false,
        error:
          status === 500
            ? 'Login failed'
            : error.message,
      },
      {
        status,
      }
    );
  }
}