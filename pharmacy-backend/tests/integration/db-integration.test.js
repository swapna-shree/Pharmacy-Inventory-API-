import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB from '../../config/db.js';
import Medicine from '../../models/Medicine.js';

describe('Database Integration Tests (mongodb-memory-server)', () => {
  let mongoServer;
  let originalEnv;

  beforeAll(async () => {
    originalEnv = process.env.MONGO_URI;
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGO_URI = mongoUri;
  });

  afterAll(async () => {
    process.env.MONGO_URI = originalEnv;
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
  });

  describe('Real Database Connection', () => {
    it('should connect to in-memory MongoDB successfully', async () => {
      await connectDB();
      expect(mongoose.connection.readyState).toBe(1);
      expect(mongoose.connection.host).toBe('127.0.0.1');
    });

    it('should handle real database operations', async () => {
      await connectDB();
      const medicineData = {
        name: 'Test Medicine',
        brand: 'Test Brand',
        batchNumber: 'BATCH001',
        quantity: 100,
        price: 25.50,
        expiryDate: '2025-12-31',
        category: 'Test Category'
      };
      const medicine = new Medicine(medicineData);
      const savedMedicine = await medicine.save();
      expect(savedMedicine._id).toBeDefined();
      expect(savedMedicine.name).toBe(medicineData.name);
      expect(savedMedicine.price).toBe(medicineData.price);
    });

    it('should perform real queries and updates', async () => {
      await connectDB();
      const medicine1 = await Medicine.create({
        name: 'Medicine A',
        brand: 'Brand A',
        batchNumber: 'BATCH001',
        quantity: 50,
        price: 20,
        expiryDate: '2025-12-31',
        category: 'Category A'
      });

      const medicine2 = await Medicine.create({
        name: 'Medicine B',
        brand: 'Brand B',
        batchNumber: 'BATCH002',
        quantity: 30,
        price: 15,
        expiryDate: '2025-12-31',
        category: 'Category B'
      });

      const allMedicines = await Medicine.find();
      const medicineA = await Medicine.findOne({ name: 'Medicine A' });
      const expensiveMedicines = await Medicine.find({ price: { $gte: 20 } });

      await Medicine.updateOne(
        { _id: medicine1._id },
        { $inc: { quantity: 10 } }
      );

      const updatedMedicine = await Medicine.findById(medicine1._id);

      expect(allMedicines).toHaveLength(2);
      expect(medicineA.name).toBe('Medicine A');
      expect(expensiveMedicines).toHaveLength(1);
      expect(updatedMedicine.quantity).toBe(60);
    });

    it('should handle database errors gracefully', async () => {
      await connectDB();
      const invalidMedicine = new Medicine({
        name: 'Test'
      });
      await expect(invalidMedicine.save()).rejects.toThrow();
      const medicines = await Medicine.find();
      expect(medicines).toHaveLength(0);
    });

    it('should handle concurrent operations', async () => {
      await connectDB();
      const baseMedicine = {
        name: 'Concurrent Medicine',
        brand: 'Brand',
        batchNumber: 'BATCH001',
        quantity: 100,
        price: 20,
        expiryDate: '2025-12-31',
        category: 'Category'
      };

      const medicine = await Medicine.create(baseMedicine);

      const promises = [
        Medicine.updateOne(
          { _id: medicine._id },
          { $inc: { quantity: 10 } }
        ),
        Medicine.updateOne(
          { _id: medicine._id },
          { $inc: { quantity: 20 } }
        ),
        Medicine.updateOne(
          { _id: medicine._id },
          { $inc: { quantity: 30 } }
        )
      ];

      await Promise.all(promises);

      const updatedMedicine = await Medicine.findById(medicine._id);
      expect(updatedMedicine.quantity).toBe(160);
    });

    it('should handle complex queries with aggregation', async () => {
      await connectDB();

      await Medicine.create([
        {
          name: 'Medicine X',
          brand: 'Brand X',
          batchNumber: 'BATCH001',
          quantity: 100,
          price: 25,
          expiryDate: '2025-12-31',
          category: 'Category A'
        },
        {
          name: 'Medicine Y',
          brand: 'Brand Y',
          batchNumber: 'BATCH002',
          quantity: 50,
          price: 30,
          expiryDate: '2025-12-31',
          category: 'Category A'
        },
        {
          name: 'Medicine Z',
          brand: 'Brand Z',
          batchNumber: 'BATCH003',
          quantity: 75,
          price: 15,
          expiryDate: '2025-12-31',
          category: 'Category B'
        }
      ]);

      const categoryACount = await Medicine.countDocuments({ category: 'Category A' });
      const averagePrice = await Medicine.aggregate([
        { $group: { _id: null, avgPrice: { $avg: '$price' } } }
      ]);
      const medicinesByCategory = await Medicine.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 }, totalQuantity: { $sum: '$quantity' } } }
      ]);

      expect(categoryACount).toBe(2);
      expect(averagePrice[0].avgPrice).toBeCloseTo(23.33, 2);
      expect(medicinesByCategory).toHaveLength(2);
      expect(medicinesByCategory.find(c => c._id === 'Category A').count).toBe(2);
      expect(medicinesByCategory.find(c => c._id === 'Category B').count).toBe(1);
    });
  });
});
