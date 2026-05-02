-- Run this in your Supabase SQL Editor
-- Adds Cosmos delivery tracking fields to the orders table

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS cosmos_barcode       TEXT,
  ADD COLUMN IF NOT EXISTS cosmos_label_url     TEXT,
  ADD COLUMN IF NOT EXISTS cosmos_label_pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS cosmos_status        TEXT DEFAULT 'pending';
