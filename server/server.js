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
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  pdfId: { type: mongoose.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Project = mongoose.model('Project', projectSchema);

// Survey Schema
const surveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creator: {
    name: { type: String, required: true },
    role: { type: String, required: true },
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{
    text: { type: String, required: true },
    type: { type: String, enum: ['text', 'multiple-choice', 'checkbox'], required: true },
    options: [{ type: String }],
  }],
  createdAt: { type: Date, default: Date.now },
});
const Survey = mongoose.model('Survey', surveySchema);

// Survey Response Schema
const surveyResponseSchema = new mongoose.Schema({
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  responses: { type: Map, of: mongoose.Mixed, required: true },
  submittedAt: { type: Date, default: Date.now },
});
surveyResponseSchema.index({ surveyId: 1, userId: 1 }, { unique: true });
const SurveyResponse = mongoose.model('SurveyResponse', surveyResponseSchema);

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

// Create survey
app.post('/api/surveys', auth, async (req, res) => {
  const { title, description, role, questions } = req.body;
  try {
    const user = await User.findById(req.user.id);
    
    // Validate questions
    for (const [index, question] of questions.entries()) {
      if (['multiple-choice', 'checkbox'].includes(question.type)) {
        const validOptions = question.options.filter(opt => opt.trim() !== '');
        if (validOptions.length < 2) {
          return res.status(400).json({ message: `Question ${index + 1} must have at least 2 non-empty options` });
        }
        question.options = validOptions;
      } else {
        question.options = [];
      }
    }
    
    const survey = new Survey({
      title,
      description,
      creator: { name: user.full_name, role: role || user.role },
      userId: user._id,
      questions,
    });
    await survey.save();
    res.status(201).json({ message: 'Survey created', survey });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get user's answered surveys
app.get('/api/surveys/user/answered', auth, async (req, res) => {
  try {
    const responses = await SurveyResponse.find({ userId: req.user.id });
    const answeredSurveyIds = responses.map(response => response.surveyId);
    const answeredSurveys = await Survey.find({ _id: { $in: answeredSurveyIds } });
    res.json(answeredSurveys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's surveys
app.get('/api/surveys/user', auth, async (req, res) => {
  try {
    const surveys = await Survey.find({ userId: req.user.id });
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all surveys (public)
app.get('/api/surveys', async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get survey by ID
app.get('/api/surveys/:id', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ message: 'Survey not found' });
    res.json(survey);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit survey response
app.post('/api/surveys/:id/respond', auth, async (req, res) => {
  const { responses } = req.body;
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ message: 'Survey not found' });

    // Check if user has already responded
    const existingResponse = await SurveyResponse.findOne({
      surveyId: req.params.id,
      userId: req.user.id
    });
    if (existingResponse) {
      return res.status(400).json({ message: 'You have already responded to this survey' });
    }

    // Validate responses
    for (const [index, response] of Object.entries(responses)) {
      const question = survey.questions[Number(index)];
      if (!question) return res.status(400).json({ message: `Invalid question index: ${index}` });
      
      if (question.type === 'multiple-choice' && !question.options.includes(response)) {
        return res.status(400).json({ message: `Invalid option for question ${index}` });
      }
      
      if (question.type === 'checkbox') {
        if (!Array.isArray(response) || !response.every(opt => question.options.includes(opt))) {
          return res.status(400).json({ message: `Invalid options for checkbox question ${index}` });
        }
      }
    }

    const surveyResponse = new SurveyResponse({
      surveyId: req.params.id,
      userId: req.user.id,
      responses,
    });
    await surveyResponse.save();
    res.status(201).json({ message: 'Response submitted' });
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
      author: { 
        name: user.full_name, 
        role: role || user.role,
        userId: user._id
      },
      pdfId,
    });
    await project.save();
    res.status(201).json({ message: 'Project published', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all projects (public)
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's research papers
app.get('/api/projects/user', auth, async (req, res) => {
  try {
    const projects = await Project.find({ 'author.userId': req.user.id });
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

// Update research paper
app.put('/api/projects/:id', auth, upload.single('pdf'), async (req, res) => {
  const { title, description, role } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    const user = await User.findById(req.user.id);
    if (project.author.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    // Update PDF if new file uploaded
    if (req.file) {
      if (!gfs) throw new Error('GridFS not initialized');
      // Delete old PDF
      await gfs.delete(project.pdfId);
      // Upload new PDF
      const uploadStream = gfs.openUploadStream(req.file.originalname);
      uploadStream.write(req.file.buffer);
      uploadStream.end();
      project.pdfId = await new Promise((resolve, reject) => {
        uploadStream.on('finish', () => resolve(uploadStream.id));
        uploadStream.on('error', reject);
      });
    }

    // Update project details
    project.title = title || project.title;
    project.description = description || project.description;
    project.author.role = role || project.author.role;
    await project.save();
    
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete research paper
app.delete('/api/projects/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    const user = await User.findById(req.user.id);
    if (project.author.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    // Delete PDF from GridFS
    if (gfs) {
      await gfs.delete(project.pdfId);
    }

    await Project.deleteOne({ _id: req.params.id });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update survey
app.put('/api/surveys/:id', auth, async (req, res) => {
  const { title, description, role, questions } = req.body;
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ message: 'Survey not found' });
    
    const user = await User.findById(req.user.id);
    if (survey.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this survey' });
    }

    // Validate questions if provided
    if (questions) {
      for (const [index, question] of questions.entries()) {
        if (['multiple-choice', 'checkbox'].includes(question.type)) {
          const validOptions = question.options.filter(opt => opt.trim() !== '');
          if (validOptions.length < 2) {
            return res.status(400).json({ message: `Question ${index + 1} must have at least 2 non-empty options` });
          }
          question.options = validOptions;
        } else {
          question.options = [];
        }
      }
      survey.questions = questions;
    }

    survey.title = title || survey.title;
    survey.description = description || survey.description;
    survey.creator.role = role || survey.creator.role;
    await survey.save();
    
    res.json(survey);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete survey
app.delete('/api/surveys/:id', auth, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ message: 'Survey not found' });
    
    const user = await User.findById(req.user.id);
    if (survey.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this survey' });
    }

    // Delete all responses for this survey
    await SurveyResponse.deleteMany({ surveyId: req.params.id });
    await Survey.deleteOne({ _id: req.params.id });
    res.json({ message: 'Survey deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get survey responses
app.get('/api/surveys/:id/responses', auth, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ message: 'Survey not found' });
    
    const user = await User.findById(req.user.id);
    if (survey.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these responses' });
    }

    const responses = await SurveyResponse.find({ surveyId: req.params.id });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get survey analytics
app.get('/api/surveys/:id/analytics', auth, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ message: 'Survey not found' });
    
    const user = await User.findById(req.user.id);
    if (survey.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these analytics' });
    }

    const responses = await SurveyResponse.find({ surveyId: req.params.id });
    
    // Calculate analytics for each question
    const analytics = survey.questions.map((question, index) => {
      if (question.type === 'text') {
        return {
          responses: responses.map(r => r.responses.get(index.toString())).filter(Boolean)
        };
      } else {
        // For multiple-choice and checkbox questions
        const distribution = {};
        question.options.forEach(option => {
          distribution[option] = 0;
        });
        
        responses.forEach(response => {
          const answer = response.responses.get(index.toString());
          if (Array.isArray(answer)) { // checkbox
            answer.forEach(option => {
              distribution[option] = (distribution[option] || 0) + 1;
            });
          } else if (answer) { // multiple-choice
            distribution[answer] = (distribution[answer] || 0) + 1;
          }
        });
        
        return { distribution };
      }
    });

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single project by ID
app.get('/api/projects/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));