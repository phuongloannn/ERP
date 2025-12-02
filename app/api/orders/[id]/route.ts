import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    console.log('Fetching order details for:', orderId);

    // 1. Fetch order basic info
    const orderQuery = `
      SELECT o.*, 
             c.name as customer_name, 
             c.phone as customer_phone
      FROM orders o
      LEFT JOIN customers c ON o.user_id = c.id
      WHERE o.id = ? OR o.order_number = ?
      LIMIT 1
    `;

    const orderResult = await db.query(orderQuery, [orderId, orderId]) as any[];
    
    if (!orderResult || orderResult.length === 0) {
      return Response.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = orderResult[0];

    // 2. Fetch order items with product details
    const itemsQuery = `
      SELECT 
        oi.id,
        oi.product_id,
        oi.quantity,
        oi.unit_price,
        oi.total_price,
        oi.special_instructions,
        p.name as product_name,
        p.image_url,
        p.category as product_category,
        p.description as product_description
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
      ORDER BY oi.id
    `;

    const itemsResult = await db.query(itemsQuery, [order.id]) as any[];

    // 3. Format response
    const formattedOrder = {
      id: order.id,
      order_number: order.order_number,
      order_type: order.order_type,
      status: order.status,
      subtotal: parseFloat(order.subtotal) || 0,
      tax: parseFloat(order.tax) || 0,
      discount: parseFloat(order.discount) || 0,
      total: parseFloat(order.total) || 0,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      delivery_address: order.delivery_address,
      customer_name: order.customer_name || order.customer_name_from_order,
      customer_phone: order.customer_phone || order.customer_phone_from_order,
      notes: order.notes,
      created_at: order.created_at,
      completed_at: order.completed_at,
      updated_at: order.updated_at,
      items: itemsResult.map(item => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_category: item.product_category,
        product_description: item.product_description,
        quantity: item.quantity,
        unit_price: parseFloat(item.unit_price) || 0,
        total_price: parseFloat(item.total_price) || 0,
        image_url: item.image_url,
        special_instructions: item.special_instructions
      }))
    };

    return Response.json({
      success: true,
      data: formattedOrder,
    });
    
  } catch (error: any) {
    console.error('[API] GET /api/orders/[id] error:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch order details',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Optional: PATCH endpoint để update order
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const body = await request.json();
    
    const {
      status,
      payment_status,
      payment_method,
      notes,
      delivery_address
    } = body;

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    if (payment_status) {
      updates.push('payment_status = ?');
      values.push(payment_status);
    }
    if (payment_method) {
      updates.push('payment_method = ?');
      values.push(payment_method);
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      values.push(notes);
    }
    if (delivery_address !== undefined) {
      updates.push('delivery_address = ?');
      values.push(delivery_address);
    }

    if (updates.length === 0) {
      return Response.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(orderId);

    const updateQuery = `
      UPDATE orders 
      SET ${updates.join(', ')}
      WHERE id = ?
    `;

    await db.query(updateQuery, values);

    return Response.json({
      success: true,
      message: 'Order updated successfully',
    });
    
  } catch (error: any) {
    console.error('[API] PATCH /api/orders/[id] error:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to update order',
        details: error.message
      },
      { status: 500 }
    );
  }
}