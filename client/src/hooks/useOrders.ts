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
