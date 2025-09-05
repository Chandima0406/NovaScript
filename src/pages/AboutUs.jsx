import React from 'react';
import '../styles/AboutUs.css';
import researchCollaborationImage from '../assets/research-collaboration.png';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <section className="hero-section">
        <h1>About Us</h1>
        <p className="mission-statement">
          Empowering research through intelligent technology. NovaScript is built to streamline academic project 
          management with AI-driven tools. We help researchers collaborate, organize, and innovate making every step of 
          the research journey smarter, faster, and more efficient.
        </p>
      </section>

      <section className="main-content">
        <div className="content-wrapper">
          <div className="text-content">
            <h2>Driving Smarter Research, Together</h2>
            
            <p>
              At NovaScript, we believe that research should be smart, 
              streamlined, and collaborative. Our platform is designed to 
              revolutionize the way researchers and supervisors manage 
              academic projects by integrating the power of artificial 
              intelligence with intuitive project management tools.
            </p>
            
            <p>
              Whether it's writing proposals, tracking milestones, managing 
              budgets, or collecting feedback, NovaScript simplifies the 
              research lifecycle from start to finish. Our AI-assisted features 
              not only save time but also help improve the quality and 
              accuracy of research work.
            </p>
            
            <p>
              Developed by a passionate team of students and researchers 
              from Sabaragamuwa University of Sri Lanka, NovaScript is 
              more than just a tool it's a digital partner built to support 
              innovation, productivity, and academic excellence.
            </p>
            
            <p>
              Join us in reshaping the future of research efficiently, 
              intelligently, and together.
            </p>
          </div>
          
          <div className="image-content">
            <img 
              src={researchCollaborationImage} 
              alt="Research collaboration with AI tools" 
              className="about-image"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;