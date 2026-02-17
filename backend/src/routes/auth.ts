import express, { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { z } from 'zod';
import db from '../database';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

router.post('/register', (req: AuthRequest, res: Response) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    stmt.run(username, hashedPassword);

    res.status(201).json({ message: 'User registered' });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', (req: AuthRequest, res: Response) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
    
    if (!user || !bcryptjs.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;