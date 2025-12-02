import mysql from "mysql2/promise";

// --- MySQL connection pool ---
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "", // trống nếu root không password
  database: process.env.DB_NAME || "fried_chicken_4s",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// --- Database helper ---
export const db = {
  query: async (query: string, params?: any[]) => {
    try {
      const connection = await pool.getConnection();
      try {
        const [results] = await connection.execute(query, params || []);
        return results;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("[DB] Database query error:", error);
      throw error;
    }
  },
};

// --- Type definitions ---
export interface Product {
  id: number;
  name: string;
  description?: string;
  category: string;
  price: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: number;
  product_id: number;
  quantity_on_hand: number;
  quantity_reserved: number;
  minimum_stock: number;
  reorder_point: number;
  last_restocked?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id?: number;
  cashier_id?: number;
  order_type: "dine-in" | "takeout" | "delivery" | "online";
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  payment_method?: string;
  payment_status?: string;
  delivery_address?: string;
  customer_name?: string;
  customer_phone?: string;
  notes?: string;
  created_at: string;
  completed_at?: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
  created_at?: string;
  updated_at?: string;
}
