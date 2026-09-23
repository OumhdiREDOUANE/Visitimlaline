import {
  getAuthenticatedUser,
} from '@/lib/auth';

export async function GET(request) {
  try {
    const user =
      getAuthenticatedUser(request);

    if (!user) {
      return Response.json(
        {
          success: false,
          error: 'Authentication required',
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        success: true,
        data: {
          user,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      'GET /api/auth/me error:',
      error
    );

    return Response.json(
      {
        success: false,
        error: 'Failed to get current user',
      },
      {
        status: 500,
      }
    );
  }
}