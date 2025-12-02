// API route for inventory management
import { inventoryAPI } from '@/lib/api-handlers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'low-stock') {
      const items = await inventoryAPI.getLowStockItems();
      return Response.json({ success: true, data: items });
    }

    return Response.json(
      { success: false, error: 'Invalid query parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[v0] GET /api/inventory error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}
