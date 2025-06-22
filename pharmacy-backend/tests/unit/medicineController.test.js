import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as controller from '../../controllers/medicineController.js';
import Medicine from '../../models/Medicine.js';

vi.mock('../../models/Medicine.js');

describe('Medicine Controller - unit tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('add function', () => {
    it('should create and return medicine successfully', async () => {
      const fakeMed = { _id: '1', name: 'A', save: vi.fn() };
      Medicine.mockImplementation(() => fakeMed);

      const req = { body: { name: 'A' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      
      await controller.add(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'A' }));
    });

    it('should handle validation errors', async () => {
      const error = new Error('Validation failed');
      Medicine.mockImplementation(() => ({
        save: vi.fn().mockRejectedValue(error)
      }));

      const req = { body: { name: 'A' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      
      await controller.add(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid Data',
        details: 'Validation failed'
      });
    });
  });

  describe('getAll function', () => {
    it('should return all medicines successfully', async () => {
      const mockMedicines = [{ _id: '1', name: 'Medicine 1' }, { _id: '2', name: 'Medicine 2' }];
      Medicine.find = vi.fn().mockResolvedValue(mockMedicines);

      const req = {};
      const res = { json: vi.fn() };
      
      await controller.getAll(req, res);
      expect(res.json).toHaveBeenCalledWith(mockMedicines);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      Medicine.find = vi.fn().mockRejectedValue(error);

      const req = {};
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      
      await controller.getAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Server Error. Unable to Fetch all Medicines'
      });
    });
  });

  describe('update function', () => {
    it('should update medicine successfully', async () => {
      const mockMedicine = { _id: '1', name: 'Updated Medicine' };
      Medicine.findByIdAndUpdate = vi.fn().mockResolvedValue(mockMedicine);

      const req = { params: { id: '1' }, body: { name: 'Updated Medicine' } };
      const res = { json: vi.fn() };
      
      await controller.update(req, res);
      expect(res.json).toHaveBeenCalledWith(mockMedicine);
    });

    it('should return 404 when medicine not found for update', async () => {
      Medicine.findByIdAndUpdate = vi.fn().mockResolvedValue(null);

      const req = { params: { id: 'nonexistent' }, body: { name: 'Updated' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      
      await controller.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Medicine not Found' });
    });

    it('should handle update errors', async () => {
      const error = new Error('Update failed');
      Medicine.findByIdAndUpdate = vi.fn().mockRejectedValue(error);

      const req = { params: { id: '1' }, body: { name: 'Updated' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      
      await controller.update(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Update Failed',
        details: 'Update failed'
      });
    });
  });

  describe('remove function', () => {
    it('should delete medicine successfully', async () => {
      const mockResult = { _id: '1', name: 'Deleted Medicine' };
      Medicine.findByIdAndDelete = vi.fn().mockResolvedValue(mockResult);

      const req = { params: { id: '1' } };
      const res = { json: vi.fn() };
      
      await controller.remove(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Medicine Deleted' });
    });

    it('should return 404 when medicine not found for deletion', async () => {
      Medicine.findByIdAndDelete = vi.fn().mockResolvedValue(null);

      const req = { params: { id: 'nonexistent' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      
      await controller.remove(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Medicine not Found' });
    });

    it('should handle deletion errors', async () => {
      const error = new Error('Delete failed');
      Medicine.findByIdAndDelete = vi.fn().mockRejectedValue(error);

      const req = { params: { id: '1' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      
      await controller.remove(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Delete Failed' });
    });
  });

  describe('lowStock function', () => {
    it('should return low stock medicines successfully', async () => {
      const mockLowStock = [{ _id: '1', name: 'Low Stock Med', quantity: 5 }];
      Medicine.find = vi.fn().mockResolvedValue(mockLowStock);

      const req = {};
      const res = { json: vi.fn() };
      
      await controller.lowStock(req, res);
      expect(res.json).toHaveBeenCalledWith(mockLowStock);
    });

    it('should handle low stock query errors', async () => {
      const error = new Error('Query failed');
      Medicine.find = vi.fn().mockRejectedValue(error);

      const req = {};
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      
      await controller.lowStock(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Server Error. Unable to fetch Low Stock Medicines.'
      });
    });
  });

  describe('expired function', () => {
    it('should return expired medicines successfully', async () => {
      const mockExpired = [{ _id: '1', name: 'Expired Med', expiryDate: '2020-01-01' }];
      Medicine.find = vi.fn().mockResolvedValue(mockExpired);

      const req = {};
      const res = { json: vi.fn() };
      
      await controller.expired(req, res);
      expect(res.json).toHaveBeenCalledWith(mockExpired);
    });

    it('should handle expired medicines query errors', async () => {
      const error = new Error('Query failed');
      Medicine.find = vi.fn().mockRejectedValue(error);

      const req = {};
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      
      await controller.expired(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Server Error. Unable to fetch Expired Medicines.'
      });
    });
  });
}); 
