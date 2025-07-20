const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
  createProject, 
  getAllProjects, 
  getUserProjects, 
  getProjectById, 
  updateProject, 
  deleteProject,
  downloadPdf 
} = require('../controllers/projectController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public routes
router.get('/', getAllProjects);
router.get('/pdf/:id', downloadPdf);

// Protected routes
router.post('/', authMiddleware, upload.single('pdf'), createProject);
router.get('/user', authMiddleware, getUserProjects);
router.get('/:id', authMiddleware, getProjectById);
router.put('/:id', authMiddleware, upload.single('pdf'), updateProject);
router.delete('/:id', authMiddleware, deleteProject);

module.exports = router;
