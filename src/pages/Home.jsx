import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Home.css';

const Home = () => {
  const features = [
    {
      icon: "chip",
      title: "AI Powered Research Assistance",
      description: "Automate proposal writing & get AI driven insights."
    },
    {
      icon: "document",
      title: "Effortless Project Management",
      description: "Organize tasks, set milestones & track progress easily."
    },
    {
      icon: "team",
      title: "Seamless Team Collaboration",
      description: "Share documents, receive feedback & communicate in real time."
    },
    {
      icon: "money",
      title: "Advanced Budget Tracking",
      description: "Monitor research funds with interactive charts & analytics."
    },
    {
      icon: "storage",
      title: "Secure Document Storage",
      description: "Store, access & manage research documents safely in the cloud."
    },
    {
      icon: "monitor",
      title: "Real Time Progress Monitoring",
      description: "Gain insights with AI powered dashboards & Gantt charts."
    }
  ];

  const testimonials = [
    {
      rating: 5,
      text: "NovaScript transformed the way I manage research! AI-assisted proposal writing saved me hours, and the task tracking keeps my projects on schedule. I highly recommend it to any researcher looking for efficiency and collaboration!",
      name: "Dr. Samantha Perera",
      title: "Senior Researcher",
      avatar: "https://placekitten.com/60/60"
    },
    {
      rating: 5,
      text: "Managing research has never been easier! The intuitive dashboard, document storage, and real-time feedback system make teamwork seamless. NovaScript is a must-have for any research professional!",
      name: "Mr. John Silva",
      title: "University Researcher",
      avatar: "https://placekitten.com/61/61"
    },
    {
      rating: 5,
      text: "From proposal creation to budget management, NovaScript simplifies everything! The AI-powered insights and seamless team collaboration make research so much more efficient. A game-changer for academics!",
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
    <div className="home">
      <Navbar />
      {/* Hero Section */}
      <div className="hero">
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
          
          <button className="cta-button">Get Started Now</button>
          
          <div className="info-panel">
            <div className="info-header">
              <span>Know More</span>
              <span>→</span>
            </div>
            <div className="info-content">
              <div className="feature">
                <div className="feature-title">All in One Place</div>
                <div className="feature-description">
                  Secure, Organize, and Access Research Anytime!
                </div>
                <div className="feature-images">
                  <div className="feature-image">
                    <img src="../assets/1.png" alt="Collaboration" />
                  </div>
                  <div className="feature-image">
                    <img src="../assets/2.png" alt="Data analysis" />
                  </div>
                  <div className="feature-image">
                    <img src="../assets/3.png" alt="Research tool" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="social-follow">
          <span className="follow-text">Follow</span>
          <div className="social-icons">
            <a href="#" className="social-icon facebook" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-icon instagram" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-icon twitter" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-icon linkedin" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
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
            <button className="cta-button1">Sign Up Today</button>
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
          <div className="why-choose-container">
            <div className="images-container">
              <div className="image-robot" style={{ backgroundImage: 'url(../assets/Ai bot.png)' }}></div>
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
      <div className="testimonials-container">
        <h1 className="testimonials-heading">What Our Users Say</h1>
        <p className="testimonials-subheading">
          See how <a href="#" className="testimonials-link">NovaScript</a> is transforming research management!
        </p>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="testimonial-content">
                <div className="testimonial-stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
              </div>
              <div className="testimonial-footer">
                <img 
                  src={testimonial.avatar} 
                  alt={`${testimonial.name}'s avatar`} 
                  className="testimonial-avatar" 
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
      <Footer />
    </div>
  );
};

export default Home;