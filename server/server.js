const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

// Import routes
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const researchProjectRoutes = require('./routes/researchProjectRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const aiRoutes = require('./routes/aiRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const systemRoutes = require('./routes/systemRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

// Import middlewares
const { initGridFS } = require('./middlewares/gridfsMiddleware');

// Import DB connection
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: __dirname + '/.env' });

// Initialize Express app
const app = express();

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*'
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(initGridFS);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../build')));

  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
    }
  });
}

// Connect to MongoDB
(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error("Failed to connect to database:", err);
    // Server will continue to run with mock DB or limited functionality
  }
  
  // Only start the server after attempting to connect to the database
  const PORT = process.env.PORT || 5000;
  
  // Check if we have SSL certificates for HTTPS
  const sslPath = path.join(__dirname, '../ssl');
  if (fs.existsSync(sslPath) && 
      fs.existsSync(path.join(sslPath, 'privkey.pem')) && 
      fs.existsSync(path.join(sslPath, 'fullchain.pem'))) {
    
    // Create HTTPS server
    const privateKey = fs.readFileSync(path.join(sslPath, 'privkey.pem'), 'utf8');
    const certificate = fs.readFileSync(path.join(sslPath, 'fullchain.pem'), 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(PORT, () => {
      console.log(`HTTPS Server running on port ${PORT}`);
    });
  } else {
    // Fall back to HTTP if no certificates
    app.listen(PORT, () => {
      console.log(`HTTP Server running on port ${PORT}`);
      if (process.env.NODE_ENV === 'production') {
        console.log('Warning: Running in production without HTTPS');
      }
    });
  }
})();

// API Routes
app.use('/api', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/research-projects', researchProjectRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/budgets', budgetRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Server Error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// 404 Middleware
app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// The server is now started in the async function after DB connection
