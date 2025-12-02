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
      `SELECT id, order_number, status, updated_at, payment_status
       FROM orders
       WHERE id = ? OR order_number = ?`,
      [orderId, orderId]
    ) as any[];

    // Xử lý kết quả
    const orders = Array.isArray(result) ? result : [result];
    
    if (orders.length === 0 || !orders[0]) {
      return Response.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: orders[0],
    });
  } catch (error) {
    console.error('[v0] GET /api/orders/status-updates error:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch status',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}