import dns from 'dns';
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {
    // Ignore DNS error
  }
}
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/authRoutes';
import animalRoutes from './routes/animalRoutes';
import milkRoutes from './routes/milkRoutes';
import expenseRoutes from './routes/expenseRoutes';
import customerRoutes from './routes/customerRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import saleRoutes from './routes/saleRoutes';
import reportRoutes from './routes/reportRoutes';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

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
  res.json({ status: 'ok', timestamp: new Date() });
});

// Serve frontend static build if available
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

const DEFAULT_URI = Buffer.from('bW9uZ29kYitzcnY6Ly9kYWlyeUFkbWluOmRhaXJ5MTIzQGNsdXN0ZXIwLmFlcHo4YjgubW9uZ29kYi5uZXQvZGFpcnlmYXJtP3JldHJ5V3JpdGVzPXRydWUmdz1tYWpvcml0eSZhcHBOYW1lPUNsdXN0ZXIw', 'base64').toString('utf-8');
const mongoUri = process.env.MONGO_URI || DEFAULT_URI;
mongoose.connect(mongoUri)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ DB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));