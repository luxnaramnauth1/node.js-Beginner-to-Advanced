// Intermediate level: restaurants saved in MongoDB using Mongoose.
// Level 3 splits this code into folders, adds validation and tests.

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurants';

// A schema describes the shape of a document in MongoDB
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  city: { type: String, default: '' },
  priceRange: { type: Number, min: 1, max: 4, default: 2 },
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

const app = express();
app.use(express.json());

// GET all restaurants
app.get('/restaurants', async (req, res) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
});

// GET one restaurant
app.get('/restaurants/:id', async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }
  res.json(restaurant);
});

// POST a new restaurant
app.post('/restaurants', async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT (update) a restaurant
app.put('/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a restaurant
app.delete('/restaurants/:id', async (req, res) => {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }
  res.status(204).end();
});

// Connect to MongoDB first, then start listening
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Intermediate API running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  });
