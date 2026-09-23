import { getPacks } from '@/lib/services/pack.service';

export async function GET() {
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