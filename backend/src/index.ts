import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running' });
});

app.get('/', (req, res) => {
  res.json({ message: "Backend up and running" });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});