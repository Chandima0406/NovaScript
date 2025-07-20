const express = require('express');
const router = express.Router();
const { 
  createSurvey, 
  getAllSurveys, 
  getUserSurveys, 
  getSurveyById, 
  updateSurvey, 
  deleteSurvey, 
  submitSurveyResponse,
  getSurveyResponses, 
  getSurveyAnalytics, 
  getUserAnsweredSurveys 
} = require('../controllers/surveyController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getAllSurveys);

// Protected routes
router.post('/', authMiddleware, createSurvey);
router.get('/user', authMiddleware, getUserSurveys);
router.get('/user/answered', authMiddleware, getUserAnsweredSurveys);
router.get('/:id', authMiddleware, getSurveyById);
router.put('/:id', authMiddleware, updateSurvey);
router.delete('/:id', authMiddleware, deleteSurvey);
router.post('/:id/respond', authMiddleware, submitSurveyResponse);
router.get('/:id/responses', authMiddleware, getSurveyResponses);
router.get('/:id/analytics', authMiddleware, getSurveyAnalytics);

module.exports = router;
