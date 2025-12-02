-- NEW: Add notifications table to track customer notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_id INTEGER REFERENCES customers(id),
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('order_confirmed', 'order_preparing', 'order_ready', 'order_delivering', 'order_completed', 'order_cancelled')),
  channel VARCHAR(50) NOT NULL CHECK (channel IN ('email', 'sms', 'push')),
  recipient VARCHAR(255) NOT NULL,
  message TEXT,
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_order_id ON notifications(order_id);
CREATE INDEX idx_notifications_customer_id ON notifications(customer_id);
CREATE INDEX idx_notifications_is_sent ON notifications(is_sent);
