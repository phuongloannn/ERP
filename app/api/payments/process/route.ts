// Process payment for an order
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { order_id, amount } = await request.json()

    if (!order_id || !amount) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Simulate payment processing (in production, integrate with Stripe/MoMo/VNPay)
    console.log('[v0] Processing payment:', { order_id, amount })

    // Update order payment status
    const result = await db.query(
      `UPDATE orders 
       SET payment_status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      ['completed', order_id]
    )

    // Record transaction
    await db.query(
      `INSERT INTO transactions (order_id, amount, payment_method, status)
       VALUES ($1, $2, $3, $4)`,
      [order_id, amount, 'pos_payment', 'completed']
    )

    return Response.json({
      success: true,
      message: 'Payment processed successfully',
      data: result[0],
    })
  } catch (error) {
    console.error('[v0] POST /api/payments/process error:', error)
    return Response.json(
      { success: false, error: 'Failed to process payment' },
      { status: 500 }
    )
  }
}
