// Turns thrown errors into consistent JSON responses.
function errorHandler(err, req, res, next) {
  // Mongoose validation errors (missing or invalid fields)
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  // Malformed ObjectId in the URL, e.g. /api/restaurants/abc
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid id: ${err.value}` });
  }

  // Duplicate key (unique index violation)
  if (err.code === 11000) {
    return res.status(409).json({ error: 'A restaurant with that value already exists' });
  }

  // Bad JSON body from express.json()
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' });
  }

  const status = err.status || err.statusCode || 500;
  const message = status === 500 ? 'Something went wrong' : err.message;

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({ error: message });
}

function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFound };
