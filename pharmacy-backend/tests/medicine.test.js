import express from 'express';
import medicineRoutes from '../routes/medicineRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/medicines', medicineRoutes);

describe('GET /api/medicines', () => {
  it('should respond with 200', async () => {
    const res = await request(app).get('/api/medicines');
    expect(res.statusCode).toBe(200);
  });
});
