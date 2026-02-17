import express, { Response } from 'express';
import { z } from 'zod';
import db from '../database';
import { AuthRequest, verifyToken } from '../middleware/auth';

const router = express.Router();

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  quantity: z.number().int().min(0),
  price: z.number().min(0),
});

router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY createdAt DESC').all();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req: AuthRequest, res: Response) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', verifyToken, (req: AuthRequest, res: Response) => {
  try {
    const { name, description, quantity, price } = productSchema.parse(req.body);
    const stmt = db.prepare(
      'INSERT INTO products (name, description, quantity, price) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(name, description || null, quantity, price);
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', verifyToken, (req: AuthRequest, res: Response) => {
  try {
    const { name, description, quantity, price } = productSchema.parse(req.body);
    const stmt = db.prepare(
      'UPDATE products SET name = ?, description = ?, quantity = ?, price = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?'
    );
    stmt.run(name, description || null, quantity, price, req.params.id);
    res.json({ message: 'Product updated' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', verifyToken, (req: AuthRequest, res: Response) => {
  try {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;