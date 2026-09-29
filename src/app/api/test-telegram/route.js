import { logger } from '@/lib/observability/logger';
import { logRequest } from '@/lib/observability/route';
import { requireRole } from '@/lib/auth';
import { sendTelegramMessage } from '@/lib/services/telegram.service';

async function handleGET(request) {
  try {
    requireRole(request, ['admin']);

    await sendTelegramMessage(
      '✅ Test notification from Visitimlaline backend'
    );

    return Response.json({
      success: true,
      message: 'Telegram message sent successfully',
    });
  } catch (error) {
    logger.error('telegram.test_failed', {
      error,
    });

    const status = error.status || 500;

    return Response.json(
      {
        success: false,
        error:
          status === 500
            ? 'Telegram test failed'
            : error.message,
      },
      { status }
    );
  }
}

export const GET = logRequest(
  handleGET,
  'GET /api/test-telegram'
);
