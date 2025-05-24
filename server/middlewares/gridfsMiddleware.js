const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');

// Initialize GridFS middleware
const initGridFS = (req, res, next) => {
  if (mongoose.connection.readyState === 1) { // Connection is ready
    req.gfs = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
  }
  next();
};

module.exports = { initGridFS };
