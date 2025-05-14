const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const dotenv = require('dotenv');
const { GridFSBucket } = require('mongodb');
const multer = require('multer');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

// Initialize GridFS
let gfs;
mongoose.connection.once('open', () => {
  gfs = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
});

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// User Schema
const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['researcher', 'user'], required: true },
});
const User = mongoose.model('User', userSchema);

// Project Schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: {
    name: { type: String, required: true },
    role: { type: String, required: true },
  },
  pdfId: { type: mongoose.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Project = mongoose.model('Project', projectSchema);

// Middleware to verify JWT
const auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// API Routes
// Register user
app.post('/api/register', async (req, res) => {
  const { full_name, email, phone, password, confirm_password, role } = req.body;
  try {
    if (password !== confirm_password) return res.status(400).json({ message: 'Passwords do not match' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ full_name, email, phone, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Wrong email or password' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Publish project
app.post('/api/projects', auth, upload.single('pdf'), async (req, res) => {
  const { title, description, role } = req.body;
  try {
    if (!gfs) throw new Error('GridFS not initialized');
    if (!req.file) return res.status(400).json({ message: 'PDF file required' });
    const user = await User.findById(req.user.id);
    // Upload PDF to GridFS
    const uploadStream = gfs.openUploadStream(req.file.originalname);
    uploadStream.write(req.file.buffer);
    uploadStream.end();
    const pdfId = await new Promise((resolve, reject) => {
      uploadStream.on('finish', () => resolve(uploadStream.id));
      uploadStream.on('error', reject);
    });
    // Create project
    const project = new Project({
      title,
      description,
      author: { name: user.full_name, role },
      pdfId,
    });
    await project.save();
    res.status(201).json({ message: 'Project published', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Download PDF
app.get('/api/projects/pdf/:id', async (req, res) => {
  try {
    if (!gfs) throw new Error('GridFS not initialized');
    const downloadStream = gfs.openDownloadStream(new mongoose.Types.ObjectId(req.params.id));
    res.set('Content-Type', 'application/pdf');
    downloadStream.pipe(res);
  } catch (err) {
    res.status(404).json({ message: 'PDF not found' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));