import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice("Bearer ".length) : null;

  if (!token) return res.status(401).json({ error: 'No token provided' });

  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ error: 'JWT_SECRET missing' });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded as JwtPayload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
