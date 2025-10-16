import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import { connectTestDB, closeTestDB } from './setupTestDB.js';
import { User } from '../models/userModel.js';
import { Product } from '../models/productModel.js';
import { Reservation } from '../models/reservationModel.js';

let userToken, user, product;

beforeAll(async () => {
  await connectTestDB();

  user = await User.create({
    username: 'Luca',
    email: 'luca@test.com',
    password: 'password',
    role: 'user'
  });

  userToken = jwt.sign(
    { id: user._id, role: 'user' },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  );

  product = await Product.create({
    name: 'Orologio',
    description: 'Da polso',
    stock: 5,
    reserved: 0
  });
});

afterAll(async () => {
  await closeTestDB();
});

describe('🛒 Reservation API', () => {
  it('should add product to reservation', async () => {
    const res = await request(app)
      .post(`/api/reservations/add/${product._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);

    const updated = await Reservation.findOne({ userId: user._id });
    expect(updated.products.length).toBe(1);
  });

  it('should not add product if out of stock', async () => {
    await Product.findByIdAndUpdate(product._id, { stock: 0 });
    const res = await request(app)
      .post(`/api/reservations/add/${product._id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(409);
  });

  it('should remove product from reservation', async () => {
    await Product.findByIdAndUpdate(product._id, { stock: 2 });
    const res = await request(app)
      .delete(`/api/reservations/remove/${product._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });

  it('should clear all reservations', async () => {
    await request(app)
      .post(`/api/reservations/add/${product._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    const res = await request(app)
      .delete('/api/reservations/clear')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('svuotate');
  });
});
