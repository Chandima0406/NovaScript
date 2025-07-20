const express = require('express');
const router = express.Router();
const { 
  processAIChat, 
  generateProposal, 
  reviewResearchPaper, 
  getAIStatus, 
  switchAIProvider 
} = require('../controllers/aiController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// AI chat route - protected by auth
router.post('/chat', authMiddleware, processAIChat);

// AI-powered proposal generation
router.post('/generate-proposal', authMiddleware, generateProposal);

// AI-powered research paper review
router.post('/review-paper', authMiddleware, reviewResearchPaper);

// Get AI service status
router.get('/status', authMiddleware, getAIStatus);

// Switch AI provider
router.post('/switch-provider', authMiddleware, switchAIProvider);

module.exports = router;
