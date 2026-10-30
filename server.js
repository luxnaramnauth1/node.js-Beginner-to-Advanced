// Beginner level: a web server with restaurant data kept in memory.
// Data is lost when the server stops. Level 2 saves it to MongoDB.

const express = require('express');

const app = express();
const PORT = 3000;

// Lets Express read JSON sent in request bodies
app.use(express.json());

// Our "database" for now: a plain JavaScript array
let restaurants = [
  { id: 1, name: 'Trattoria Bella', cuisine: 'italian', city: 'Port Louis' },
  { id: 2, name: 'Sakura House', cuisine: 'japanese', city: 'Grand Baie' },
];
let nextId = 3;

// GET all restaurants
app.get('/restaurants', (req, res) => {
  res.json(restaurants);
});

// GET one restaurant by id
app.get('/restaurants/:id', (req, res) => {
  const id = Number(req.params.id);
  const restaurant = restaurants.find((r) => r.id === id);

  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }
  res.json(restaurant);
});

// POST a new restaurant
app.post('/restaurants', (req, res) => {
  const { name, cuisine, city } = req.body;

  if (!name || !cuisine) {
    return res.status(400).json({ error: 'name and cuisine are required' });
  }

  const restaurant = { id: nextId++, name, cuisine, city: city || '' };
  restaurants.push(restaurant);
  res.status(201).json(restaurant);
});

// DELETE a restaurant
app.delete('/restaurants/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = restaurants.length;
  restaurants = restaurants.filter((r) => r.id !== id);

  if (restaurants.length === before) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Beginner API running at http://localhost:${PORT}`);
});
