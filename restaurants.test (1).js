const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { createApp } = require('../src/app');

const app = createApp();
let mongod;

const validRestaurant = () => ({
  name: 'Trattoria Bella',
  cuisine: 'Italian',
  address: { street: '12 Royal Road', city: 'Port Louis' },
  priceRange: 3,
});

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  await mongoose.connection.syncIndexes();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.syncIndexes();
});

describe('POST /api/restaurants', () => {
  it('creates a restaurant and lowercases the cuisine', async () => {
    const res = await request(app).post('/api/restaurants').send(validRestaurant());
    expect(res.status).toBe(201);
    expect(res.body.cuisine).toBe('italian');
    expect(res.body._id).toBeDefined();
  });

  it('rejects a missing name with 400', async () => {
    const body = validRestaurant();
    delete body.name;
    const res = await request(app).post('/api/restaurants').send(body);
    expect(res.status).toBe(400);
    expect(res.body.details).toContain('Name is required');
  });

  it('rejects an unsupported cuisine with 400', async () => {
    const res = await request(app)
      .post('/api/restaurants')
      .send({ ...validRestaurant(), cuisine: 'martian' });
    expect(res.status).toBe(400);
  });

  it('rejects malformed JSON with 400', async () => {
    const res = await request(app)
      .post('/api/restaurants')
      .set('Content-Type', 'application/json')
      .send('{"name":');
    expect(res.status).toBe(400);
  });
});

describe('GET /api/restaurants', () => {
  it('returns paginated results filtered by cuisine', async () => {
    await request(app).post('/api/restaurants').send(validRestaurant());
    await request(app)
      .post('/api/restaurants')
      .send({ ...validRestaurant(), name: 'Sakura House', cuisine: 'japanese' });

    const res = await request(app).get('/api/restaurants?cuisine=italian');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].name).toBe('Trattoria Bella');
  });
});

describe('GET /api/restaurants/:id', () => {
  it('returns one restaurant', async () => {
    const created = await request(app).post('/api/restaurants').send(validRestaurant());
    const res = await request(app).get(`/api/restaurants/${created.body._id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Trattoria Bella');
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).get(`/api/restaurants/${new mongoose.Types.ObjectId()}`);
    expect(res.status).toBe(404);
  });

  it('returns 400 for a malformed id', async () => {
    const res = await request(app).get('/api/restaurants/not-an-id');
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/restaurants/:id', () => {
  it('updates a restaurant and runs validators', async () => {
    const created = await request(app).post('/api/restaurants').send(validRestaurant());

    const ok = await request(app)
      .put(`/api/restaurants/${created.body._id}`)
      .send({ phone: '+230 211 9999' });
    expect(ok.status).toBe(200);
    expect(ok.body.phone).toBe('+230 211 9999');

    const bad = await request(app)
      .put(`/api/restaurants/${created.body._id}`)
      .send({ priceRange: 9 });
    expect(bad.status).toBe(400);
  });
});

describe('DELETE /api/restaurants/:id', () => {
  it('deletes a restaurant and returns 204', async () => {
    const created = await request(app).post('/api/restaurants').send(validRestaurant());
    const res = await request(app).delete(`/api/restaurants/${created.body._id}`);
    expect(res.status).toBe(204);

    const after = await request(app).get(`/api/restaurants/${created.body._id}`);
    expect(after.status).toBe(404);
  });
});
