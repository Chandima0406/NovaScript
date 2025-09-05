const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  createResearchProject,
  getUserResearchProjects,
  getResearchProjectById,
  updateResearchProject,
  deleteResearchProject,
  getResearchProjectStats,
  updateResearchProjectTimeline
} = require('../controllers/researchProjectController');

// All routes require authentication
router.use(authMiddleware);

// Create a new research project
router.post('/', createResearchProject);

// Get all research projects for the authenticated user
router.get('/user', getUserResearchProjects);

// Get research project statistics
router.get('/stats', getResearchProjectStats);

// Get a specific research project by ID
router.get('/:projectId', getResearchProjectById);

// Update a research project
router.put('/:projectId', updateResearchProject);

// Delete a research project
router.delete('/:projectId', deleteResearchProject);

// Update research project timeline
router.put('/:projectId/timeline', updateResearchProjectTimeline);

module.exports = router;
