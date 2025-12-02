import { db } from '@/lib/db';
import { notificationService } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const { orderId, notificationType } = await request.json();

    if (!orderId || !notificationType) {
      return Response.json(
        { success: false, error: 'Missing orderId or notificationType' },
        { status: 400 }
      );
    }

    // Fetch order and customer details
    const orderResult = await db.query(
      `SELECT o.*, c.name, c.email, c.phone FROM orders o
       LEFT JOIN customers c ON o.user_id = c.id
       WHERE o.id = $1`,
      [orderId]
    );

    if (orderResult.length === 0) {
      return Response.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = orderResult[0];

    // Send notifications to customer
    if (order.email || order.phone) {
      await notificationService.notifyCustomer(
        orderId,
        {
          id: order.user_id,
          email: order.email,
          phone: order.phone,
        },
        notificationType,
        order.order_number
      );
    }

    return Response.json({
      success: true,
      message: 'Notifications sent',
    });
  } catch (error) {
    console.error('[v0] POST /api/notifications/send error:', error);
    return Response.json(
      { success: false, error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
