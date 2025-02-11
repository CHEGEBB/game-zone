import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import gameRoutes from './routes/game.routes.js';
import blogRoutes from './routes/blog.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import communityRoutes from './routes/community.routes.js';
import cartRoutes from './routes/cart.routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});