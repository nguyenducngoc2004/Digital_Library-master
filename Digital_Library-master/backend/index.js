import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';


import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import borrowRoutes from './routes/borrowRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

import statsRoutes from './routes/statsRoutes.js';




dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());


// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.log('❌ MongoDB Connection Error:', err));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/ai', aiRoutes);

app.use('/api/stats', statsRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/stats", statsRoutes);


// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));