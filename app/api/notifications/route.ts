import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return Response.json(
        { success: false, error: 'orderId parameter required' },
        { status: 400 }
      );
    }

    const result = await db.query(
      `SELECT id, notification_type as type, channel, message, created_at
       FROM notifications
       WHERE order_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [orderId]
    );

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[v0] GET /api/notifications error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
