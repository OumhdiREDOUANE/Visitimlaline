import { sendTelegramMessage } from '@/lib/services/telegram.service';

export async function GET() {
  try {
    await sendTelegramMessage(
      '✅ Test notification from Visitimlaline backend'
    );

    return Response.json({
      success: true,
      message: 'Telegram message sent successfully',
    });
  } catch (error) {
    console.error('Telegram test error:', error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}