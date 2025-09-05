import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  getResearchPapers,
  getUserSurveys,
  deleteResearchPaper,
  deleteSurvey,
  getSurveyResponses,
  getSurveyAnalytics,
  getUserResearchProjects,
  deleteResearchProject,
} from '../api';
import { jsPDF } from 'jspdf';
import 'chart.js/auto';
import { Bar, Pie } from 'react-chartjs-2';
import { FaQuoteLeft, FaChartBar, FaUsers, FaFileDownload } from 'react-icons/fa';
import DashboardNav from '../components/DashboardNav';
import '../styles/ResearcherDashboard.css';

const ResearcherDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [researchPapers, setResearchPapers] = useState([]);
  const [researchProjects, setResearchProjects] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [surveyResponses, setSurveyResponses] = useState([]);
  const [surveyAnalytics, setSurveyAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [papersRes, surveysRes, projectsRes] = await Promise.all([
        getResearchPapers().catch(err => {
          console.error('Failed to fetch papers:', err);
          return { data: [] };
        }),
        getUserSurveys().catch(err => {
          console.error('Failed to fetch surveys:', err);
          return { data: [] };
        }),
        getUserResearchProjects().catch(err => {
          console.error('Failed to fetch research projects:', err);
          return { data: [] };
        }),
      ]);
      setResearchPapers(papersRes.data);
      setSurveys(surveysRes.data);
      setResearchProjects(projectsRes.data);
    } catch (err) {
      console.error('Error in fetchUserData:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to fetch user data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserData();
  }, [navigate, fetchUserData]);

  const handleQuickAction = (action) => {
    switch (action) {
      case 'start-research':
        navigate('/start-research');
        break;
      case 'publish':
        navigate('/publish');
        break;
      case 'create-survey':
        navigate('/create-survey');
        break;
      case 'support-survey':
        navigate('/support-survey');
        break;
      case 'ai-assistance':
        navigate('/ai-assistant');
        break;
      default:
        break;
    }
  };

  const handleDeletePaper = async (paperId) => {
    if (!window.confirm('Are you sure you want to delete this research paper?')) return;
    try {
      setError('');
      await deleteResearchPaper(paperId);
      setResearchPapers(papers => papers.filter(p => p._id !== paperId));
    } catch (err) {
      console.error('Error deleting paper:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to delete research paper. Please try again.');
      }
    }
  };

  const handleDeleteSurvey = async (surveyId) => {
    if (!window.confirm('Are you sure you want to delete this survey?')) return;
    try {
      setError('');
      await deleteSurvey(surveyId);
      setSurveys(surveys => surveys.filter(s => s._id !== surveyId));
      if (selectedSurvey?._id === surveyId) {
        setSelectedSurvey(null);
        setSurveyResponses([]);
        setSurveyAnalytics(null);
      }
    } catch (err) {
      console.error('Error deleting survey:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to delete survey. Please try again.');
      }
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this research project?')) return;
    try {
      setError('');
      await deleteResearchProject(projectId);
      setResearchProjects(projects => projects.filter(p => p._id !== projectId));
    } catch (err) {
      console.error('Error deleting research project:', err);
      if (err.response?.status === 401) {
        localStorage.removeToken('token');
        navigate('/login');
      } else {
        setError('Failed to delete research project. Please try again.');
      }
    }
  };

  const handleViewSurveyResponses = useCallback(async (survey) => {
    try {
      setError('');
      setSelectedSurvey(survey);
      const [responsesRes, analyticsRes] = await Promise.all([
        getSurveyResponses(survey._id),
        getSurveyAnalytics(survey._id),
      ]);
      setSurveyResponses(responsesRes.data);
      setSurveyAnalytics(analyticsRes.data);
    } catch (err) {
      console.error('Error fetching survey responses:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to fetch survey responses. Please try again.');
      }
    }
  }, [navigate]);

  // Handle URL parameters for tab navigation (e.g., from notifications)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get('tab');
    const surveyIdFromUrl = searchParams.get('surveyId');
    
    // Validate the tab parameter and set active tab
    if (tabFromUrl && ['overview', 'projects', 'research', 'surveys'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
    
    // If surveyId is provided and surveys are loaded, automatically open that survey's responses
    if (surveyIdFromUrl && surveys.length > 0) {
      const targetSurvey = surveys.find(survey => survey._id === surveyIdFromUrl);
      if (targetSurvey) {
        handleViewSurveyResponses(targetSurvey);
      }
    }
    
    // Clear the URL parameters after processing
    if (tabFromUrl || surveyIdFromUrl) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [location.search, surveys, handleViewSurveyResponses]);

  const generatePDF = () => {
    if (!selectedSurvey || !surveyAnalytics) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(selectedSurvey.title, 20, 20);
    doc.setFontSize(12);
    doc.text(`Total Responses: ${surveyResponses.length}`, 20, 30);
    let yOffset = 40;
    selectedSurvey.questions.forEach((question, index) => {
      const analytics = surveyAnalytics[index];
      if (!analytics) return;
      doc.text(`Question ${index + 1}: ${question.text}`, 20, yOffset);
      yOffset += 10;
      if (question.type === 'text') {
        analytics.responses.forEach(response => {
          doc.text(`- ${response}`, 30, yOffset);
          yOffset += 10;
        });
      } else {
        Object.entries(analytics.distribution).forEach(([option, count]) => {
          doc.text(`${option}: ${count} responses`, 30, yOffset);
          yOffset += 10;
        });
      }
      yOffset += 10;
    });
    doc.save(`${selectedSurvey.title}_analysis.pdf`);
  };

  const renderOverview = () => (
    <div className="dashboard-content">
      <div className="overview-cards-grid">
        <div className="overview-card">
          <h3>Research Projects</h3>
          <p className="overview-count">{researchProjects.length}</p>
          <button onClick={() => setActiveTab('projects')}>View All</button>
        </div>
        <div className="overview-card">
          <h3>Published Papers</h3>
          <p className="overview-count">{researchPapers.length}</p>
          <button onClick={() => setActiveTab('research')}>View All</button>
        </div>
        <div className="overview-card">
          <h3>Active Surveys</h3>
          <p className="overview-count">{surveys.length}</p>
          <button onClick={() => setActiveTab('surveys')}>View All</button>
        </div>
      </div>
      <div className="active-surveys-section">
        <h2>Recent Survey Responses</h2>
        <div className="surveys-grid">
          {surveys.map(survey => (
            <div key={survey._id} className="survey-card">
              <h3>{survey.title}</h3>
              <p>{survey.description}</p>
              <div className="card-actions">
                <button 
                  className="view-responses-btn"
                  onClick={() => handleViewSurveyResponses(survey)}
                >
                  <FaChartBar className="btn-icon" />
                  View Responses
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResearchPapers = () => (
    <div className="dashboard-content">
      <h2>My Research Papers</h2>
      <div className="papers-grid">
        {researchPapers.map(paper => (
          <div key={paper._id} className="paper-card">
            <h3>{paper.title}</h3>
            <p>{paper.description}</p>
            <div className="card-actions">
              <button onClick={() => navigate(`/publish/${paper._id}`)}>Edit</button>
              <button onClick={() => handleDeletePaper(paper._id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
        {researchPapers.length === 0 && (
          <p className="no-content">No research papers published yet.</p>
        )}
      </div>
    </div>
  );

  const renderSurveys = () => (
    <div className="dashboard-content">
      <h2>My Surveys</h2>
      <div className="surveys-grid">
        {surveys.map(survey => (
          <div key={survey._id} className="survey-card">
            <h3>{survey.title}</h3>
            <p>{survey.description}</p>
            <div className="card-actions">
              <button onClick={() => navigate(`/create-survey/${survey._id}`)}>Edit</button>
              <button 
                className="view-responses-btn"
                onClick={() => handleViewSurveyResponses(survey)}
              >
                View Responses
              </button>
              <button onClick={() => handleDeleteSurvey(survey._id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
        {surveys.length === 0 && (
          <p className="no-content">No surveys created yet.</p>
        )}
      </div>
    </div>
  );
  


  const renderSurveyAnalytics = () => {
    if (!selectedSurvey || !surveyAnalytics) return null;
    return (
      <div className="survey-analytics">
        <div className="analytics-header">
          <div className="analytics-header-info">
            <h2>{selectedSurvey.title} - Analysis</h2>
            <div className="survey-stats">
              <div className="stat-item">
                <FaUsers className="stat-icon" />
                <span className="stat-value">{surveyResponses.length}</span>
                <span className="stat-label">Total Responses</span>
              </div>
              <div className="stat-item">
                <FaChartBar className="stat-icon" />
                <span className="stat-value">{selectedSurvey.questions.length}</span>
                <span className="stat-label">Questions</span>
              </div>
            </div>
          </div>
          <div className="analytics-actions">
            <button onClick={generatePDF} className="download-pdf-btn">
              Download PDF Report
            </button>
          </div>
        </div>
        <div className="analytics-content">
          {selectedSurvey.questions.map((question, index) => {
            const analytics = surveyAnalytics[index];
            if (!analytics) return null;
            return (
              <div key={index} className="question-analytics">
                <div className="question-header">
                  <h3>Question {index + 1}</h3>
                  <span className="question-type-badge">{question.type}</span>
                </div>
                <p className="question-text">{question.text}</p>
                {question.type === 'text' ? (
                  <div className="text-responses">
                    <div className="responses-header">
                      <h4>
                        <FaQuoteLeft className="responses-icon" />
                        Text Responses ({analytics.responses.length})
                      </h4>
                    </div>
                    <div className="responses-grid">
                      {analytics.responses.map((response, i) => (
                        <div key={i} className="response-card">
                          <div className="response-number">#{i + 1}</div>
                          <div className="response-content">{response}</div>
                        </div>
                      ))}
                    </div>
                    {analytics.responses.length === 0 && (
                      <div className="no-responses">
                        <p>No text responses received yet.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="charts-container">
                    <div className="chart-wrapper">
                      <div className="chart-header">
                        <h4>Response Distribution (Bar Chart)</h4>
                      </div>
                      <Bar
                        data={{
                          labels: Object.keys(analytics.distribution),
                          datasets: [{
                            label: 'Responses',
                            data: Object.values(analytics.distribution),
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                          }],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            title: { display: false },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                stepSize: 1,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                    <div className="chart-wrapper">
                      <div className="chart-header">
                        <h4>Response Distribution (Pie Chart)</h4>
                      </div>
                      <Pie
                        data={{
                          labels: Object.keys(analytics.distribution),
                          datasets: [{
                            data: Object.values(analytics.distribution),
                            backgroundColor: [
                              'rgba(255, 99, 132, 0.7)',
                              'rgba(54, 162, 235, 0.7)',
                              'rgba(255, 206, 86, 0.7)',
                              'rgba(75, 192, 192, 0.7)',
                              'rgba(153, 102, 255, 0.7)',
                              'rgba(255, 159, 64, 0.7)',
                            ],
                            borderColor: [
                              'rgba(255, 99, 132, 1)',
                              'rgba(54, 162, 235, 1)',
                              'rgba(255, 206, 86, 1)',
                              'rgba(75, 192, 192, 1)',
                              'rgba(153, 102, 255, 1)',
                              'rgba(255, 159, 64, 1)',
                            ],
                            borderWidth: 2,
                          }],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { 
                              position: 'right',
                              labels: {
                                padding: 20,
                                usePointStyle: true,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderResearchProjects = () => (
    <div className="dashboard-content">
      <h2>My Research Projects</h2>
      <div className="papers-grid">
        {researchProjects.map(project => (
          <div key={project._id} className="paper-card">
            <div className="project-header-info">
              <h3>{project.title}</h3>
              <span className={`status-badge status-${project.status || 'planning'}`}>
                {project.status || 'Planning'}
              </span>
            </div>
            <div className="project-field-info">
              <strong>Field:</strong> {project.researchField}
            </div>
            <p>{project.description}</p>
            <div className="project-details">
              {project.startDate && (
                <div className="detail-item">
                  <strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}
                </div>
              )}
              {project.endDate && (
                <div className="detail-item">
                  <strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="card-actions">
              <button onClick={() => navigate(`/manage-research/${project._id}`)}>
                Manage Project
              </button>
              <button onClick={() => handleDeleteProject(project._id)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
        {researchProjects.length === 0 && (
          <div className="empty-state">
            <h3>No Research Projects Yet</h3>
            <p>Start your first research project to begin tracking your progress and timeline.</p>
            <button 
              className="primary-btn"
              onClick={() => navigate('/start-research')}
            >
              Start Your First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) return <div className="dashboard-loading">Loading dashboard data...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-layout">
      <DashboardNav />
      <div className="researcher-dashboard">
        <header className="dashboard-header">
          <h1>Research Dashboard</h1>
          <div className="quick-actions">
            <button className="start-new-research" onClick={() => handleQuickAction('start-research')}>Start New Research</button>
            <button onClick={() => handleQuickAction('publish')}>Publish Research</button>
            <button onClick={() => handleQuickAction('create-survey')}>Create Survey</button>
            <button onClick={() => handleQuickAction('support-survey')}>Support Survey</button>
            <button onClick={() => handleQuickAction('ai-assistance')}>AI Assistance</button>
          </div>
        </header>
        
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('overview');
              setSelectedSurvey(null);
            }}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('projects');
              setSelectedSurvey(null);
            }}
          >
            Research Projects
          </button>
          <button 
            className={`tab-btn ${activeTab === 'research' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('research');
              setSelectedSurvey(null);
            }}
          >
            Published Papers
          </button>
          <button 
            className={`tab-btn ${activeTab === 'surveys' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('surveys');
              setSelectedSurvey(null);
            }}
          >
            Surveys
          </button>
        </div>
      <main className="dashboard-main">
        {selectedSurvey ? renderSurveyAnalytics() : 
         activeTab === 'overview' ? renderOverview() :
         activeTab === 'projects' ? renderResearchProjects() :
         activeTab === 'research' ? renderResearchPapers() :
         renderSurveys()}
      </main>
      </div>
    </div>
  );
};

export default ResearcherDashboard;