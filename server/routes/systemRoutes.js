const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Health check endpoint
router.get('/health', (req, res) => {
  const dbStatus = global.usingMockDatabase ? 'mock' : 'connected';
  
  res.status(200).json({
    status: 'ok',
    timestamp: new Date(),
    database: dbStatus,
    version: '1.0.0'
  });
});

// Database status endpoint
router.get('/db-status', (req, res) => {
  if (global.usingMockDatabase) {
    res.status(200).json({
      status: 'mock',
      message: 'Using in-memory mock database',
      collections: Object.keys(global.mockDB?.collections || {})
    });
  } else {
    const mongoose = require('mongoose');
    res.status(200).json({
      status: 'connected',
      message: 'Connected to MongoDB',
      database: mongoose.connection.name
    });
  }
});

module.exports = router;
