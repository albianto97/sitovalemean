import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import { connectTestDB, closeTestDB } from './setupTestDB.js';
import { Product } from '../models/productModel.js';
import { User } from '../models/userModel.js';

let tokenAdmin, tokenUser, productId;

beforeAll(async () => {
  await connectTestDB();

  // ✅ crea utenti finti
  const admin = await User.create({
    username: 'AdminTest',
    email: 'admin@test.com',
    password: '123456',
    role: 'admin'
  });

  const user = await User.create({
    username: 'UserTest',
    email: 'user@test.com',
    password: '123456',
    role: 'user'
  });

  // ✅ genera token JWT validi
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
  await closeTestDB();
});

describe('📦 Product API', () => {
  it('should create a product (admin only)', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        name: 'Borraccia Termica',
        description: 'Borraccia in acciaio da 500ml',
        stock: 5,
        reserved: 0,
        link: 'https://esempio.it/borraccia'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Borraccia Termica');
    expect(res.body.stock).toBe(5);
    productId = res.body._id;
  });

  it('should reject creation without stock field', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        name: 'Prodotto senza stock',
        description: 'Test prodotto incompleto'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Errore creazione/i);
  });

  it('should reject creation with negative stock', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        name: 'Prodotto negativo',
        description: 'Test stock negativo',
        stock: -5,
        reserved: 0
      });

    expect(res.statusCode).toBe(400);
  });

  it('should list all products (user)', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${tokenUser}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('name');
  });

  it('should get product by ID', async () => {
    const res = await request(app)
      .get(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${tokenUser}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(productId);
  });

  it('should update product (admin only)', async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        name: 'Borraccia Aggiornata',
        description: 'Acciaio inox 750ml',
        stock: 10,
        reserved: 2
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Borraccia Aggiornata');
    expect(res.body.stock).toBe(10);
    expect(res.body.reserved).toBe(2);
  });

  it('should prevent update if not admin', async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({ name: 'Tentativo Utente' });

    expect([401, 403]).toContain(res.statusCode);
  });

  it('should delete product (admin only)', async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/eliminato/i);
  });

  it('should return 404 for deleted product', async () => {
    const res = await request(app)
      .get(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(404);
  });
});
