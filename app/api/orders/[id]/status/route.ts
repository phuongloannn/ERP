import { db } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);
    const body = await request.json();
    const { status } = body;

    console.log('Update status request:', { orderId, status });

    // Validate status
    const validStatuses = ['pending', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return Response.json(
        { 
          success: false, 
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // 1. UPDATE order status
    const updateQuery = `
      UPDATE orders 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await db.query(updateQuery, [status, orderId]);
    console.log('Status updated successfully');

    // 2. SELECT lại để lấy data mới
    const selectQuery = `SELECT * FROM orders WHERE id = ?`;
    const result = await db.query(selectQuery, [orderId]);
    
    // Xử lý kết quả SELECT - an toàn hơn
    let updatedOrder: any = null;
    
    if (Array.isArray(result)) {
      if (result.length > 0) {
        // Lấy phần tử đầu tiên
        updatedOrder = result[0];
      }
    } else if (result && typeof result === 'object') {
      updatedOrder = result;
    }

    // 3. Nếu status là 'completed', set completed_at
    if (status === 'completed') {
      try {
        await db.query(
          'UPDATE orders SET completed_at = CURRENT_TIMESTAMP WHERE id = ?',
          [orderId]
        );
        
        // Cập nhật lại updatedOrder
        if (updatedOrder) {
          updatedOrder.completed_at = new Date().toISOString();
        }
      } catch (error) {
        console.warn('Could not update completed_at:', error);
      }
    }

    // 4. Log status change (optional)
    try {
      await db.query(
        'INSERT INTO order_status_logs (order_id, status, changed_at) VALUES (?, ?, NOW())',
        [orderId, status]
      );
      console.log('Status change logged');
    } catch (logError) {
      console.warn('Could not log status change:', logError);
    }

    return Response.json({
      success: true,
      message: `Order ${orderId} updated to ${status}`,
      data: updatedOrder || { id: orderId, status },
    });
    
  } catch (error: any) {
    console.error('Error updating order status:', error);
    
    let errorMessage = 'Failed to update order status';
    if (error.code === 'ER_NO_SUCH_TABLE') {
      errorMessage = 'Orders table does not exist or wrong schema';
    } else if (error.code === 'ER_BAD_FIELD_ERROR') {
      errorMessage = 'Invalid column name in query';
    }
    
    return Response.json(
      { 
        success: false, 
        error: errorMessage,
        details: error.message,
        sql: error.sql
      },
      { status: 500 }
    );
  }
}