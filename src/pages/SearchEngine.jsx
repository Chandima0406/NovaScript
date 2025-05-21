import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../api';
import '../styles/SearchEngine.css';

const SearchEngine = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        setProjects(response.data);
        setFilteredProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    const filtered = projects.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.author.name.toLowerCase().includes(query)
    );
    setFilteredProjects(filtered);
  };

  return (
    <div className="search-engine-container">
      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="action-button" onClick={() => navigate('/ai-assistant')}>AI Assistance</button>
        <button className="action-button" onClick={() => navigate('/publish')}>
          Publish Research
        </button>
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
        {filteredProjects.map((project) => (
          <div className="research-project-card" key={project._id}>
            <div className="project-header">
              <div className="author-avatar">
                <img src="/path/to/avatar.jpg" alt="Author" />
              </div>
              <div className="author-info">
                <h3>{project.author.name}</h3>
                <p>{project.author.role}</p>
              </div>
            </div>
            <div className="project-content">
              <a
                href={`http://localhost:5000/api/projects/pdf/${project.pdfId}`}
                className="project-title"
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.title}
              </a>
              <p className="project-description">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchEngine;