const express = require('express');
const restaurantRoutes = require('./routes/restaurants');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Builds the Express app without connecting to a database or listening,
// so tests can import it directly.
function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/restaurants', restaurantRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
