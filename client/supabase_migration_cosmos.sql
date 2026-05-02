-- Run this in your Supabase SQL Editor

-- 1. Add cost_price column to products table
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS cost_price NUMERIC(10, 3) DEFAULT 0;

-- 2. Add cosmos_barcode and related fields to orders (if not already done)
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS cosmos_barcode       TEXT,
  ADD COLUMN IF NOT EXISTS cosmos_label_url     TEXT,
  ADD COLUMN IF NOT EXISTS cosmos_label_pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS cosmos_status        TEXT DEFAULT 'pending';
