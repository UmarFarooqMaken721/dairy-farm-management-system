import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore DNS override errors in cloud environments
}

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../backend/src/routes/authRoutes';
import animalRoutes from '../backend/src/routes/animalRoutes';
import milkRoutes from '../backend/src/routes/milkRoutes';
import expenseRoutes from '../backend/src/routes/expenseRoutes';
import customerRoutes from '../backend/src/routes/customerRoutes';
import orderRoutes from '../backend/src/routes/orderRoutes';
import paymentRoutes from '../backend/src/routes/paymentRoutes';
import saleRoutes from '../backend/src/routes/saleRoutes';
import reportRoutes from '../backend/src/routes/reportRoutes';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Cached DB connection for Serverless
let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) return;
  await mongoose.connect(mongoUri);
  isConnected = true;
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Serverless DB connect error:', err);
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/milk', milkRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverless: true, timestamp: new Date() });
});

export default app;
