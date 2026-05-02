'use client';

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { CreateOrderPayload, Category } from '@/types';

// ─── useCategories ────────────────────────────────────────────────────────────

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
      .then(({ data }) => {
        setCategories((data as Category[]) ?? []);
        setLoading(false);
      });
  }, []);

  return { categories, loading };
}

// ─── useCreateOrder ───────────────────────────────────────────────────────────

export function useCreateOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createOrder = async (payload: CreateOrderPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Calculate total from Supabase (price authoritative on server)
      const productIds = payload.items.map(i => i.product_id);
      const { data: products, error: prodErr } = await supabase
        .from('products')
        .select('id, price')
        .in('id', productIds);

      if (prodErr) throw prodErr;

      const priceMap = Object.fromEntries(
        (products ?? []).map(p => [p.id, p.price ?? 0])
      );

      const total_price = payload.items.reduce(
        (sum, i) => sum + (priceMap[i.product_id] ?? 0) * i.quantity,
        0
      );

      // 2. Insert order
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          customer_name:  payload.customer_name,
          customer_email: payload.customer_email,
          phone:          payload.phone,
          city:           payload.city,
          postal_code:    payload.postal_code,
          country:        payload.country,
          total_price,
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      // 3. Insert order items
      const orderItems = payload.items.map(i => ({
        order_id:   order.id,
        product_id: i.product_id,
        quantity:   i.quantity,
      }));

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsErr) throw itemsErr;

      // 4. Create delivery order in Cosmos (fire-and-forget, don't block the customer)
      try {
        const cosmosRes = await fetch('/api/cosmos/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: payload.customer_name,
            phone:         payload.phone,
            city:          payload.city,
            total_price:   total_price,
            quantity:      payload.items.reduce((s, i) => s + i.quantity, 0),
            order_id:      order.id,  // used as externalBarcode in Cosmos
          }),
        });

        if (cosmosRes.ok) {
          const cosmosData = await cosmosRes.json();
          const delivery   = cosmosData.data;

          // Save Cosmos barcode + label URLs back to the Supabase order row
          await supabase
            .from('orders')
            .update({
              cosmos_barcode:      delivery.barcode,
              cosmos_label_url:    delivery.labelUrl,
              cosmos_label_pdf_url: delivery.labelPdfUrl,
              cosmos_status:       delivery.status,
            })
            .eq('id', order.id);
        }
      } catch (cosmosErr) {
        // Log but don't fail the customer order
        console.error('[Cosmos] Delivery creation failed:', cosmosErr);
      }

      setSuccess(true);
      return order;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Order failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error, success };
}
