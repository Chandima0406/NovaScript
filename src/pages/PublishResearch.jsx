import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { publishProject, getProjectById, updateProject } from '../api';
import '../styles/PublishResearch.css';

const PublishResearch = () => {
  const { projectId } = useParams(); // Get projectId from URL for editing
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    role: '',
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!projectId); // Only true when editing
  const navigate = useNavigate();

  // Fetch project details if editing
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setInitialLoading(false);
        return;
      }
      try {
        setInitialLoading(true);
        const response = await getProjectById(projectId);
        const project = response.data;
        setFormData({
          title: project.title,
          description: project.description,
          role: project.author.role,
        });
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err.response?.data?.message || 'Failed to fetch project details');
        navigate('/researcher-dashboard');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProject();
  }, [projectId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || initialLoading) return;
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('role', formData.role);
    if (pdfFile) {
      data.append('pdf', pdfFile);
    } else if (!projectId) {
      setError('PDF file is required for new projects');
      setLoading(false);
      return;
    }

    try {
      if (projectId) {
        // Update existing project
        await updateProject(projectId, data);
      } else {
        // Create new project
        await publishProject(data);
      }
      navigate('/search'); // Redirect to dashboard after success
    } catch (err) {
      console.error('Error submitting project:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to save project');
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="publish-research-page">
        <main className="publish-main">
          <p>Loading project details...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="publish-research-page">
      <main className="publish-main">
        <h1 className="publish-title">
          {projectId ? 'Edit Research Project' : 'Publish a Research Project'}
        </h1>
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
              disabled={loading || initialLoading}
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
              disabled={loading || initialLoading}
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
              disabled={loading || initialLoading}
            />
          </div>
          <div className="form-group">
            <label>Upload PDF {projectId ? '(Optional)' : ''}</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required={!projectId} // Required only for new projects
              disabled={loading || initialLoading}
            />
          </div>
          <button
            type="submit"
            className="publish-button"
            disabled={loading || initialLoading}
          >
            {loading ? 'Saving...' : projectId ? 'Update Project' : 'Submit Request'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default PublishResearch;