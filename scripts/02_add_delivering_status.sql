-- Add 'delivering' status to orders table status check constraint
-- Note: PostgreSQL requires constraint modification via alter table
ALTER TABLE orders 
DROP CONSTRAINT orders_status_check;

ALTER TABLE orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'));
