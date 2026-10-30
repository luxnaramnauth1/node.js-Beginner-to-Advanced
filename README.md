# Restaurant API

A small Express and MongoDB (Mongoose) CRUD API for restaurants. It covers schema modelling, validation, error handling, pagination and tests.

## Requirements

- Node.js 18 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup

```bash
npm install
cp .env.example .env        # adjust MONGODB_URI if needed
npm run seed                # optional: load three sample restaurants
npm start                   # http://localhost:3000
```

## Endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/health` | Health check |
| GET | `/api/restaurants` | List restaurants. Query: `cuisine`, `city`, `page`, `limit` |
| GET | `/api/restaurants/:id` | Get one restaurant |
| POST | `/api/restaurants` | Create a restaurant |
| PUT | `/api/restaurants/:id` | Update fields on a restaurant |
| DELETE | `/api/restaurants/:id` | Delete a restaurant (returns 204) |

### Example

```bash
curl -X POST http://localhost:3000/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{"name":"Trattoria Bella","cuisine":"italian","address":{"street":"12 Royal Road","city":"Port Louis"},"priceRange":3}'

curl "http://localhost:3000/api/restaurants?cuisine=italian&page=1&limit=5"
```

## Status codes

- `400` validation failed, malformed id, or malformed JSON
- `404` restaurant or route not found
- `409` duplicate key
- `500` unexpected error (details are logged, not returned)

## Tests

```bash
npm test
```

Tests use `mongodb-memory-server`, which downloads a MongoDB binary on first run, so no local database is needed.

## What to look at

- `src/models/Restaurant.js`: schema, enums, nested `hours`, timestamps and an index
- `src/routes/restaurants.js`: CRUD routes, pagination, and `runValidators` on update
- `src/middleware/errorHandler.js`: turning Mongoose and parser errors into clean JSON
- `src/app.js` vs `src/server.js`: the app is separated from the database connection so tests can import it

## Extending it

Good next steps are adding a `menu` subdocument array, which is the second project in this module, or a separate `reviews` collection that references restaurants by `_id`, which is the third.
