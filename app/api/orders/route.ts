import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status') || '';
    const limit = parseInt(searchParams.get('limit') || '50');

    // CASE 1: Today's sales
    if (type === 'today') {
      const today = new Date().toISOString().split('T')[0];
      
      const salesQuery = `
        SELECT 
          COUNT(*) as total_orders,
          SUM(total) as total_revenue,
          AVG(total) as average_order_value,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders
        FROM orders 
        WHERE DATE(created_at) = ?
      `;
      
      const [salesData] = await db.query(salesQuery, [today]) as any[];
      
      return Response.json({ 
        success: true, 
        data: {
          total_orders: parseInt(salesData?.total_orders) || 0,
          total_revenue: parseFloat(salesData?.total_revenue) || 0,
          average_order_value: parseFloat(salesData?.average_order_value) || 0,
          completed_orders: parseInt(salesData?.completed_orders) || 0
        }
      });
    }

    // CASE 2: Get all orders (cho OrdersPage)
    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    if (status && status !== 'all') {
      whereConditions.push('o.status = ?');
      queryParams.push(status);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    const ordersQuery = `
      SELECT 
        o.id,
        o.order_number,
        o.order_type,
        o.status,
        o.subtotal,
        o.tax,
        o.discount,
        o.total,
        o.payment_status,
        o.payment_method,
        o.customer_name,
        o.customer_phone,
        o.delivery_address,
        o.notes,
        o.created_at,
        o.updated_at,
        o.completed_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ?
    `;

    queryParams.push(limit);
    const orders = await db.query(ordersQuery, queryParams) as any[];

    // Format orders
    const formattedOrders = orders.map(order => ({
      id: order.id,
      order_number: order.order_number,
      order_type: order.order_type,
      status: order.status,
      subtotal: parseFloat(order.subtotal) || 0,
      tax: parseFloat(order.tax) || 0,
      discount: parseFloat(order.discount) || 0,
      total: parseFloat(order.total) || 0,
      payment_status: order.payment_status || 'pending',
      payment_method: order.payment_method,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      delivery_address: order.delivery_address,
      notes: order.notes,
      created_at: order.created_at,
      updated_at: order.updated_at,
      completed_at: order.completed_at,
      item_count: parseInt(order.item_count) || 0,
      items: [] // Tạm thời để array rỗng, có thể fetch sau nếu cần
    }));

    return Response.json({
      success: true,
      data: formattedOrders,
      count: formattedOrders.length
    });

  } catch (error: any) {
    console.error('[API] GET /api/orders error:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch orders',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // THÊM delivery_address vào destructuring
    const { 
      order_type, 
      customer_name, 
      customer_phone, 
      delivery_address,  // THÊM DÒNG NÀY
      items, 
      notes 
    } = data;

    // Attach authenticated user if available
    let userId: number | null = null;
    try {
      const token = cookies().get('auth_token')?.value;
      const payload = verifyToken(token);
      if (payload) {
        userId = Number(payload.sub) || null;
      }
    } catch {
      userId = null;
    }
    
    if (!order_type || !items || items.length === 0) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate thêm delivery_address
    if (!customer_name || !customer_phone || !delivery_address) {
      return Response.json(
        { 
          success: false, 
          error: 'Customer name, phone and delivery address are required' 
        },
        { status: 400 }
      );
    }

    // Tính toán total
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.unit_price), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    const orderNumber = `ORD-${Date.now()}`;
    
    // SỬA INSERT QUERY: THÊM delivery_address
    const orderQuery = `
      INSERT INTO orders (
        order_number, order_type, status, subtotal, tax, discount, total,
        payment_status, customer_name, customer_phone, delivery_address, notes, user_id
      ) VALUES (?, ?, 'pending', ?, ?, 0, ?, 'pending', ?, ?, ?, ?, ?)
    `;
    
    // SỬA: THÊM delivery_address vào parameters
    const orderResult = await db.query(orderQuery, [
      orderNumber, 
      order_type, 
      subtotal, 
      tax, 
      total,
      customer_name, 
      customer_phone, 
      delivery_address, // THÊM delivery_address
      notes || '',       // notes có thể undefined
      userId
    ]) as any;
    
    const orderId = orderResult.insertId;
    
    // Insert order items
    for (const item of items) {
      await db.query(`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
        VALUES (?, ?, ?, ?, ?)
      `, [
        orderId, 
        item.product_id, 
        item.quantity, 
        item.unit_price, 
        item.quantity * item.unit_price
      ]);
    }
    
    // Get created order với items
    const [createdOrder] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]) as any[];
    
    // Fetch items cho order
    const orderItems = await db.query(`
      SELECT oi.*, p.name as product_name 
      FROM order_items oi 
      LEFT JOIN products p ON oi.product_id = p.id 
      WHERE order_id = ?
    `, [orderId]) as any[];
    
    return Response.json({ 
      success: true, 
      data: {
        ...createdOrder,
        items: orderItems.map(item => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: parseFloat(item.unit_price),
          total_price: parseFloat(item.total_price)
        }))
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('[API] POST /api/orders error:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to create order',
        details: error.message,
        sql: error.sql
      },
      { status: 500 }
    );
  }
}