const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Removed deprecated options: useNewUrlParser and useUnifiedTopology
    // These are no longer needed in MongoDB Driver 4.0.0+
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    try {
      await mongoose.connection.db.collection('surveys').dropIndex('userId_1');
      console.log('Dropped unique index on userId');
    } catch (err) {
      console.log('No unique index to drop or already dropped');
    }
    
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
