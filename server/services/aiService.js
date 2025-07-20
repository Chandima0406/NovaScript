const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

class AIService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    this.provider = process.env.AI_PROVIDER || 'gemini'; // Default to Gemini
    
    if (this.geminiApiKey) {
      this.genAI = new GoogleGenerativeAI(this.geminiApiKey);
      this.geminiModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
  }

  async generateContent(prompt, systemMessage = null) {
    try {
      switch (this.provider) {
        case 'gemini':
          return await this.generateWithGemini(prompt, systemMessage);
        case 'openai':
          return await this.generateWithOpenAI(prompt, systemMessage);
        default:
          throw new Error(`Unsupported AI provider: ${this.provider}`);
      }
    } catch (error) {
      console.error(`AI generation error with ${this.provider}:`, error);
      throw error;
    }
  }

  async generateWithGemini(prompt, systemMessage = null) {
    if (!this.geminiApiKey) {
      throw new Error('Gemini API key is not configured');
    }

    try {
      // Combine system message with prompt for Gemini
      const fullPrompt = systemMessage 
        ? `${systemMessage}\n\n${prompt}`
        : prompt;

      const result = await this.geminiModel.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate content with Gemini API');
    }
  }

  async generateWithOpenAI(prompt, systemMessage = null) {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    try {
      const messages = [];
      
      if (systemMessage) {
        messages.push({ role: 'system', content: systemMessage });
      }
      
      messages.push({ role: 'user', content: prompt });

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 4000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate content with OpenAI API');
    }
  }

  async chatCompletion(messages) {
    try {
      switch (this.provider) {
        case 'gemini':
          return await this.chatWithGemini(messages);
        case 'openai':
          return await this.chatWithOpenAI(messages);
        default:
          throw new Error(`Unsupported AI provider: ${this.provider}`);
      }
    } catch (error) {
      console.error(`AI chat error with ${this.provider}:`, error);
      throw error;
    }
  }

  async chatWithGemini(messages) {
    if (!this.geminiApiKey) {
      throw new Error('Gemini API key is not configured');
    }

    try {
      // Convert OpenAI-style messages to Gemini format
      const conversation = messages.map(msg => {
        if (msg.role === 'system') {
          return `System: ${msg.content}`;
        } else if (msg.role === 'user') {
          return `User: ${msg.content}`;
        } else if (msg.role === 'assistant') {
          return `Assistant: ${msg.content}`;
        }
        return msg.content;
      }).join('\n\n');

      const result = await this.geminiModel.generateContent(conversation);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini chat error:', error);
      throw new Error('Failed to complete chat with Gemini API');
    }
  }

  async chatWithOpenAI(messages) {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 4000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI chat error:', error);
      throw new Error('Failed to complete chat with OpenAI API');
    }
  }

  // Check which AI services are available
  getAvailableServices() {
    const services = [];
    
    if (this.geminiApiKey) {
      services.push('gemini');
    }
    
    if (this.openaiApiKey) {
      services.push('openai');
    }
    
    return {
      available: services,
      current: this.provider,
      configured: services.length > 0
    };
  }

  // Switch between providers
  setProvider(provider) {
    const available = this.getAvailableServices().available;
    
    if (!available.includes(provider)) {
      throw new Error(`Provider ${provider} is not available. Available providers: ${available.join(', ')}`);
    }
    
    this.provider = provider;
    return this.provider;
  }
}

module.exports = AIService;
