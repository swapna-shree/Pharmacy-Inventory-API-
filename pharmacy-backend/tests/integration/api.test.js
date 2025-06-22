import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../index.js';
import Medicine from '../../models/Medicine.js';

describe('API integration tests', () => {
  it('POST /api/medicines', async () => {
    const res = await request(app).post('/api/medicines').send({ 
      name: 'Test', 
      brand: 'TestBrand',
      batchNumber: 'BATCH002',
      quantity: 10,
      price: 15,
      expiryDate: '2025-12-31',
      category: 'Test Category'
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('GET, PUT, DELETE flow', async () => {
    const post = await request(app).post('/api/medicines').send({ 
      name: 'X',
      brand: 'BrandX',
      batchNumber: 'BATCH003',
      quantity: 5,
      price: 25,
      expiryDate: '2025-12-31',
      category: 'Category X'
    });
    const id = post.body._id;
    console.log('Created medicine with ID:', id);

    const put = await request(app).put(`/api/medicines/${id}`).send({ name: 'Y' });
    expect(put.status).toBe(200);

    const del = await request(app).delete(`/api/medicines/${id}`);
    expect(del.status).toBe(200);
  });

  it('GET /api/medicines - should return all medicines', async () => {
    
    await request(app).post('/api/medicines').send({ 
      name: 'Test Medicine',
      brand: 'TestBrand',
      batchNumber: 'BATCH004',
      quantity: 20,
      price: 30,
      expiryDate: '2025-12-31',
      category: 'Test Category'
    });

    const res = await request(app).get('/api/medicines');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/medicines/low-stock - should return low stock medicines', async () => {

    await request(app).post('/api/medicines').send({ 
      name: 'Low Stock Medicine',
      brand: 'TestBrand',
      batchNumber: 'BATCH005',
      quantity: 5, // Low stock
      price: 10,
      expiryDate: '2025-12-31',
      category: 'Test Category'
    });

    const res = await request(app).get('/api/medicines/low-stock');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/medicines/expired - should return expired medicines', async () => {
    await request(app).post('/api/medicines').send({ 
      name: 'Expired Medicine',
      brand: 'TestBrand',
      batchNumber: 'BATCH006',
      quantity: 10,
      price: 15,
      expiryDate: '2020-01-01',
      category: 'Test Category'
    });

    const res = await request(app).get('/api/medicines/expired');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PUT /api/medicines/:id - should return 404 for non-existent medicine', async () => {
    const res = await request(app).put('/api/medicines/507f1f77bcf86cd799439011').send({ name: 'Updated' });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('DELETE /api/medicines/:id - should return 404 for non-existent medicine', async () => {
    const res = await request(app).delete('/api/medicines/507f1f77bcf86cd799439011');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /api/medicines - should return 400 for invalid data', async () => {
    const res = await request(app).post('/api/medicines').send({ 
      name: 'Invalid Medicine'
      // Missing required fields
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('details');
  });

  it('PUT /api/medicines/:id - should handle partial updates', async () => {
    const post = await request(app).post('/api/medicines').send({ 
      name: 'Original Name',
      brand: 'TestBrand',
      batchNumber: 'BATCH007',
      quantity: 15,
      price: 20,
      expiryDate: '2025-12-31',
      category: 'Test Category'
    });
    const id = post.body._id;

    const put = await request(app).put(`/api/medicines/${id}`).send({ 
      name: 'Updated Name',
      price: 25
    });
    expect(put.status).toBe(200);
    expect(put.body.name).toBe('Updated Name');
    expect(put.body.price).toBe(25);
    expect(put.body.brand).toBe('TestBrand'); 
  });
}); 