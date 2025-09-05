import React, { useState, useRef, useEffect } from 'react';
import { sendAIMessage, generateAIProposal, getAIReviewForPaper } from '../api';
import '../styles/AIAssistant.css';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [activeTab, setActiveTab] = useState('chat');
  
  // Proposal form state
  const [proposalForm, setProposalForm] = useState({
    title: '',
    objectives: '',
    methodology: '',
    timeline: '',
    budget: ''
  });
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    content: '',
    focusAreas: ''
  });
  
  // Generated proposal and review state
  const [generatedProposal, setGeneratedProposal] = useState('');
  const [generatedReview, setGeneratedReview] = useState('');

  // Automatically scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Add an initial welcome message when the component mounts
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      text: "Hello! I'm your NovaScript research assistant. How can I help you today?",
      sender: 'ai',
    };
    setMessages([welcomeMessage]);
  }, []);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);    try {
      const response = await sendAIMessage({
        message: currentInput,
        history: messages
      });
      
      const aiResponse = {
        id: Date.now() + 1,
        text: response.data.message,
        sender: 'ai',
      };
      
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: error.response?.data?.message || "Sorry, I couldn't process your request. Please try again later.",
        sender: 'ai',
        isError: true
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle proposal form changes
  const handleProposalChange = (e) => {
    const { name, value } = e.target;
    setProposalForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle review form changes
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Generate proposal
  const handleGenerateProposal = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedProposal('');
      try {
      const response = await generateAIProposal(proposalForm);
      setGeneratedProposal(response.data.proposal);
    } catch (error) {
      alert("Failed to generate proposal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate review
  const handleGenerateReview = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedReview('');
      try {
      const response = await getAIReviewForPaper(reviewForm);
      setGeneratedReview(response.data.review);
    } catch (error) {
      alert("Failed to generate review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Download generated content
  const handleDownload = (content, filename) => {
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Utility function to format AI responses for better display
  const formatAIResponse = (text) => {
    if (!text) return text;
    
    // Convert markdown-like formatting to HTML-like formatting
    let formatted = text
      // Bold text: **text** or __text__
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Italic text: *text* or _text_
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // Code: `text`
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Line breaks for better readability
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    
    // Wrap in paragraph tags if not already formatted
    if (!formatted.includes('<p>') && !formatted.includes('<br>')) {
      formatted = `<p>${formatted}</p>`;
    } else if (!formatted.startsWith('<p>')) {
      formatted = `<p>${formatted}</p>`;
    }
    
    return formatted;
  };

  // Component to render formatted AI messages
  const FormattedMessage = ({ text, isAI = false }) => {
    if (isAI) {
      return (
        <div 
          dangerouslySetInnerHTML={{ 
            __html: formatAIResponse(text) 
          }} 
        />
      );
    }
    return <p>{text}</p>;
  };
  // Enhanced utility function to format research proposals for beautiful display
  const formatProposal = (text) => {
    if (!text) return text;
    
    // Split the text into sections based on common proposal headings
    let formatted = text
      // Main headings (Title, Abstract, etc.)
      .replace(/^(TITLE|ABSTRACT|INTRODUCTION|OBJECTIVES?|METHODOLOGY|TIMELINE|BUDGET|CONCLUSION|REFERENCES?):\s*/gmi, '<h2>$1</h2>')
      .replace(/^(Research Title|Title):\s*/gmi, '<h1 class="proposal-title">$1</h1>')
      
      // Sub-headings (numbered sections, bullet points)
      .replace(/^(\d+\.\s+[^\n]+)/gm, '<h3>$1</h3>')
      .replace(/^([A-Z][a-z]+\s+[A-Z][a-z]+):\s*/gm, '<h3>$1:</h3>')
      
      // Bold text for emphasis
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      
      // Italic text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      
      // Code or technical terms
      .replace(/`(.*?)`/g, '<code>$1</code>')
      
      // Bullet points
      .replace(/^[\-\*]\s+(.+)/gm, '<li>$1</li>')
      
      // Numbered lists
      .replace(/^\d+\)\s+(.+)/gm, '<li>$1</li>')
      
      // Timeline items (dates, phases)
      .replace(/^(Phase \d+|Month \d+|Week \d+|Year \d+|Q\d+)[\:\-]\s*/gmi, '<div class="timeline-item"><strong>$1:</strong> ')
      
      // Budget items
      .replace(/^([\$€£¥]\d+[,\d]*|\d+[,\d]*\s*(?:USD|EUR|GBP|JPY))[\:\-]\s*/gm, '<div class="budget-item"><strong>$1:</strong> ')
      
      // Simple table detection and formatting (pipe-separated values)
      .replace(/\|(.+)\|/g, (match, content) => {
        const cells = content.split('|').map(cell => cell.trim());
        if (cells.length > 1) {
          return '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        }
        return match;
      })
      
      // Line breaks and paragraphs
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    
    // Wrap orphaned list items in ul tags
    formatted = formatted.replace(/(<li>.*?<\/li>)(?:\s*<br>\s*<li>.*?<\/li>)*/g, (match) => {
      return '<ul>' + match.replace(/<br>\s*/g, '') + '</ul>';
    });
    
    // Wrap orphaned table rows in table tags
    formatted = formatted.replace(/(<tr>.*?<\/tr>)(?:\s*<br>\s*<tr>.*?<\/tr>)*/g, (match) => {
      const rows = match.replace(/<br>\s*/g, '');
      // Check if first row looks like headers (all caps or title case)
      const firstRow = rows.match(/<tr>(.*?)<\/tr>/);
      if (firstRow) {
        const firstRowCells = firstRow[1];
        const isHeader = /<td>([A-Z\s]+)<\/td>/.test(firstRowCells) || /<td>([A-Z][a-z]+\s*)+<\/td>/.test(firstRowCells);
        if (isHeader) {
          const headerRow = firstRow[0].replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>');
          const remainingRows = rows.replace(firstRow[0], '');
          return `<table><thead>${headerRow}</thead><tbody>${remainingRows}</tbody></table>`;
        }
      }
      return `<table><tbody>${rows}</tbody></table>`;
    });
    
    // Close timeline and budget items
    formatted = formatted.replace(/(<div class="timeline-item">.*?)(<h|<div|<p|<table|$)/g, '$1</div>$2');
    formatted = formatted.replace(/(<div class="budget-item">.*?)(<h|<div|<p|<table|$)/g, '$1</div>$2');
    
    // Wrap in paragraph tags if not already formatted
    if (!formatted.includes('<p>') && !formatted.includes('<h') && !formatted.includes('<table>')) {
      formatted = `<p>${formatted}</p>`;
    } else if (!formatted.startsWith('<') && !formatted.includes('<table>')) {
      formatted = `<p>${formatted}</p>`;
    }
    
    return formatted;
  };

  // Component to render beautifully formatted proposals
  const FormattedProposal = ({ text }) => {
    return (
      <div 
        className="proposal-content"
        dangerouslySetInnerHTML={{ 
          __html: formatProposal(text) 
        }} 
      />
    );
  };

  return (
    <div className="ai-assistant-container">
      <div className="ai-assistant-header">
        <h1>Research Assistant AI</h1>
        <p>Your AI-powered research companion for writing, analysis, and feedback</p>
        
        <div className="ai-tabs">
          <button 
            className={`ai-tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Chat Assistant
          </button>
          <button 
            className={`ai-tab ${activeTab === 'proposal' ? 'active' : ''}`}
            onClick={() => setActiveTab('proposal')}
          >
            Proposal Generator
          </button>
          <button 
            className={`ai-tab ${activeTab === 'review' ? 'active' : ''}`}
            onClick={() => setActiveTab('review')}
          >
            Research Review
          </button>
        </div>
      </div>
      
      {activeTab === 'chat' && (
        <div className="chat-container">
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-chat">
                <div className="welcome-message">
                  <h2>Welcome to Research Assistant</h2>
                  <p>I can help you with:</p>
                  <ul>
                    <li>Finding relevant research papers</li>
                    <li>Summarizing academic content</li>
                    <li>Formatting citations</li>
                    <li>Explaining complex research concepts</li>
                    <li>Suggesting research methodologies</li>
                  </ul>
                  <p>Type your question below to get started!</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'} ${message.isError ? 'error-message' : ''}`}
                >
                  <div className="message-content">
                    <FormattedMessage text={message.text} isAI={message.sender === 'ai'} />
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="message ai-message">
                <div className="message-content loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form className="message-input-container" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || inputMessage.trim() === ''}>
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      )}
      
      {activeTab === 'proposal' && (
        <div className="ai-tool-container">
          <div className="ai-form-section">
            <h2>Research Proposal Generator</h2>
            <p>Fill in the details below to generate a comprehensive research proposal</p>
            
            <form onSubmit={handleGenerateProposal} className="ai-form">
              <div className="form-group">
                <label htmlFor="title">Research Title</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  value={proposalForm.title} 
                  onChange={handleProposalChange}
                  placeholder="Enter the title of your research"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="objectives">Research Objectives</label>
                <textarea 
                  id="objectives" 
                  name="objectives" 
                  value={proposalForm.objectives} 
                  onChange={handleProposalChange}
                  placeholder="List your main research objectives or questions"
                  rows="3"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="methodology">Methodology</label>
                <textarea 
                  id="methodology" 
                  name="methodology" 
                  value={proposalForm.methodology} 
                  onChange={handleProposalChange}
                  placeholder="Describe your research methodology"
                  rows="3"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="timeline">Timeline</label>
                <textarea 
                  id="timeline" 
                  name="timeline" 
                  value={proposalForm.timeline} 
                  onChange={handleProposalChange}
                  placeholder="Outline your research timeline and milestones"
                  rows="2"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="budget">Budget</label>
                <textarea 
                  id="budget" 
                  name="budget" 
                  value={proposalForm.budget} 
                  onChange={handleProposalChange}
                  placeholder="Describe your budget needs and allocation"
                  rows="2"
                />
              </div>
              
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Proposal'}
              </button>
            </form>
          </div>            {generatedProposal && (
            <div className="ai-result-section proposal-section">
              <div className="result-header">
                <h3>Generated Research Proposal</h3>
                <div className="proposal-actions">
                  <button 
                    onClick={() => handleDownload(generatedProposal, 'research_proposal.txt')}
                    className="download-btn"
                  >
                    📄 Download TXT
                  </button>
                </div>
              </div>
              <div className="result-content proposal-display">
                <FormattedProposal text={generatedProposal} />
              </div>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'review' && (
        <div className="ai-tool-container">
          <div className="ai-form-section">
            <h2>Research Paper Review</h2>
            <p>Paste your research content below for an AI-powered review</p>
            
            <form onSubmit={handleGenerateReview} className="ai-form">
              <div className="form-group">
                <label htmlFor="content">Paper Content</label>
                <textarea 
                  id="content" 
                  name="content" 
                  value={reviewForm.content} 
                  onChange={handleReviewChange}
                  placeholder="Paste the content of your research paper or proposal here (abstract, methodology, key sections)"
                  rows="10"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="focusAreas">Focus Areas for Review (Optional)</label>
                <input 
                  type="text" 
                  id="focusAreas" 
                  name="focusAreas" 
                  value={reviewForm.focusAreas} 
                  onChange={handleReviewChange}
                  placeholder="e.g., methodology, clarity, structure, conclusions"
                />
              </div>
              
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Reviewing...' : 'Generate Review'}
              </button>
            </form>
          </div>            {generatedReview && (
            <div className="ai-result-section review-section">
              <div className="result-header">
                <h3>Research Review</h3>
                <div className="proposal-actions">
                  <button 
                    onClick={() => handleDownload(generatedReview, 'research_review.txt')}
                    className="download-btn"
                  >
                    📄 Download TXT
                  </button>
                </div>
              </div>
              <div className="result-content review-display">
                <FormattedProposal text={generatedReview} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;