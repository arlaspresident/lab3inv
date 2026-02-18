import express, { Response } from 'express';
import { z } from 'zod';
import db from '../database';
import { AuthRequest, verifyToken } from '../middleware/auth';

const router = express.Router();

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  quantity: z.number().int().min(0),
  price: z.number().min(0),
});

const updateSchema = createSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field is required' }
);

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
    const id = Number(req.params.id);
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', verifyToken, (req: AuthRequest, res: Response) => {
  try {
    const { name, description, quantity, price } = createSchema.parse(req.body);

    const stmt = db.prepare(
      'INSERT INTO products (name, description, quantity, price) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(name, description ?? null, quantity, price);

    const created = db
      .prepare('SELECT * FROM products WHERE id = ?')
      .get(result.lastInsertRowid);

    res.status(201).json(created);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', verifyToken, (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const data = updateSchema.parse(req.body);

    const fields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      values.push(data.description ?? null);
    }
    if (data.quantity !== undefined) {
      fields.push('quantity = ?');
      values.push(data.quantity);
    }
    if (data.price !== undefined) {
      fields.push('price = ?');
      values.push(data.price);
    }


    fields.push('updatedAt = CURRENT_TIMESTAMP');

    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    db.prepare(sql).run(...values);

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', verifyToken, (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const info = db.prepare('DELETE FROM products WHERE id = ?').run(id);

    if (info.changes === 0) return res.status(404).json({ error: 'Product not found' });

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
