import { describe, it, expect } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';
import Medicine from '../models/Medicine.js';

describe('POST /medicines', () => {
  it('should add a new medicine', async () => {
    const res = await request(app)
      .post('/api/medicines')
      .send({
        name: 'Paracetamol',
        brand: 'Generic',
        batchNumber: 'BATCH001',
        quantity: 50,
        price: 20,
        expiryDate: '2025-12-31',
        category: 'Pain Relief'
      });

    console.log('Response status:', res.status);
    console.log('Response body:', res.body);
    
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Paracetamol');
  });
}); 