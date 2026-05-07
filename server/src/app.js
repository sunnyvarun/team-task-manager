const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const corsConfig = require('./config/cors');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

// Import routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Initialize express app
const app = express();

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enable CORS
app.use(corsConfig);

// Development logging
if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate limiting
// Apply rate limiting (only in production, or be very permissive in dev)
if (env.NODE_ENV === 'production') {
          const limiter = rateLimit({
              windowMs: 15 * 60 * 1000,
              max: 100,
              message: { status: 'error', message: 'Too many requests' }
          });
          app.use('/api', limiter);
      } else {
          // Development - very permissive rate limiting
          const devLimiter = rateLimit({
              windowMs: 1 * 60 * 1000,
              max: 1000,
              message: { status: 'error', message: 'Too many requests' }
          });
          app.use('/api', devLimiter);
      }

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Handle undefined routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app;