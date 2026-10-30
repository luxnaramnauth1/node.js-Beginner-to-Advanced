require('dotenv').config();
const mongoose = require('mongoose');
const { createApp } = require('./app');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurants';

async function start() {
  // Wait for the connection before accepting requests, so routes never
  // hit a database that is not ready yet.
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
