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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="publish-research-page">
      <main className="publish-main">
        <h1 className="publish-title">Publish a Research Project</h1>
        {error && <p className="error-message">{error}</p>}
        <form className="publish-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter Your Project Title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Project Description</label>
            <textarea
              name="description"
              placeholder="Write Your Project Description Here..."
              className="form-input textarea"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={loading}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Your Current Position</label>
            <input
              type="text"
              name="role"
              placeholder="Enter Your Current Position (e.g., University student)"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Upload PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="publish-button"
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Submit Request'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default PublishResearch;