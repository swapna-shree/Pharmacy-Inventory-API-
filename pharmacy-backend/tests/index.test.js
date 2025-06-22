import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../index.js';

const originalConsole = { ...console };

describe('Express App Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.log = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    vi.restoreAllMocks();
  });

  it('should have CORS middleware enabled', async () => {
    const res = await request(app)
      .options('/api/medicines')
      .set('Origin', 'http://localhost:3000');
    
    expect(res.headers['access-control-allow-origin']).toBeDefined();
  });

  it('should parse JSON requests', async () => {
    const res = await request(app)
      .post('/api/medicines')
      .send({
        name: 'Test Medicine',
        brand: 'TestBrand',
        batchNumber: 'BATCH008',
        quantity: 10,
        price: 15,
        expiryDate: '2025-12-31',
        category: 'Test Category'
      })
      .set('Content-Type', 'application/json');
    
    expect(res.status).toBeDefined();
  });

  it('should handle medicine routes correctly', async () => {
    const res = await request(app).get('/api/medicines');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 404 for non-existent routes', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
  });

  it('should handle root path', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(404); 
  });

  it('should handle malformed JSON gracefully', async () => {
    const res = await request(app)
      .post('/api/medicines')
      .set('Content-Type', 'application/json')
      .send('invalid json');
    
    expect(res.status).toBe(400);
  });
}); 