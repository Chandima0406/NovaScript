import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Home.css';
import heroImage from '../assets/hero-bg.jpg'; // Placeholder for hero background

function Home() {
  return (
    <div className="home">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="hero-content">
            <h1>Track, Analyze & Succeed!</h1>
            <p>Plan & Collaborate with NovaScript</p>
            <button className="hero-button">Get Started Now</button>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <h2>How NovaScript Works</h2>
          <p>Streamline your research in just two easy steps!</p>
          <div className="how-it-works-steps">
            <div className="step">
              <h3>Plan & Collaborate</h3>
              <p>Create AI research assistants within minutes. Organize projects, tasks, and milestones effortlessly. Collaborate with your team & supervisors in real time.</p>
            </div>
            <div className="step">
              <h3>Track, Analyze & Succeed</h3>
              <p>Monitor progress with dashboards & Gantt Charts. Securely store research documents & manage budgets. Leverage AI-driven insights for smarter decisions.</p>
            </div>
          </div>
          <button className="action-button">Start Managing Your Research Smarter!</button>
        </section>

        {/* Why Choose Section */}
        <section className="why-choose">
          <h2>Why Choose NovaScript</h2>
          <p>Empowering researchers with AI-driven efficiency!</p>
          <div className="why-choose-content">
            <div className="why-choose-image">
              <img src="/ai-robot.png" alt="AI Robot" /> {/* Placeholder */}
            </div>
            <ul className="why-choose-list">
              <li>AI-powered Research Assistance</li>
              <li>Automated proposal writing & AI driven feedback</li>
              <li>Effortless Project Management</li>
              <li>Progress tracking with milestones</li>
              <li>Seamless Team Collaboration</li>
              <li>Share documents, receive feedback & iterate</li>
              <li>Advanced Budget Tracking</li>
              <li>Track expenses with interactive charts & analytics</li>
              <li>Secure Document Storage</li>
              <li>Store & access research documents</li>
              <li>Real Time Progress Monitoring</li>
              <li>Track progress with powered dashboards & Gantt Charts</li>
            </ul>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials">
          <h2>What Our Users Say</h2>
          <p>See how NovaScript transforms research!</p>
          <div className="testimonials-grid">
            <div className="testimonial">
              <p>"NovaScript has streamlined my proposal writing, saved me hours, and I highly recommend it for efficiency and collaboration."</p>
              <p className="author">Dr. Samantha Perera, University of Colombo</p>
            </div>
            <div className="testimonial">
              <p>"Managing research has never been easier. NovaScript is a must-have for any research professional."</p>
              <p className="author">Mr. John Silva, Research Institute</p>
            </div>
            <div className="testimonial">
              <p>"From proposal creation to budget tracking, NovaScript is a game-changer for research."</p>
              <p className="author">Mrs. Ayesha Fernando, Research Lead</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;