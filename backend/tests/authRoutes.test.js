import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import app from '../app.js';
import { connectTestDB, closeTestDB } from './setupTestDB.js';
import { User } from '../models/userModel.js';

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe('🔐 Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'Mario',
      email: 'mario@example.com',
      password: 'password123'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message || res.body.email).toBeDefined();

    const user = await User.findOne({ email: 'mario@example.com' });
    expect(user).toBeTruthy();
  });

  it('should not register twice with same email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'Mario',
      email: 'mario@example.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(400);
  });

  it('should login with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'mario@example.com',
      password: 'password123'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    // verifica token valido
    const payload = jwt.decode(res.body.token);
    expect(payload.email || payload.id).toBeDefined();
  });

  it('should reject invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'mario@example.com',
      password: 'sbagliata'
    });
    expect(res.statusCode).toBe(401);
  });

  it('should reject missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'NoEmail'
    });
    expect(res.statusCode).toBe(400);
  });
});
