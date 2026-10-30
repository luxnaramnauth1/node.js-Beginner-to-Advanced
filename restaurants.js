const express = require('express');
const Restaurant = require('../models/Restaurant');

const router = express.Router();

// GET /api/restaurants?cuisine=italian&city=Port%20Louis&page=1&limit=10
router.get('/', async (req, res, next) => {
  try {
    const { cuisine, city } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);

    const filter = {};
    if (cuisine) filter.cuisine = cuisine.toLowerCase();
    if (city) filter['address.city'] = city;

    const [items, total] = await Promise.all([
      Restaurant.find(filter)
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Restaurant.countDocuments(filter),
    ]);

    res.json({ data: items, page, limit, total });
  } catch (err) {
    next(err);
  }
});

// GET /api/restaurants/:id
router.get('/:id', async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    next(err);
  }
});

// POST /api/restaurants
router.post('/', async (req, res, next) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (err) {
    next(err);
  }
});

// PUT /api/restaurants/:id  (replace-style update, validators run)
router.put('/:id', async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/restaurants/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
