import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import { Product } from '../models/productModel.js';
import { Reservation } from '../models/reservationModel.js';
import { User } from '../models/userModel.js'; // se esiste

let mongoServer;
let tokenUser, tokenAdmin, createdProduct;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // crea utenti fake
  const admin = await User.create({
    username: 'Admin',
    email: 'admin@test.com',
    password: '123456',
    role: 'admin'
  });

  const user = await User.create({
    username: 'User',
    email: 'user@test.com',
    password: '123456',
    role: 'user'
  });

  // genera token JWT
  tokenAdmin = jwt.sign(
    { id: admin._id, role: 'admin' },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  );

  tokenUser = jwt.sign(
    { id: user._id, role: 'user' },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('🧠 Healthcheck', () => {
  it('should return ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

describe('📦 Products API', () => {
  it('should create product (admin only)', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        name: 'Lampada LED',
        description: 'Lampada da tavolo moderna',
        stock: 5,
        reserved: 0
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Lampada LED');
    createdProduct = res.body;
  });

  it('should not allow missing fields', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ name: 'Incomplete' });

    expect(res.statusCode).toBe(400);
  });

  it('should list all products', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${tokenUser}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('🛒 Reservations API', () => {
  it('should add a product to user reservation', async () => {
    const res = await request(app)
      .post(`/api/reservations/add/${createdProduct._id}`)
      .set('Authorization', `Bearer ${tokenUser}`)
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('Prenotato');
  });

  it('should prevent overbooking (no stock left)', async () => {
    // forza stock = 0
    await Product.findByIdAndUpdate(createdProduct._id, { stock: 0 });
    const res = await request(app)
      .post(`/api/reservations/add/${createdProduct._id}`)
      .set('Authorization', `Bearer ${tokenUser}`)
      .send();
    expect(res.statusCode).toBe(409); // prodotto esaurito
  });

  it('should remove product from reservation', async () => {
    const res = await request(app)
      .delete(`/api/reservations/remove/${createdProduct._id}`)
      .set('Authorization', `Bearer ${tokenUser}`);
    expect(res.statusCode).toBe(200);
  });
});
