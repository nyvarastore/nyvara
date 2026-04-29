const express  = require('express');
const router   = express.Router();
const supabase = require('../lib/supabase');

// POST /api/orders  — create order + order_items in one transaction
router.post('/', async (req, res, next) => {
  try {
    const { customer_name, customer_email, phone, city, postal_code, country, items } = req.body;
    if (!customer_name || !customer_email || !phone || !city || !country || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'customer_name, customer_email, phone, city, country and items are required.' });
    }

    // 1. Fetch prices from DB (never trust client-side prices)
    const productIds = items.map(i => i.product_id);
    const { data: products, error: pErr } = await supabase
      .from('products').select('id, price').in('id', productIds);
    if (pErr) throw pErr;

    const priceMap = Object.fromEntries((products ?? []).map(p => [p.id, p.price ?? 0]));
    const total_price = items.reduce((sum, i) => sum + (priceMap[i.product_id] ?? 0) * i.quantity, 0);

    // 2. Insert order
    const { data: order, error: oErr } = await supabase
      .from('orders')
      .insert({ 
        customer_name, 
        customer_email, 
        phone,
        city,
        postal_code,
        country,
        total_price 
      })
      .select().single();
    if (oErr) throw oErr;

    // 3. Insert order items
    const orderItems = items.map(i => ({
      order_id:   order.id,
      product_id: i.product_id,
      quantity:   i.quantity,
    }));
    const { error: iErr } = await supabase.from('order_items').insert(orderItems);
    if (iErr) throw iErr;

    res.status(201).json({ order, total_price });
  } catch (err) { next(err); }
});

// GET /api/orders/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('orders').select('*, order_items(*, products(*))')
      .eq('id', req.params.id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Order not found' });
    res.json(data);
  } catch (err) { next(err); }
});

module.exports = router;
