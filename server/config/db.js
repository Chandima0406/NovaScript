const mongoose = require('mongoose');
let mongod;

// Try to import the MongoMemoryServer if available
let MongoMemoryServer;
try {
  MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
} catch (err) {
  // mongodb-memory-server not available, will fall back to error handling
}

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    let usingInMemory = false;
      // First try connecting to the provided MongoDB URI
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000, // Lower timeout for faster feedback
      });
      console.log('Connected to MongoDB Atlas successfully!');
    } catch (initialError) {
      
      // Try using in-memory MongoDB server
      if (MongoMemoryServer) {
        try {
          mongod = await MongoMemoryServer.create();
          mongoUri = mongod.getUri();
          usingInMemory = true;
          
          await mongoose.connect(mongoUri);
        } catch (memoryError) {
          console.error('Failed to start in-memory MongoDB:', memoryError.message);
          throw new Error('Could not connect to any MongoDB instance');
        }
      } else {
        throw new Error('Could not connect to any MongoDB instance and in-memory DB not available');
      }
    }
      // Only try to drop index if we have a successful connection to a real MongoDB
    if (!usingInMemory) {
      try {
        await mongoose.connection.db.collection('surveys').dropIndex('userId_1');
      } catch (err) {
        // Index doesn't exist or already dropped
      }
    }
    
    return mongoose.connection;  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('=== IMPORTANT ===');
    console.log('1. Check your internet connection');
    console.log('2. Verify MONGO_URI in your .env file');
    console.log('3. You may need to whitelist your IP in MongoDB Atlas');
    console.log('4. For local development, consider installing MongoDB Community Edition');
    
    throw error; // Re-throw the error instead of using mock DB
  }
};

// Cleanup function for the in-memory MongoDB server
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('Error during database disconnect:', err);
  }
};

// Handle cleanup on app shutdown
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

module.exports = connectDB;
