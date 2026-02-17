export interface User {
  id: number;
  username: string;
  password: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface JwtPayload {
  userId: number;
  username: string;
}