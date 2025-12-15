import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const token = cookies().get('auth_token')?.value
    const payload = verifyToken(token)

    if (!payload || payload.role !== 'customer') {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const orderId = parseInt(params.id, 10)
    if (Number.isNaN(orderId)) {
      return Response.json({ success: false, error: 'Invalid order id' }, { status: 400 })
    }

    const [order] = (await db.query(
      `SELECT id, order_number, order_type, status, subtotal, tax, discount, total,
              payment_method, payment_status, delivery_address, customer_name, customer_phone,
              notes, created_at, updated_at
       FROM orders
       WHERE id = ? AND user_id = ?
       LIMIT 1`,
      [orderId, payload.sub]
    )) as any[]

    if (!order) {
      return Response.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    const items = await db.query(
      `SELECT oi.id, oi.product_id, oi.quantity, oi.unit_price, oi.total_price,
              p.name as product_name, p.image_url
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    ) as any[]

    return Response.json({ success: true, data: { order, items } })
  } catch (error) {
    console.error('[API] GET /api/customer/orders/[id] error:', error)
    return Response.json({ success: false, error: 'Failed to fetch order' }, { status: 500 })
  }
}
