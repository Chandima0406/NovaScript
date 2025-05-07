import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <a href="/" className="logo-link">NovaScript</a>
        </div>
        
        <div className="footer-columns">
          <div className="footer-column">
            <h3 className="footer-heading">Contact Information</h3>
            <ul className="footer-list">
              <li>Email: support@novascript.com</li>
              <li>Address: Sabaragamuwa University, Sri Lanka</li>
              <li>Phone: +94 77 217 4920</li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-heading">General</h3>
            <ul className="footer-list">
              <li><a href="/home">Home</a></li>
              <li><a href="/projects">Projects</a></li>
              <li><a href="/proposals">Proposals</a></li>
              <li><a href="/surveys">Surveys</a></li>
              <li><a href="/documents">Documents</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-list">
              <li><a href="/guide">User Guide</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/blog">Blog & Research Updates</a></li>
              <li><a href="/surveys">Surveys</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-heading">Legal</h3>
            <ul className="footer-list">
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms & Conditions</a></li>
              <li><a href="/security">Security & Compliance</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-social">
          <span className="follow-text">Follow</span>
          <div className="social-icons">
            <a href="https://facebook.com" aria-label="Facebook" className="social-icon">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="social-icon">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="social-icon">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="social-icon">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        
        <div className="footer-copyright">
          <p>© 2024 NovaScript. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;