import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import medicineRoutes from './routes/medicineRoutes.js';


const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors()); 
app.use(express.json());

// Routes
app.use('/api/medicines', medicineRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

