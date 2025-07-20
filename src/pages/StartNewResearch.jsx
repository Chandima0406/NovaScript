import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createResearchProject } from '../api';
import '../styles/StartNewResearch.css';

const StartNewResearch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  const [formData, setFormData] = useState({
    title: '',
    description: '',
    researchField: '',
    methodology: '',
    expectedDuration: '',
    objectives: [''],
    keywords: [''],
    collaborators: [''],
    startDate: '',
    endDate: '',
    estimatedBudget: ''
  });

  const researchFields = [
    'Computer Science',
    'Biology',
    'Chemistry', 
    'Physics',
    'Medicine',
    'Engineering',
    'Psychology',
    'Sociology',
    'Economics',
    'Environmental Science',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayField = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    try {      const projectData = {
        ...formData,
        objectives: formData.objectives.filter(obj => obj.trim() !== ''),
        keywords: formData.keywords.filter(kw => kw.trim() !== ''),
        collaborators: formData.collaborators.filter(collab => collab.trim() !== ''),
        estimatedBudget: formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : 0,
        status: 'planning'
      };

      const response = await createResearchProject(projectData);
      const projectId = response.data._id;
      
      // Navigate to the project management page
      navigate(`/manage-research/${projectId}`);
    } catch (err) {
      console.error('Error creating research project:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to create research project');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="start-research-page">
      <main className="start-research-main">
        <div className="start-research-header">
          <h1 className="start-research-title">Start New Research Project</h1>
          <p className="start-research-subtitle">
            Create and plan your new research project with timeline management
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="start-research-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label>Project Title *</label>
              <input
                type="text"
                name="title"
                placeholder="Enter your research project title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Research Field *</label>
              <select
                name="researchField"
                className="form-input"
                value={formData.researchField}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select research field</option>
                {researchFields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Project Description *</label>
              <textarea
                name="description"
                placeholder="Describe your research project in detail..."
                className="form-input textarea"
                value={formData.description}
                onChange={handleChange}
                required
                disabled={loading}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Research Methodology</label>
              <textarea
                name="methodology"
                placeholder="Describe your research methodology and approach..."
                className="form-input textarea"
                value={formData.methodology}
                onChange={handleChange}
                disabled={loading}
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Project Timeline</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Expected Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-input"
                  value={formData.startDate}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Expected End Date</label>
                <input
                  type="date"
                  name="endDate"
                  className="form-input"
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>            <div className="form-group">
              <label>Expected Duration</label>
              <input
                type="text"
                name="expectedDuration"
                placeholder="e.g., 6 months, 1 year"
                className="form-input"
                value={formData.expectedDuration}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Budget Planning</h2>
            
            <div className="form-group">
              <label>Estimated Budget (Optional)</label>
              <input
                type="number"
                name="estimatedBudget"
                placeholder="Enter estimated budget amount"
                className="form-input"
                value={formData.estimatedBudget}
                onChange={handleChange}
                disabled={loading}
                min="0"
                step="0.01"
              />
              <small className="form-help">
                This helps track your research expenses. You can modify this later in the project management section.
              </small>
            </div>
          </div><div className="form-section">
            <h2>Research Objectives</h2>
            
            <div className="dynamic-list">
              {formData.objectives.map((objective, index) => (
                <div key={index} className="dynamic-item">
                  <input
                    type="text"
                    placeholder={`Objective ${index + 1}`}
                    className="form-input"
                    value={objective}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'objectives')}
                    disabled={loading}
                  />
                  {formData.objectives.length > 1 && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeArrayField(index, 'objectives')}
                      disabled={loading}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-btn"
                onClick={() => addArrayField('objectives')}
                disabled={loading}
              >
                + Add Objective
              </button>
            </div>
          </div>

          <div className="form-section">
            <h2>Keywords</h2>
            
            <div className="dynamic-list">
              {formData.keywords.map((keyword, index) => (
                <div key={index} className="dynamic-item">
                  <input
                    type="text"
                    placeholder={`Keyword ${index + 1}`}
                    className="form-input"
                    value={keyword}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'keywords')}
                    disabled={loading}
                  />
                  {formData.keywords.length > 1 && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeArrayField(index, 'keywords')}
                      disabled={loading}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-btn"
                onClick={() => addArrayField('keywords')}
                disabled={loading}
              >
                + Add Keyword
              </button>
            </div>
          </div>

          <div className="form-section">
            <h2>Collaborators (Optional)</h2>
            
            <div className="dynamic-list">
              {formData.collaborators.map((collaborator, index) => (
                <div key={index} className="dynamic-item">
                  <input
                    type="text"
                    placeholder={`Collaborator ${index + 1} (Name, Institution)`}
                    className="form-input"
                    value={collaborator}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'collaborators')}
                    disabled={loading}
                  />
                  {formData.collaborators.length > 1 && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeArrayField(index, 'collaborators')}
                      disabled={loading}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-btn"
                onClick={() => addArrayField('collaborators')}
                disabled={loading}
              >
                + Add Collaborator
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/researcher-dashboard')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating Project...' : 'Create Research Project'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default StartNewResearch;
