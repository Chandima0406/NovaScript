import React, { useState } from 'react';
import '../styles/SearchEngine.css';

const SearchEngine = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample research projects data
  const researchProjects = [
    {
      id: 1,
      author: {
        name: 'Chandima Wijerathna',
        role: 'Student sabaragamuwa university of sri lanka',
        avatar: '/path/to/avatar.jpg'
      },
      title: 'The Impact of Artificial Intelligence on Academic Research Efficiency',
      description: 'This research investigates how artificial intelligence enhances the efficiency of academic research processes. It focuses on AI-driven tools used in proposal writing, data analysis, and literature review automation. The study aims to evaluate improvements in research speed, accuracy, and collaboration through AI integration. By comparing traditional research workflows with AI-assisted methods, the project highlights the transformative role of technology in modern research environments.'
    },
    {
      id: 2,
      author: {
        name: 'Chandima Wijerathna',
        role: 'Student sabaragamuwa university of sri lanka',
        avatar: '/path/to/avatar.jpg'
      },
      title: 'The Impact of Artificial Intelligence on Academic Research Efficiency',
      description: 'This research investigates how artificial intelligence enhances the efficiency of academic research processes. It focuses on AI-driven tools used in proposal writing, data analysis, and literature review automation. The study aims to evaluate improvements in research speed, accuracy, and collaboration through AI integration. By comparing traditional research workflows with AI-assisted methods, the project highlights the transformative role of technology in modern research environments.'
    },
    {
      id: 3,
      author: {
        name: 'Chandima Wijerathna',
        role: 'Student sabaragamuwa university of sri lanka',
        avatar: '/path/to/avatar.jpg'
      },
      title: 'The Impact of Artificial Intelligence on Academic Research Efficiency',
      description: 'This research investigates how artificial intelligence enhances the efficiency of academic research processes. It focuses on AI-driven tools used in proposal writing, data analysis, and literature review automation. The study aims to evaluate improvements in research speed, accuracy, and collaboration through AI integration. By comparing traditional research workflows with AI-assisted methods, the project highlights the transformative role of technology in modern research environments.'
    },
    {
      id: 4,
      author: {
        name: 'Chandima Wijerathna',
        role: 'Student sabaragamuwa university of sri lanka',
        avatar: '/path/to/avatar.jpg'
      },
      title: 'The Impact of Artificial Intelligence on Academic Research Efficiency',
      description: 'This research investigates how artificial intelligence enhances the efficiency of academic research processes. It focuses on AI-driven tools used in proposal writing, data analysis, and literature review automation. The study aims to evaluate improvements in research speed, accuracy, and collaboration through AI integration. By comparing traditional research workflows with AI-assisted methods, the project highlights the transformative role of technology in modern research environments.'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality here
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="search-engine-container">
      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="action-button">AI Assistance</button>
        <button className="action-button">Publish Research</button>
        <button className="action-button">Create Survey</button>
        <button className="action-button">Support Survey</button>
      </div>

      {/* Main Heading */}
      <div className="main-heading">
        <h1>Explore Research Projects</h1>
        <p>
          Discover innovative research projects crafted by top academics and institutions. 
          Gain insights, collaborate with experts, and stay at the forefront of knowledge and discovery.
        </p>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search Research Titles, Topics, Or Authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      {/* Research Projects List */}
      <div className="research-projects-list">
        {researchProjects.map((project) => (
          <div className="research-project-card" key={project.id}>
            <div className="project-header">
              <div className="author-avatar">
                <img src={project.author.avatar} alt="Author" />
              </div>
              <div className="author-info">
                <h3>{project.author.name}</h3>
                <p>{project.author.role}</p>
              </div>
            </div>
            <div className="project-content">
              <h2 className="project-title">{project.title}</h2>
              <p className="project-description">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchEngine;