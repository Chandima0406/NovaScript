import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publishProject } from '../api';
import '../styles/PublishResearch.css';

const PublishResearch = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    role: '',
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('role', formData.role);
    if (pdfFile) {
      data.append('pdf', pdfFile);
    }

    try {
      await publishProject(data);
      navigate('/search');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish project');
    }
  };

  return (
    <div className="publish-research-page">
      <main className="publish-main">
        <h1 className="publish-title">Publish a Research Project</h1>
        {error && <p className="error-message">{error}</p>}
        <form className="publish-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="title"
              placeholder="Project Title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              name="description"
              placeholder="Project Description"
              className="form-input"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="role"
              placeholder="Your Role (e.g., Lead Researcher)"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required
            />
          </div>
          <button type="submit" className="publish-button">Publish Project</button>
        </form>
      </main>
    </div>
  );
};

export default PublishResearch;