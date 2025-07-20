const Survey = require('../models/surveyModel');
const SurveyResponse = require('../models/surveyResponseModel');
const notificationService = require('../services/notificationService');

// @desc    Create new survey
// @route   POST /api/surveys
// @access  Private
const createSurvey = async (req, res) => {
  const { title, description, creator, questions } = req.body;
  
  try {
    // Validate the questions and options
    for (const [index, question] of questions.entries()) {
      if (['multiple-choice', 'checkbox'].includes(question.type)) {
        const validOptions = question.options.filter(opt => opt.trim() !== '');
        
        if (validOptions.length < 2) {
          return res.status(400).json({ 
            message: `Question ${index + 1} must have at least 2 non-empty options` 
          });
        }
        
        question.options = validOptions;
      } else {
        question.options = [];
      }
    }
    
    const survey = new Survey({
      title,
      description,
      creator: { 
        name: req.user.full_name, 
        role: creator.role || req.user.role 
      },
      userId: req.user._id,
      questions,
    });
    
    await survey.save();
    res.status(201).json({ message: 'Survey created', survey });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get all surveys
// @route   GET /api/surveys
// @access  Public
const getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get user's surveys
// @route   GET /api/surveys/user
// @access  Private
const getUserSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find({ userId: req.user._id });
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get survey by ID
// @route   GET /api/surveys/:id
// @access  Private
const getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    res.json(survey);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update survey
// @route   PUT /api/surveys/:id
// @access  Private
const updateSurvey = async (req, res) => {
  const { title, description, creator, questions } = req.body;
  
  try {
    const survey = await Survey.findById(req.params.id);
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    if (survey.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this survey' });
    }
    
    if (questions) {
      for (const [index, question] of questions.entries()) {
        if (['multiple-choice', 'checkbox'].includes(question.type)) {
          const validOptions = question.options.filter(opt => opt.trim() !== '');
          
          if (validOptions.length < 2) {
            return res.status(400).json({ 
              message: `Question ${index + 1} must have at least 2 non-empty options` 
            });
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
    survey.creator.role = creator?.role || survey.creator.role;
    
    await survey.save();
    res.json(survey);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete survey
// @route   DELETE /api/surveys/:id
// @access  Private
const deleteSurvey = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    if (survey.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this survey' });
    }
    
    await SurveyResponse.deleteMany({ surveyId: req.params.id });
    await Survey.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Survey deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Submit survey response
// @route   POST /api/surveys/:id/respond
// @access  Private
const submitSurveyResponse = async (req, res) => {
  const { responses } = req.body;
  
  try {
    const survey = await Survey.findById(req.params.id);
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    // Check if user has already responded to this survey
    const existingResponse = await SurveyResponse.findOne({
      surveyId: req.params.id,
      userId: req.user._id,
    });
    
    if (existingResponse) {
      return res.status(400).json({ message: 'You have already responded to this survey' });
    }
    
    // Validate responses
    for (const [index, response] of Object.entries(responses)) {
      const question = survey.questions[Number(index)];
      
      if (!question) {
        return res.status(400).json({ message: `Invalid question index: ${index}` });
      }
      
      if (question.type === 'multiple-choice' && !question.options.includes(response)) {
        return res.status(400).json({ message: `Invalid option for question ${index}` });
      }
      
      if (question.type === 'checkbox') {
        if (!Array.isArray(response) || !response.every(opt => question.options.includes(opt))) {
          return res.status(400).json({ 
            message: `Invalid options for checkbox question ${index}` 
          });
        }
      }
    }
    
    const surveyResponse = new SurveyResponse({
      surveyId: req.params.id,
      userId: req.user._id,
      responses,
    });
    
    await surveyResponse.save();
    
    // Create notification for survey creator
    const notificationService = require('../services/notificationService');
    await notificationService.createSurveyResponseNotification(
      req.params.id,
      survey,
      req.user.full_name || 'A user'
    );
    
    res.status(201).json({ message: 'Response submitted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get survey responses
// @route   GET /api/surveys/:id/responses
// @access  Private
const getSurveyResponses = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    if (survey.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these responses' });
    }
    
    const responses = await SurveyResponse.find({ surveyId: req.params.id });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get survey analytics
// @route   GET /api/surveys/:id/analytics
// @access  Private
const getSurveyAnalytics = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    if (survey.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these analytics' });
    }
    
    const responses = await SurveyResponse.find({ surveyId: req.params.id });
    
    const analytics = survey.questions.map((question, index) => {
      if (question.type === 'text') {
        return {
          responses: responses.map(r => r.responses.get(index.toString())).filter(Boolean),
        };
      } else {
        const distribution = {};
        question.options.forEach(option => {
          distribution[option] = 0;
        });
        
        responses.forEach(response => {
          const answer = response.responses.get(index.toString());
          
          if (Array.isArray(answer)) {
            answer.forEach(option => {
              distribution[option] = (distribution[option] || 0) + 1;
            });
          } else if (answer) {
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
};

// @desc    Get user's answered surveys
// @route   GET /api/surveys/user/answered
// @access  Private
const getUserAnsweredSurveys = async (req, res) => {
  try {
    const responses = await SurveyResponse.find({ userId: req.user._id });
    const answeredSurveyIds = responses.map(response => response.surveyId);
    const answeredSurveys = await Survey.find({ _id: { $in: answeredSurveyIds } });
    
    res.json(answeredSurveys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
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
};
