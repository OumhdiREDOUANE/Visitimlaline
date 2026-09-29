import { logRequest } from '@/lib/observability/route';
import { getPacks } from '@/lib/services/pack.service';

async function handleGET() {
  try {
    const packs = getPacks();

    return Response.json(
      {
        success: true,
        data: packs,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    

    return Response.json(
      {
        success: false,
        error: 'Failed to fetch packs',
      },
      {
        status: 500,
      }
    );
  }
}

export const GET = logRequest(handleGET, 'GET /api/packs');
