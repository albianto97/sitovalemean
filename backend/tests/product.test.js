import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import { Product } from '../models/productModel.js';
import jwt from 'jsonwebtoken';

let token;

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/testdb');
  token = jwt.sign(
    { id: '507f191e810c19729de860ea', role: 'admin' },
    process.env.JWT_SECRET || 'secretkey',
    { expiresIn: '1h' }
  );
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Product API', () => {
  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Tazza test',
        description: 'Tazza in ceramica bianca',
        stock: 3,
        reserved: 0
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Tazza test');
  });

  it('should list all products', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
