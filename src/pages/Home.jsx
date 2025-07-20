import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import '../styles/Home.css';

// Import images to ensure correct paths
import aiBotImage from '../assets/Ai bot.png';
import heroBackground from '../assets/hero-bg.jpg';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "chip",
      title: "AI Powered Research Assistance",
      description: "Get intelligent research guidance and writing support with AI."
    },
    {
      icon: "document",
      title: "Comprehensive Project Management",
      description: "Create, organize and manage research projects with timeline tracking."
    },
    {
      icon: "storage",
      title: "Research Paper Management",
      description: "Publish, search and manage research papers with secure PDF storage."
    },
    {
      icon: "monitor",
      title: "Advanced Survey System",
      description: "Create detailed surveys, collect responses and analyze data effectively."
    },
    {
      icon: "team",
      title: "User Dashboard & Analytics",
      description: "Track your research progress with comprehensive dashboard insights."
    },
    {
      icon: "money",
      title: "Budget Planning Tools",
      description: "Plan and track research project budgets with estimation tools."
    }
  ];

  const testimonials = [
    {
      rating: 5,
      text: "NovaScript made research management so much easier! The AI assistant helped me with research guidance, and the project management features keep everything organized. Perfect for any researcher!",
      name: "Dr. Samantha Perera",
      title: "Senior Researcher",
      avatar: "https://placekitten.com/60/60"
    },
    {
      rating: 5,
      text: "The research paper management and search engine are fantastic! I can easily publish my papers and find relevant research. The survey system is also very comprehensive and easy to use.",
      name: "Mr. John Silva",
      title: "University Researcher",
      avatar: "https://placekitten.com/61/61"
    },
    {
      rating: 5,
      text: "From creating research projects to managing budgets, NovaScript has everything I need. The dashboard gives me great insights into my research progress. Highly recommend for academics!",
      name: "Mrs. Ayesha Fernando",
      title: "PhD Student",
      avatar: "https://placekitten.com/62/62"
    }
  ];

  const renderIcon = (iconType) => {
    switch (iconType) {
      case 'chip':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 9h6v6H9z" />
          <path d="M4 12h2M18 12h2M12 4v2M12 18v2" />
        </svg>;
      case 'document':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
          <path d="M14 2v6h6" />
        </svg>;
      case 'team':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="7" r="4" />
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="5" cy="7" r="2" />
          <circle cx="19" cy="7" r="2" />
        </svg>;
      case 'money':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="12" cy="12" r="4" />
          <path d="M16 6V4M8 6V4M16 20v-2M8 20v-2" />
        </svg>;
      case 'storage':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="5" />
          <rect x="2" y="9" width="20" height="5" />
          <rect x="2" y="14" width="20" height="5" />
          <path d="M6 7h.01M6 12h.01M6 17h.01" />
        </svg>;
      case 'monitor':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
          <path d="M6 10l4 3 4-6 4 3" />
        </svg>;
      default:
        return null;
    }
  };

  return (
    <div className="home">      {/* Hero Section */}
      <div className="hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBackground})` }}>
        <div className="content">
          <div className="steps">
            <div className="step">1</div>
            <div className="step-line"></div>
            <div className="step">2</div>
            <div className="step-line"></div>
            <div className="step">3</div>
          </div>
          
          <div className="headline">PLAN & COLLABORATE WITH AI</div>
          
          <h1 className="title">TRACK, ANALYZE & SUCCEED!</h1>
          
          <button className="cta-button" onClick={() => navigate('/search')}>Get Started Now</button>
            <div className="info-panel">
            <div className="info-header">
              <span>Know More</span>
              <span aria-hidden="true">→</span>
            </div>
            <div className="info-content">
              <div className="feature">
                <div className="feature-title">All in One Place</div>
                <div className="feature-description">
                  Secure, Organize, and Access Research Anytime!
                </div>                <div className="feature-images">
                  <div className="feature-image">
                    <FaFacebookF aria-hidden="true" />
                  </div>
                  <div className="feature-image">
                    <FaInstagram aria-hidden="true" />
                  </div>
                  <div className="feature-image">
                    <FaTwitter aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      {/* How It Works Section */}      <section className="how-it-works">
        <div className="social-follow">
          <span className="follow-text">Follow</span>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon facebook" aria-label="Follow us on Facebook">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram" aria-label="Follow us on Instagram">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon twitter" aria-label="Follow us on Twitter">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon linkedin" aria-label="Follow us on LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
        <div className="how-it-works-content">
          <h2 className="section-title">
            How <span className="highlight">NovaScript</span> Works
          </h2>
          <p className="section-subtitle">
            Streamline your research in just two easy steps!
          </p>
          <div className="features-container">
            <div className="feature-card">
              <h3 className="feature-title">Plan & Collaborate with AI</h3>
              <div className="feature-details">
                <p>Create AI powered research proposals in minutes.</p>
                <p>Organize projects, tasks, and milestones effortlessly.</p>
                <p>Collaborate with your team & supervisors in real time.</p>
              </div>
            </div>
            <div className="feature-card">
              <h3 className="feature-title">Track, Analyze & Succeed</h3>
              <div className="feature-details">
                <p>Monitor progress with dashboards & Gantt charts.</p>
                <p>Securely store research documents & manage budgets.</p>
                <p>Leverage AI driven insights for smarter decisions.</p>
              </div>
            </div>
          </div>
          <div className="cta-container">
            <p className="cta-text">Start Managing Your Research Smarter !</p>
            <button className="cta-button1" onClick={() => navigate('/register')}>Sign Up Today</button>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="why-choose">
        <div className="why-choose-content">
          <h2 className="section-title">
            Why Choose <span className="highlight">NovaScript</span>
          </h2>
          <p className="section-subtitle">
            Empowering researchers with AI driven efficiency!
          </p>
          <div className="why-choose-container">            <div className="images-container">
              <div className="image-robot" style={{ backgroundImage: `url(${aiBotImage})` }}></div>
            </div>
            <div className="features-list">
              {features.map((feature, index) => (
                <div className="feature-item" key={index}>
                  <div className="feature-icon">
                    {renderIcon(feature.icon)}
                  </div>
                  <div className="feature-text">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <div className="testimonials-container">        <h2 className="testimonials-heading">What Our Users Say</h2>
        <p className="testimonials-subheading">
          See how <span className="testimonials-link highlight">NovaScript</span> is transforming research management!
        </p>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>              <div className="testimonial-content">
                <div className="testimonial-stars" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star" aria-hidden="true">★</span>
                  ))}
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
              </div>
              <div className="testimonial-footer">                <img 
                  src={testimonial.avatar} 
                  alt={`${testimonial.name}'s avatar`} 
                  className="testimonial-avatar" 
                  loading="lazy"
                />
                <div className="testimonial-info">
                  <h3 className="testimonial-name">{testimonial.name}</h3>
                  <p className="testimonial-title">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;