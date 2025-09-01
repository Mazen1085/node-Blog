const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const userRoutes = require('./routes/users');       
const postRoutes = require('./routes/posts');       
const authRoutes = require('./routes/auth');       
 
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100 // حد 100 طلب لكل IP
});
app.use(limiter);

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/auth', authRoutes);

// Error handler middleware (يجب أن يكون بعد جميع الـ routes)
app.use(errorHandler);

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});