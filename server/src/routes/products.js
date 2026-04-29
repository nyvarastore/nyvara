const express  = require('express');
const router   = express.Router();
const supabase = require('../lib/supabase');

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const { category_id, gender, min_price, max_price, search, sort } = req.query;
    let query = supabase.from('products').select('*, categories(id, name)');
    if (category_id) query = query.eq('category_id', category_id);
    if (gender && gender !== 'all') query = query.eq('gender', gender);
    if (min_price) query = query.gte('price', Number(min_price));
    if (max_price) query = query.lte('price', Number(max_price));
    if (search)    query = query.ilike('title', `%${search}%`);
    switch (sort) {
      case 'price_asc':  query = query.order('price',      { ascending: true });  break;
      case 'price_desc': query = query.order('price',      { ascending: false }); break;
      case 'name_asc':   query = query.order('title',      { ascending: true });  break;
      default:           query = query.order('created_at', { ascending: false });
    }
    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) { next(err); }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('products').select('*, categories(id, name)')
      .eq('id', req.params.id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Product not found' });
    res.json(data);
  } catch (err) { next(err); }
});

module.exports = router;
