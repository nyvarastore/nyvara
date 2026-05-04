-- Add stock column to products table
ALTER TABLE products 
ADD COLUMN stock integer DEFAULT 0;

-- Optional: If you want existing products to start with a specific stock, e.g., 100:
-- UPDATE products SET stock = 100 WHERE stock = 0;
