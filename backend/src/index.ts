import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import db from "./database";
import bcryptjs from "bcryptjs";

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

function ensureAdminUser() {
  const username = "admin";
  const password = "admin123";

  const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(username) as any;
  if (existing) return;

  const hashed = bcryptjs.hashSync(password, 10);
  db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(username, hashed);

  console.log("Seeded admin user");
}

ensureAdminUser();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});