import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reservations', reservationRoutes);
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

export default app; // 👈 serve per i test
