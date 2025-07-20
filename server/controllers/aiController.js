const dotenv = require('dotenv');
const AIService = require('../services/aiService');

dotenv.config();

// Initialize AI service
const aiService = new AIService();

// Process AI chat messages
const processAIChat = async (req, res) => {  try {
    const { message, history = [], conversationHistory = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    // Check if AI service is available
    const serviceStatus = aiService.getAvailableServices();
    if (!serviceStatus.configured) {
      return res.status(503).json({ 
        message: 'AI service is not configured. Please contact administrator.',
        availableServices: serviceStatus.available
      });
    }

    // Use history if provided, otherwise use conversationHistory
    const chatHistory = history.length > 0 ? history : conversationHistory;
    
    // Convert frontend message format to AI service format
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    // Prepare conversation messages
    const messages = [
      { role: 'system', content: 'You are a helpful AI assistant for research management. Provide clear, accurate, and helpful responses.' },
      ...formattedHistory,
      { role: 'user', content: message }
    ];

    const aiResponse = await aiService.chatCompletion(messages);
    
    res.status(200).json({ 
      message: aiResponse,
      provider: aiService.provider,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ 
      message: 'An error occurred while processing your message.',
      error: error.message 
    });
  }
};
// Generate a research proposal based on user input
const generateProposal = async (req, res) => {
  try {
    const { title, objectives, methodology, timeline, budget } = req.body;
    
    const prompt = `Generate a comprehensive research proposal with the following details:
      Title: ${title}
      Research Objectives: ${objectives}
      Methodology: ${methodology}
      Timeline: ${timeline}
      Budget: ${budget}
      
      Format the proposal with the following sections:
      1. Executive Summary
      2. Introduction
      3. Research Objectives
      4. Literature Review
      5. Methodology
      6. Timeline and Milestones
      7. Budget Breakdown
      8. Expected Outcomes
      9. Conclusion
      
      Make the proposal well-structured, professional, and ready for submission.`;
    
    const systemMessage = 'You are an expert in creating research proposals. Generate comprehensive, professional research proposals.';
    
    // Check if AI service is available
    const serviceStatus = aiService.getAvailableServices();
    if (!serviceStatus.configured) {
      return res.status(503).json({ 
        message: 'AI service is not configured. Please contact administrator.',
        availableServices: serviceStatus.available
      });
    }

    const proposal = await aiService.generateContent(prompt, systemMessage);
    
    res.status(200).json({ 
      proposal,
      provider: aiService.provider,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Proposal generation error:', error);
    res.status(500).json({ 
      message: 'An error occurred while generating the proposal.',
      error: error.message 
    });
  }
};

// Review a research proposal or paper
const reviewResearchPaper = async (req, res) => {
  try {
    const { content, focusAreas } = req.body;
    
    const prompt = `Review the following research content critically and provide feedback:
    
    ${content.substring(0, 4000)} ${content.length > 4000 ? '... (truncated for length)' : ''}
    
    Focus your review on these aspects: ${focusAreas || 'methodology, clarity, structure, and scientific rigor'}
    
    Provide your feedback in this format:
    1. Overall Assessment
    2. Strengths
    3. Areas for Improvement
    4. Specific Recommendations
    5. Conclusion`;
    
    const systemMessage = 'You are an expert reviewer for academic and research papers. Provide constructive, detailed feedback.';
    
    // Check if AI service is available
    const serviceStatus = aiService.getAvailableServices();
    if (!serviceStatus.configured) {
      return res.status(503).json({ 
        message: 'AI service is not configured. Please contact administrator.',
        availableServices: serviceStatus.available
      });
    }

    const review = await aiService.generateContent(prompt, systemMessage);
    
    res.status(200).json({ 
      review,
      provider: aiService.provider,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Paper review error:', error);
    res.status(500).json({ 
      message: 'An error occurred while reviewing the paper.',
      error: error.message    });
  }
};

// Get AI service status and configuration
const getAIStatus = async (req, res) => {
  try {
    const serviceStatus = aiService.getAvailableServices();
    res.status(200).json({
      ...serviceStatus,
      supportedProviders: ['openai', 'gemini']
    });
  } catch (error) {
    console.error('AI status error:', error);
    res.status(500).json({ 
      message: 'An error occurred while checking AI service status.',
      error: error.message 
    });
  }
};

// Switch AI provider
const switchAIProvider = async (req, res) => {
  try {
    const { provider } = req.body;
    
    if (!provider) {
      return res.status(400).json({ message: 'Provider is required.' });
    }

    const newProvider = aiService.setProvider(provider);
    
    res.status(200).json({ 
      message: `AI provider switched to ${newProvider}`,
      provider: newProvider,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Provider switch error:', error);
    res.status(400).json({ 
      message: error.message 
    });
  }
};

module.exports = { 
  processAIChat, 
  generateProposal, 
  reviewResearchPaper, 
  getAIStatus, 
  switchAIProvider 
};
