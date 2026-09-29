import { logger } from '@/lib/observability/logger';
import { logRequest } from '@/lib/observability/route';
import {
  getAuthenticatedUser,
} from '@/lib/auth';

async function handleGET(request) {
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
    logger.error(
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

export const GET = logRequest(handleGET, 'GET /api/auth/me');
