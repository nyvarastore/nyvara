const express  = require('express');
const router   = express.Router();
const supabase = require('../lib/supabase');

// GET /api/categories
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('categories').select('*').order('name', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) { next(err); }
});

module.exports = router;
