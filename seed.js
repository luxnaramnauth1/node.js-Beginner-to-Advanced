require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurants';

const open9to10 = { open: '09:00', close: '22:00' };
const lunchOnly = { open: '11:30', close: '15:00' };

const sample = [
  {
    name: 'Trattoria Bella',
    cuisine: 'italian',
    address: { street: '12 Royal Road', city: 'Port Louis' },
    phone: '+230 211 0001',
    priceRange: 3,
    hours: { monday: open9to10, tuesday: open9to10, wednesday: open9to10, thursday: open9to10, friday: open9to10, saturday: open9to10, sunday: lunchOnly },
  },
  {
    name: 'Sakura House',
    cuisine: 'japanese',
    address: { street: '5 Coastal Avenue', city: 'Grand Baie' },
    phone: '+230 269 0002',
    priceRange: 4,
    hours: { monday: open9to10, tuesday: open9to10, wednesday: open9to10, thursday: open9to10, friday: open9to10, saturday: open9to10, sunday: open9to10 },
  },
  {
    name: 'Curry Leaf',
    cuisine: 'indian',
    address: { street: '88 Chaussée', city: 'Port Louis' },
    priceRange: 2,
    hours: { monday: open9to10, tuesday: open9to10, wednesday: open9to10, thursday: open9to10, friday: open9to10, saturday: open9to10, sunday: lunchOnly },
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Restaurant.deleteMany({});
  const inserted = await Restaurant.insertMany(sample);
  console.log(`Inserted ${inserted.length} restaurants`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
