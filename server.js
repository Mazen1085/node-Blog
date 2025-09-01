const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/users');       
const postRoutes = require('./routes/posts');       
const authRoutes = require('./routes/auth');       
 
const errorHandler = require('./middleware/errorHandler');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  
  max: 100  
});
app.use(limiter);

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    if (process.env.NODE_ENV !== 'production') {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;