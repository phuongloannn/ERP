import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  try {
    const token = cookies().get('auth_token')?.value
    const payload = verifyToken(token)

    if (!payload || payload.role !== 'customer') {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await db.query(
      `SELECT id, order_number, status, total, created_at, updated_at, order_type, payment_status
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 100`,
      [payload.sub]
    ) as any[]

    return Response.json({ success: true, data: orders })
  } catch (error) {
    console.error('[API] GET /api/customer/orders error:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
