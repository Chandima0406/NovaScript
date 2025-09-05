import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResearchProjectById, updateResearchProject } from '../api';
import TaskManager from '../components/TaskManager';
import BudgetManager from '../components/BudgetManager';
import '../styles/ManageResearch.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h3>Something went wrong</h3>
          <p>There was an error loading this component. Please refresh the page.</p>
          <button onClick={() => window.location.reload()} className="refresh-btn">
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const ManageResearch = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  // Handle keyboard navigation for tabs
  const handleKeyDown = (e, tab) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTabChange(tab);
    }
  };

  // Initialize form data with default values
  const initializeFormData = (projectData) => {
    return {
      ...projectData,
      objectives: projectData.objectives?.length > 0 ? projectData.objectives : [''],
      keywords: projectData.keywords?.length > 0 ? projectData.keywords : [''],
      collaborators: projectData.collaborators?.length > 0 ? projectData.collaborators : ['']
    };
  };

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getResearchProjectById(projectId);
      setProject(response.data);
      setFormData(initializeFormData(response.data));
    } catch (err) {
      console.error('Error fetching project:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.response?.status === 404) {
        setError('Research project not found');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch project details');
      }
    } finally {
      setLoading(false);
    }
  }, [projectId, navigate]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);
    // Reset to overview tab when project changes
  useEffect(() => {
    setActiveTab('overview');
  }, [projectId]);
  
  const handleTabChange = (tab) => {
    // If switching away from edit mode, prompt to save changes
    if (editMode && tab !== 'overview') {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to switch tabs?');
      if (confirmed) {
        setEditMode(false);
        setFormData(initializeFormData(project)); // Reset form data to current project
        setError(''); // Clear any errors
        setSuccess(''); // Clear any success messages
      } else {
        return;
      }
    }
    
    setTabLoading(true);
    setActiveTab(tab);
    setError(''); // Clear errors when switching tabs
    setSuccess(''); // Clear success messages when switching tabs
    
    // Brief loading state for smoother transitions
    // Use a slightly longer timeout for the phases tab since it may need more time to render
    const timeout = tab === 'phases' ? 500 : 300;
    
    setTimeout(() => {
      setTabLoading(false);
    }, timeout);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
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

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // Validate required fields
      if (!formData.title?.trim()) {
        setError('Project title is required');
        return;
      }
      
      if (!formData.description?.trim()) {
        setError('Project description is required');
        return;
      }
      
      // Validate date fields
      if (formData.startDate && formData.endDate) {
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        
        if (endDate <= startDate) {
          setError('End date must be after start date');
          return;
        }
      }
      
      // Validate estimated budget
      if (formData.estimatedBudget && formData.estimatedBudget < 0) {
        setError('Estimated budget cannot be negative');
        return;
      }
      
      const updateData = {
        ...formData,
        objectives: formData.objectives?.filter(obj => obj.trim() !== '') || [],
        keywords: formData.keywords?.filter(kw => kw.trim() !== '') || [],
        collaborators: formData.collaborators?.filter(collab => collab.trim() !== '') || []
      };
      
      await updateResearchProject(projectId, updateData);
      setProject(updateData);
      setEditMode(false);
      setSuccess('Project updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
    } catch (err) {
      console.error('Error updating project:', err);
      setError(err.response?.data?.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return '#f59e0b';
      case 'active': return '#10b981';
      case 'on-hold': return '#ef4444';
      case 'completed': return '#6366f1';
      default: return '#6b7280';
    }
  };  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="manage-research-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-research-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/researcher-dashboard')} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-research-page">
      <div className="manage-research-container">
        {/* Header */}
        <div className="project-header">
          <div className="header-content">
            <div className="project-info">
              <h1 className="project-title">{project.title}</h1>
              <p className="project-description">{project.description}</p>
            </div>
            <div className="header-actions">
              <div className="project-meta">
                <span 
                  className="project-status" 
                  style={{ backgroundColor: getStatusColor(project.status) }}
                >
                  {project.status || 'Planning'}
                </span>
              </div>
              <button 
                onClick={() => {
                  setEditMode(!editMode);
                  if (editMode) {
                    // Reset form data when canceling edit mode
                    setFormData(initializeFormData(project));
                    setError('');
                    setSuccess('');
                  }
                }}
                className="edit-btn"
                disabled={loading || saving}
              >
                {editMode ? 'Cancel' : 'Edit Project'}
              </button>
              {editMode && (
                <button 
                  onClick={handleSave}
                  className="save-btn"
                  disabled={loading || saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        </div>        {/* Tab Navigation */}        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
            onKeyDown={(e) => handleKeyDown(e, 'overview')}
            aria-pressed={activeTab === 'overview'}
            aria-label="Overview tab"
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'phases' ? 'active' : ''}`}
            onClick={() => handleTabChange('phases')}
            onKeyDown={(e) => handleKeyDown(e, 'phases')}
            aria-pressed={activeTab === 'phases'}
            aria-label="Research phases tab"
          >
            Research Phases
          </button>
          <button 
            className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => handleTabChange('budget')}
            onKeyDown={(e) => handleKeyDown(e, 'budget')}
            aria-pressed={activeTab === 'budget'}
            aria-label="Budget tab"
          >
            Budget
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {tabLoading && (
            <div className="tab-loading-overlay">
              <div className="tab-loading-spinner"></div>
            </div>
          )}
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {/* Success Message */}
              {success && (
                <div className="success-message">
                  <p>{success}</p>
                </div>
              )}
              
              {/* Error Message */}
              {error && (
                <div className="error-message">
                  <p>{error}</p>
                </div>
              )}
              
              {editMode ? (
                <div className="edit-form">
                  <div className="form-section">
                    <h3>Basic Information</h3>
                    
                    <div className="form-group">
                      <label>Project Title <span className="required">*</span></label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title || ''}
                        onChange={handleChange}
                        className="form-input"
                        disabled={saving}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Description <span className="required">*</span></label>
                      <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        className="form-input textarea"
                        rows="4"
                        disabled={saving}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Methodology</label>
                      <textarea
                        name="methodology"
                        value={formData.methodology || ''}
                        onChange={handleChange}
                        className="form-input textarea"
                        rows="3"
                        disabled={saving}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate ? formData.startDate.split('T')[0] : ''}
                          onChange={handleChange}
                          className="form-input"
                          disabled={saving}
                        />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate ? formData.endDate.split('T')[0] : ''}
                          onChange={handleChange}
                          className="form-input"
                          disabled={saving}
                        />
                      </div>
                    </div>                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        value={formData.status || 'planning'}
                        onChange={handleChange}
                        className="form-input"
                        disabled={saving}
                      >
                        <option value="planning">Planning</option>
                        <option value="active">Active</option>
                        <option value="on-hold">On Hold</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Estimated Budget ($)</label>
                      <input
                        type="number"
                        name="estimatedBudget"
                        value={formData.estimatedBudget || ''}
                        onChange={handleChange}
                        className="form-input"
                        min="0"
                        step="0.01"
                        placeholder="Enter estimated budget"
                        disabled={saving}
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Objectives</h3>
                    <div className="dynamic-list">
                      {(formData.objectives || []).map((objective, index) => (
                        <div key={index} className="dynamic-item">
                          <input
                            type="text"
                            placeholder={`Objective ${index + 1}`}
                            className="form-input"
                            value={objective}
                            onChange={(e) => handleArrayChange(index, e.target.value, 'objectives')}
                            disabled={saving}
                          />
                          {(formData.objectives || []).length > 1 && (
                            <button
                              type="button"
                              className="remove-btn"
                              onClick={() => removeArrayField(index, 'objectives')}
                              disabled={saving}
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
                        disabled={saving}
                      >
                        + Add Objective
                      </button>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Keywords</h3>
                    <div className="dynamic-list">
                      {(formData.keywords || []).map((keyword, index) => (
                        <div key={index} className="dynamic-item">
                          <input
                            type="text"
                            placeholder={`Keyword ${index + 1}`}
                            className="form-input"
                            value={keyword}
                            onChange={(e) => handleArrayChange(index, e.target.value, 'keywords')}
                            disabled={saving}
                          />
                          {(formData.keywords || []).length > 1 && (
                            <button
                              type="button"
                              className="remove-btn"
                              onClick={() => removeArrayField(index, 'keywords')}
                              disabled={saving}
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
                        disabled={saving}
                      >
                        + Add Keyword
                      </button>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Collaborators</h3>
                    <div className="dynamic-list">
                      {(formData.collaborators || []).map((collaborator, index) => (
                        <div key={index} className="dynamic-item">
                          <input
                            type="text"
                            placeholder={`Collaborator ${index + 1}`}
                            className="form-input"
                            value={collaborator}
                            onChange={(e) => handleArrayChange(index, e.target.value, 'collaborators')}
                            disabled={saving}
                          />
                          {(formData.collaborators || []).length > 1 && (
                            <button
                              type="button"
                              className="remove-btn"
                              onClick={() => removeArrayField(index, 'collaborators')}
                              disabled={saving}
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
                        disabled={saving}
                      >
                        + Add Collaborator
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overview-content">
                  <div className="info-section">
                    <h3>Project Details</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Research Field</label>
                        <span>{project.researchField || 'Not specified'}</span>
                      </div>
                      <div className="info-item">
                        <label>Duration</label>
                        <span>{project.expectedDuration || 'Not specified'}</span>
                      </div>
                      <div className="info-item">
                        <label>Start Date</label>
                        <span>{formatDate(project.startDate)}</span>
                      </div>                      <div className="info-item">
                        <label>End Date</label>
                        <span>{formatDate(project.endDate)}</span>                      </div>
                      <div className="info-item">
                        <label>Estimated Budget</label>
                        <span>{project.estimatedBudget ? `$${project.estimatedBudget.toLocaleString()}` : 'Not set'}</span>
                      </div>
                      <div className="info-item">
                        <label>Created</label>
                        <span>{formatDate(project.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {project.methodology && (
                    <div className="info-section">
                      <h3>Methodology</h3>
                      <p>{project.methodology}</p>
                    </div>
                  )}

                  {project.objectives && project.objectives.length > 0 && (
                    <div className="info-section">
                      <h3>Objectives</h3>
                      <ul className="list">
                        {project.objectives.map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.keywords && project.keywords.length > 0 && (
                    <div className="info-section">
                      <h3>Keywords</h3>
                      <div className="keyword-tags">
                        {project.keywords.map((keyword, index) => (
                          <span key={index} className="keyword-tag">{keyword}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.collaborators && project.collaborators.length > 0 && (
                    <div className="info-section">
                      <h3>Collaborators</h3>
                      <ul className="list">
                        {project.collaborators.map((collaborator, index) => (
                          <li key={index}>{collaborator}</li>
                        ))}
                      </ul>
                    </div>
                  )}                </div>
              )}
            </div>
          )}          {activeTab === 'phases' && (
            <div className="phases-tab">
              <div className="tab-content-wrapper">
                <ErrorBoundary>
                  <TaskManager 
                    projectId={projectId} 
                    projectTitle={project.title}
                    onError={(error) => {
                      console.error('TaskManager error:', error);
                      setError('Failed to load project phases. Please try again.');
                    }}
                  />
                </ErrorBoundary>
              </div>
            </div>
          )}
          {activeTab === 'budget' && (
            <div className="budget-tab">
              <div className="tab-content-wrapper">
                <ErrorBoundary>
                  <BudgetManager 
                    projectId={projectId} 
                    estimatedBudget={project.estimatedBudget || 0}
                    onError={(error) => {
                      console.error('BudgetManager error:', error);
                      setError('Failed to load budget data. Please try again.');
                    }}
                  />
                </ErrorBoundary>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageResearch;
