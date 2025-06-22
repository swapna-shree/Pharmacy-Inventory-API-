import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import connectDB from '../../config/db.js';

vi.mock('mongoose', () => ({
  default: {
    connect: vi.fn()
  }
}));

describe('connectDB', () => {
  let mockConsoleLog, mockConsoleError;

  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    delete process.env.MONGO_URI;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Success Scenarios', () => {
    it('should connect successfully on first attempt', async () => {
      process.env.MONGO_URI = 'mongodb://localhost:27017/test';
      mongoose.connect.mockResolvedValueOnce();

      await connectDB();

      expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/test');
      expect(mongoose.connect).toHaveBeenCalledTimes(1);
      expect(mockConsoleLog).toHaveBeenCalledWith('MongoDB Connected.');
    });

    it('should connect successfully after retries', async () => {
      process.env.MONGO_URI = 'mongodb://localhost:27017/test';
      mongoose.connect
        .mockRejectedValueOnce(new Error('Connection failed'))
        .mockRejectedValueOnce(new Error('Connection failed'))
        .mockResolvedValueOnce();

      await connectDB(3, 100);

      expect(mongoose.connect).toHaveBeenCalledTimes(3);
      expect(mockConsoleLog).toHaveBeenCalledWith('MongoDB Connected.');
      expect(mockConsoleError).toHaveBeenCalledWith('MongoDB Connection Error (Attempt 1/3):', 'Connection failed');
      expect(mockConsoleError).toHaveBeenCalledWith('MongoDB Connection Error (Attempt 2/3):', 'Connection failed');
    });
  });

  describe('Failure Scenarios', () => {
    it('should exit after max retry attempts', async () => {
      process.env.MONGO_URI = 'mongodb://localhost:27017/test';
      mongoose.connect.mockRejectedValue(new Error('Connection failed'));

      const originalExit = process.exit;
      process.exit = vi.fn().mockImplementation(() => {
        throw new Error('process.exit called');
      });

      try {
        await expect(connectDB(2, 100)).rejects.toThrow('process.exit called');
        
        expect(mongoose.connect).toHaveBeenCalledTimes(2);
        expect(mockConsoleError).toHaveBeenCalledWith('MongoDB Connection Error (Attempt 1/2):', 'Connection failed');
        expect(mockConsoleError).toHaveBeenCalledWith('MongoDB Connection Error (Attempt 2/2):', 'Connection failed');
        expect(mockConsoleError).toHaveBeenCalledWith('Max retry attempts reached. Exiting...');
        expect(process.exit).toHaveBeenCalledWith(1);
      } finally {
        process.exit = originalExit;
      }
    });

    it('should handle missing MONGO_URI environment variable', async () => {
      mongoose.connect.mockRejectedValue(new Error('Invalid connection string'));

      const originalExit = process.exit;
      process.exit = vi.fn().mockImplementation(() => {
        throw new Error('process.exit called');
      });

      try {
        await expect(connectDB(1, 100)).rejects.toThrow('process.exit called');
        
        expect(mongoose.connect).toHaveBeenCalledWith(undefined);
        expect(mockConsoleError).toHaveBeenCalledWith('MongoDB Connection Error (Attempt 1/1):', 'Invalid connection string');
        expect(process.exit).toHaveBeenCalledWith(1);
      } finally {
        process.exit = originalExit;
      }
    });

    it('should handle network timeout errors', async () => {
      process.env.MONGO_URI = 'mongodb://localhost:27017/test';
      mongoose.connect.mockRejectedValue(new Error('Network timeout'));

      const originalExit = process.exit;
      process.exit = vi.fn().mockImplementation(() => {
        throw new Error('process.exit called');
      });

      try {
        await expect(connectDB(1, 100)).rejects.toThrow('process.exit called');
        
        expect(mockConsoleError).toHaveBeenCalledWith('MongoDB Connection Error (Attempt 1/1):', 'Network timeout');
        expect(process.exit).toHaveBeenCalledWith(1);
      } finally {
        process.exit = originalExit;
      }
    });
  });

  describe('Retry Logic Testing', () => {
    it('should respect custom retry attempts and delay', async () => {
      process.env.MONGO_URI = 'mongodb://localhost:27017/test';
      mongoose.connect.mockRejectedValue(new Error('Connection failed'));

      const originalExit = process.exit;
      process.exit = vi.fn().mockImplementation(() => {
        throw new Error('process.exit called');
      });

      try {
        const startTime = Date.now();

        await expect(connectDB(3, 200)).rejects.toThrow('process.exit called');
        
        const endTime = Date.now();
        const totalTime = endTime - startTime;

        expect(mongoose.connect).toHaveBeenCalledTimes(3);
        expect(totalTime).toBeGreaterThanOrEqual(400);
        expect(mockConsoleLog).toHaveBeenCalledWith('Retrying in 200ms...');
      } finally {
        process.exit = originalExit;
      }
    });

    it('should not delay after successful connection', async () => {
      process.env.MONGO_URI = 'mongodb://localhost:27017/test';
      mongoose.connect
        .mockRejectedValueOnce(new Error('Connection failed'))
        .mockResolvedValueOnce();

      const startTime = Date.now();

      await connectDB(3, 1000);

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      expect(mongoose.connect).toHaveBeenCalledTimes(2);
      expect(totalTime).toBeGreaterThanOrEqual(1000);
      expect(totalTime).toBeLessThan(2000);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero retry attempts', async () => {
      process.env.MONGO_URI = 'mongodb://localhost:27017/test';
      mongoose.connect.mockRejectedValue(new Error('Connection failed'));

      const originalExit = process.exit;
      process.exit = vi.fn().mockImplementation(() => {
        throw new Error('process.exit called');
      });

      try {
        await expect(connectDB(0, 100)).rejects.toThrow('process.exit called');
        
        expect(mongoose.connect).toHaveBeenCalledTimes(0);
        expect(mockConsoleError).toHaveBeenCalledWith('No retry attempts specified. Exiting...');
        expect(process.exit).toHaveBeenCalledWith(1);
      } finally {
        process.exit = originalExit;
      }
    });

    it('should handle very short retry delays', async () => {
      process.env.MONGO_URI = 'mongodb://localhost:27017/test';
      mongoose.connect
        .mockRejectedValueOnce(new Error('Connection failed'))
        .mockResolvedValueOnce();

      const startTime = Date.now();

      await connectDB(2, 10);

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      expect(mongoose.connect).toHaveBeenCalledTimes(2);
      expect(totalTime).toBeGreaterThanOrEqual(10);
      expect(mockConsoleLog).toHaveBeenCalledWith('Retrying in 10ms...');
    });
  });
});