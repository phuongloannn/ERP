// API handler functions for common database operations with MySQL
import { db, type Product, type Order, type OrderItem } from "./db"

// Products API
export const productsAPI = {
  getAll: async () => {
    const products = await db.query("SELECT * FROM products WHERE is_active = true ORDER BY category, name")
    return products
  },

  getById: async (id: number) => {
    const product = await db.query("SELECT * FROM products WHERE id = ?", [id])
    return product[0]
  },

  create: async (data: Partial<Product>) => {
    const result = await db.query(
      `INSERT INTO products (name, description, category, price, image_url, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [data.name, data.description, data.category, data.price, data.image_url, true],
    )
    const created = await db.query("SELECT * FROM products WHERE id = LAST_INSERT_ID()")
    return created[0]
  },

  update: async (id: number, data: Partial<Product>) => {
    await db.query(
      `UPDATE products 
       SET name = COALESCE(?, name),
           description = COALESCE(?, description),
           category = COALESCE(?, category),
           price = COALESCE(?, price),
           image_url = COALESCE(?, image_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [data.name, data.description, data.category, data.price, data.image_url, id],
    )
    const result = await db.query("SELECT * FROM products WHERE id = ?", [id])
    return result[0]
  },
}

// Inventory API
export const inventoryAPI = {
  getByProductId: async (productId: number) => {
    const inventory = await db.query("SELECT * FROM inventory WHERE product_id = ?", [productId])
    return inventory[0]
  },

  updateStock: async (productId: number, quantity: number) => {
    await db.query(
      `UPDATE inventory 
       SET quantity_on_hand = quantity_on_hand + ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE product_id = ?`,
      [quantity, productId],
    )
    const result = await db.query("SELECT * FROM inventory WHERE product_id = ?", [productId])
    return result[0]
  },

  getLowStockItems: async () => {
    const items = await db.query(
      `SELECT i.*, p.name, p.category
       FROM inventory i
       JOIN products p ON i.product_id = p.id
       WHERE i.quantity_on_hand <= i.minimum_stock
       ORDER BY i.quantity_on_hand ASC`,
    )
    return items
  },
}

// Orders API
export const ordersAPI = {
  create: async (data: Partial<Order>, items: Partial<OrderItem>[]) => {
    // Generate order number
    const orderNumber = `ORD-${Date.now()}`

    const orderData = {
      order_number: orderNumber,
      cashier_id: data.cashier_id || null,
      order_type: data.order_type,
      status: "pending",
      subtotal: data.subtotal,
      tax: data.tax || 0,
      discount: data.discount || 0,
      total: data.total,
      payment_method: data.payment_method || null,
      customer_name: (data as any).customer_name || null,
      customer_phone: (data as any).customer_phone || null,
      delivery_address: data.delivery_address || null,
    }

    await db.query(
      `INSERT INTO orders (order_number, cashier_id, order_type, status, subtotal, tax, discount, total, payment_method, customer_name, customer_phone, delivery_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderData.order_number,
        orderData.cashier_id,
        orderData.order_type,
        orderData.status,
        orderData.subtotal,
        orderData.tax,
        orderData.discount,
        orderData.total,
        orderData.payment_method,
        orderData.customer_name,
        orderData.customer_phone,
        orderData.delivery_address,
      ],
    )

    const order = await db.query("SELECT * FROM orders WHERE order_number = ? ORDER BY id DESC LIMIT 1", [orderNumber])

    // Insert order items
    for (const item of items) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?)`,
        [order[0].id, item.product_id, item.quantity, item.unit_price, item.total_price],
      )
    }

    return order[0]
  },

  getById: async (id: number) => {
    const order = await db.query("SELECT * FROM orders WHERE id = ?", [id])
    return order[0]
  },

  getByOrderNumber: async (orderNumber: string) => {
    const order = await db.query("SELECT * FROM orders WHERE order_number = ?", [orderNumber])
    return order[0]
  },

  updateStatus: async (id: number, status: string) => {
    await db.query(
      `UPDATE orders 
       SET status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, id],
    )
    const result = await db.query("SELECT * FROM orders WHERE id = ?", [id])
    return result[0]
  },

  getTodaysSales: async () => {
    const sales = await db.query(
      `SELECT SUM(total) as total_revenue, COUNT(*) as total_orders
       FROM orders
       WHERE DATE(created_at) = DATE(NOW()) AND status != 'cancelled'`,
    )
    return sales[0]
  },

  getOrdersByDateRange: async (startDate: string, endDate: string) => {
    const orders = await db.query(
      `SELECT o.*, 
              JSON_ARRAYAGG(JSON_OBJECT('product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.unit_price)) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.created_at >= ? AND o.created_at <= ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [startDate, endDate],
    )
    return orders
  },
}
