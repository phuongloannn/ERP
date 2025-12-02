import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending,preparing,ready';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Chuyển status string thành array và tạo placeholders
    const statusArray = status.split(',');
    const placeholders = statusArray.map(() => '?').join(',');
    
    // Query cho MySQL/MariaDB (thay vì PostgreSQL)
    const query = `SELECT 
        o.id,
        o.order_number,
        o.order_type,
        o.status,
        o.total,
        o.created_at,
        o.updated_at,
        o.delivery_address,
        COUNT(oi.id) as item_count,
        GROUP_CONCAT(p.name SEPARATOR ', ') as item_names
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.status IN (${placeholders})
      GROUP BY o.id
      ORDER BY 
        CASE 
          WHEN o.status = 'ready' THEN 0
          WHEN o.status = 'preparing' THEN 1
          WHEN o.status = 'pending' THEN 2
          ELSE 3
        END,
        o.created_at ASC
      LIMIT ?`;

    // Tạo parameters array: status values + limit
    const params = [...statusArray, limit];

    const result = await db.query(query, params);

    return Response.json({
      success: true,
      data: result,
      count: Array.isArray(result) ? result.length : 0,
    });
  } catch (error) {
    console.error('[v0] GET /api/orders/feed error:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch order feed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}