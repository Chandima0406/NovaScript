import React, { useState, useRef, useEffect } from 'react';
import '../styles/AIAssistant.css';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Automatically scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    setInputMessage('');
    setIsLoading(true);

    try {
      // This is where you would connect to your AI backend
      // Simulate API call with setTimeout
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          text: "This is a sample AI response. In a real implementation, this would be replaced with an actual API call to your AI backend service.",
          sender: 'ai',
        };
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error sending message to AI:", error);
      setIsLoading(false);
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I couldn't process your request. Please try again later.",
        sender: 'ai',
        isError: true
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="ai-assistant-container">
      <div className="ai-assistant-header">
        <h1>Research Assistant AI</h1>
        <p>Ask me anything about research papers, data analysis, or academic writing</p>
      </div>
      
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
                  <p>{message.text}</p>
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
    </div>
  );
};

export default AIAssistant;