// Update inventory stock levels
import { inventoryAPI } from '@/lib/api-handlers'

export async function POST(request: Request) {
  try {
    const { product_id, quantity_change } = await request.json()

    if (!product_id || quantity_change === undefined) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const updated = await inventoryAPI.updateStock(product_id, quantity_change)
    return Response.json({ success: true, data: updated })
  } catch (error) {
    console.error('[v0] POST /api/inventory/update error:', error)
    return Response.json(
      { success: false, error: 'Failed to update inventory' },
      { status: 500 }
    )
  }
}
