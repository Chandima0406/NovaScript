import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  FaTachometerAlt,
  FaUsers, 
  FaChartLine, 
  FaFileAlt, 
  FaClipboardList,
  FaUserPlus,
  FaUserMinus,
  FaUserEdit,
  FaCheck,
  FaTimes,
  FaSearch,
  FaAngleLeft,
  FaAngleRight
} from 'react-icons/fa';
import { AuthContext } from '../AuthContext';
import { 
  getPlatformStats, 
  getAdminUsers, 
  updateUserRole, 
  toggleUserStatus, 
  broadcastNotification,
  getAdminProjects,
  getAdminSurveys,
  deleteResearchPaper,
  deleteSurvey
} from '../api';
import DashboardNav from '../components/DashboardNav';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersPagination, setUsersPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [usersFilter, setUsersFilter] = useState({
    role: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    targetRole: 'all'
  });
  const [notificationSent, setNotificationSent] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Content management state
  const [contentTab, setContentTab] = useState('papers');
  const [papers, setPapers] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState(null);
  const [papersPagination, setPapersPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [surveysPagination, setSurveysPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
  // Load platform stats when component mounts
  useEffect(() => {
    if (user && user.role === 'admin' && activeTab === 'dashboard') {
      fetchStats();
    }
  }, [user, activeTab]);
  
  // Load users when component mounts or when filter/pagination changes
  useEffect(() => {
    if (user && user.role === 'admin' && activeTab === 'users') {
      fetchUsers();
    }
  }, [user, activeTab, usersFilter, usersPagination.page]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Load content when content tab changes
  useEffect(() => {
    if (user && user.role === 'admin' && activeTab === 'content') {
      if (contentTab === 'papers') {
        fetchPapers();
      } else if (contentTab === 'surveys') {
        fetchSurveys();
      }
    }
  }, [user, activeTab, contentTab, papersPagination.page, surveysPagination.page]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Redirect if not admin or user not loaded
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getPlatformStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      setError('Failed to load platform statistics');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = {
        page: usersPagination.page,
        limit: usersPagination.limit,
        role: usersFilter.role === 'all' ? undefined : usersFilter.role,
        search: usersFilter.search || undefined,
        sortBy: usersFilter.sortBy,
        sortOrder: usersFilter.sortOrder
      };
      
      const response = await getAdminUsers(params);
      setUsers(response.data.users);
      setUsersPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Content management functions
  const fetchPapers = async () => {
    try {
      setContentLoading(true);
      setContentError(null);
      const params = {
        page: papersPagination.page,
        limit: papersPagination.limit
      };
      const response = await getAdminProjects(params);
      setPapers(response.data.projects || []);
      setPapersPagination({
        ...papersPagination,
        total: response.data.total || 0,
        pages: response.data.pages || 0
      });
    } catch (error) {
      console.error('Error fetching papers:', error);
      setContentError('Failed to load research papers');
    } finally {
      setContentLoading(false);
    }
  };
  
  const fetchSurveys = async () => {
    try {
      setContentLoading(true);
      setContentError(null);
      const params = {
        page: surveysPagination.page,
        limit: surveysPagination.limit
      };
      const response = await getAdminSurveys(params);
      setSurveys(response.data.surveys || []);
      setSurveysPagination({
        ...surveysPagination,
        total: response.data.total || 0,
        pages: response.data.pages || 0
      });
    } catch (error) {
      console.error('Error fetching surveys:', error);
      setContentError('Failed to load surveys');
    } finally {
      setContentLoading(false);
    }
  };
  
  const handleDeletePaper = async (paperId) => {
    if (window.confirm('Are you sure you want to delete this research paper?')) {
      try {
        await deleteResearchPaper(paperId);
        setPapers(papers.filter(p => p._id !== paperId));
        alert('Research paper deleted successfully');
      } catch (error) {
        console.error('Error deleting paper:', error);
        alert('Failed to delete research paper');
      }
    }
  };
  
  const handleDeleteSurvey = async (surveyId) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        await deleteSurvey(surveyId);
        setSurveys(surveys.filter(s => s._id !== surveyId));
        alert('Survey deleted successfully');
      } catch (error) {
        console.error('Error deleting survey:', error);
        alert('Failed to delete survey');
      }
    }
  };
  
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      setIsLoading(true);
      await updateUserRole(userId, newRole);
      setUsers(users.map(u => 
        u._id === userId ? { ...u, role: newRole } : u
      ));
      setEditingUser(null);
      alert(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update user role';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleUserStatus = async (userId, newStatus) => {
    try {
      setIsLoading(true);
      await toggleUserStatus(userId, newStatus);
      setUsers(users.map(u => 
        u._id === userId ? { ...u, active: newStatus } : u
      ));
      alert(`User account ${newStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update user status';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendNotification = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      await broadcastNotification(notification);
      setNotificationSent(true);
      setNotification({
        title: '',
        message: '',
        targetRole: 'all'
      });
      setTimeout(() => setNotificationSent(false), 5000);
    } catch (error) {
      console.error('Error sending notification:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send notification';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearchUsers = (e) => {
    e.preventDefault();
    setUsersPagination({
      ...usersPagination,
      page: 1
    });
    fetchUsers();
  };
  
  const renderDashboardTab = () => {
    if (isLoading) {
      return <div className="loading">Loading dashboard data...</div>;
    }
    
    if (error) {
      return <div className="error">{error}</div>;
    }
    
    if (!stats) {
      return null;
    }
    
    return (
      <div className="admin-dashboard-stats">
        <h2>Platform Overview</h2>
        
        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-card-header">
              <h3>Users</h3>
              <FaUsers className="stats-icon" />
            </div>
            <div className="stats-numbers">
              <div className="stat-item">
                <span className="stat-value">{stats.users.total}</span>
                <span className="stat-label">Total Users</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.users.researchers}</span>
                <span className="stat-label">Researchers</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.users.participants}</span>
                <span className="stat-label">Participants</span>
              </div>
            </div>
            <div className="stats-highlight">
              <FaUserPlus /> <span>{stats.users.newLastWeek} new users this week</span>
            </div>
          </div>
          
          <div className="stats-card">
            <div className="stats-card-header">
              <h3>Research Papers</h3>
              <FaFileAlt className="stats-icon" />
            </div>
            <div className="stats-numbers">
              <div className="stat-item wider">
                <span className="stat-value">{stats.projects.total}</span>
                <span className="stat-label">Total Papers</span>
              </div>
              <div className="stat-item wider">
                <span className="stat-value">{stats.projects.newLastWeek}</span>
                <span className="stat-label">New This Week</span>
              </div>
            </div>
          </div>
          
          <div className="stats-card">
            <div className="stats-card-header">
              <h3>Surveys</h3>
              <FaClipboardList className="stats-icon" />
            </div>
            <div className="stats-numbers">
              <div className="stat-item">
                <span className="stat-value">{stats.surveys.total}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.surveys.active}</span>
                <span className="stat-label">Active</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.surveys.totalResponses}</span>
                <span className="stat-label">Responses</span>
              </div>
            </div>
            <div className="stats-highlight">
              <FaChartLine /> <span>{stats.surveys.newLastWeek} new surveys this week</span>
            </div>
          </div>
        </div>
        
        <div className="admin-section">
          <h2>Send System Notification</h2>
          <div className="notification-form-container">
            <form onSubmit={handleSendNotification} className="notification-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={notification.title}
                  onChange={(e) => setNotification({...notification, title: e.target.value})}
                  required
                  placeholder="Notification title"
                />
              </div>
              
              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={notification.message}
                  onChange={(e) => setNotification({...notification, message: e.target.value})}
                  required
                  placeholder="Notification message"
                  rows="4"
                />
              </div>
              
              <div className="form-group">
                <label>Target Users</label>
                <select 
                  value={notification.targetRole}
                  onChange={(e) => setNotification({...notification, targetRole: e.target.value})}
                >
                  <option value="all">All Users</option>
                  <option value="researcher">Researchers Only</option>
                  <option value="user">Participants Only</option>
                  <option value="admin">Admins Only</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                className="notification-send-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Notification'}
              </button>
              
              {notificationSent && (
                <div className="notification-success">
                  <FaCheck /> Notification sent successfully!
                </div>
              )}
              
              {error && (
                <div className="notification-error">
                  <FaTimes /> {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  const renderUsersTab = () => {
    return (
      <div className="admin-users">
        <h2>User Management</h2>
        
        <div className="users-controls">
          <form onSubmit={handleSearchUsers} className="users-search">
            <div className="search-input-group">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search users by name or email"
                value={usersFilter.search}
                onChange={(e) => setUsersFilter({...usersFilter, search: e.target.value})}
              />
            </div>
            <button type="submit" className="search-btn">Search</button>
          </form>
          
          <div className="users-filters">
            <div className="filter-group">
              <label>Filter by Role:</label>
              <select 
                value={usersFilter.role}
                onChange={(e) => {
                  setUsersFilter({...usersFilter, role: e.target.value});
                  setUsersPagination({...usersPagination, page: 1});
                }}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="researcher">Researcher</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="loading">Loading users...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : users.length === 0 ? (
          <div className="empty-list">No users found matching your criteria</div>
        ) : (
          <>
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.full_name}</td>
                      <td>{user.email}</td>
                      <td>
                        {editingUser === user._id ? (
                          <select 
                            value={user.role}
                            onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                            className="role-select"
                          >
                            <option value="admin">Admin</option>
                            <option value="researcher">Researcher</option>
                            <option value="user">User</option>
                          </select>
                        ) : (
                          <span className={`role-badge ${user.role}`}>{user.role}</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                          {user.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="user-actions">
                          {editingUser === user._id ? (
                            <button 
                              onClick={() => setEditingUser(null)} 
                              className="cancel-btn"
                              title="Cancel"
                            >
                              Cancel
                            </button>
                          ) : (
                            <button 
                              onClick={() => setEditingUser(user._id)} 
                              className="edit-btn"
                              title="Edit role"
                              disabled={isLoading}
                            >
                              <FaUserEdit />
                            </button>
                          )}
                          
                          <button 
                            onClick={() => handleToggleUserStatus(user._id, !user.active)}
                            className={user.active ? 'deactivate-btn' : 'activate-btn'}
                            title={user.active ? 'Deactivate account' : 'Activate account'}
                            disabled={isLoading}
                          >
                            {user.active ? <FaUserMinus /> : <FaUserPlus />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {usersPagination.pages > 1 && (
              <div className="admin-pagination">
                <button
                  disabled={usersPagination.page === 1}
                  onClick={() => {
                    const newPage = usersPagination.page - 1;
                    setUsersPagination({...usersPagination, page: newPage});
                  }}
                  className="pagination-btn"
                >
                  <FaAngleLeft /> Previous
                </button>
                
                <span className="pagination-info">
                  Page {usersPagination.page} of {usersPagination.pages}
                </span>
                
                <button
                  disabled={usersPagination.page === usersPagination.pages}
                  onClick={() => {
                    const newPage = usersPagination.page + 1;
                    setUsersPagination({...usersPagination, page: newPage});
                  }}
                  className="pagination-btn"
                >
                  Next <FaAngleRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };
  
  const renderContentTab = () => {
    return (
      <div className="admin-content">
        <h2>Content Management</h2>
        
        <div className="content-tabs">
          <button 
            className={`content-tab ${contentTab === 'papers' ? 'active' : ''}`}
            onClick={() => setContentTab('papers')}
          >
            <FaFileAlt /> Research Papers
          </button>
          <button 
            className={`content-tab ${contentTab === 'surveys' ? 'active' : ''}`}
            onClick={() => setContentTab('surveys')}
          >
            <FaClipboardList /> Surveys
          </button>
        </div>
        
        <div className="content-tab-content">
          {contentTab === 'papers' && (
            <div className="papers-management">
              <div className="content-header">
                <h3>Research Papers ({papersPagination.total})</h3>
                <div className="content-controls">
                  <select 
                    value={papersPagination.limit}
                    onChange={(e) => {
                      setPapersPagination({
                        ...papersPagination, 
                        limit: parseInt(e.target.value),
                        page: 1
                      });
                    }}
                    className="items-per-page"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                  <button 
                    onClick={fetchPapers}
                    className="refresh-btn"
                    disabled={contentLoading}
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>
              
              {contentLoading ? (
                <div className="loading">Loading research papers...</div>
              ) : contentError ? (
                <div className="error">{contentError}</div>
              ) : papers.length === 0 ? (
                <div className="empty-list">No research papers found</div>
              ) : (
                <div className="content-table-container">
                  <table className="content-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Published</th>
                        <th>Downloads</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {papers.map(paper => (
                        <tr key={paper._id}>
                          <td>
                            <div className="content-title">
                              {paper.title}
                              {paper.description && (
                                <div className="content-description">
                                  {paper.description.substring(0, 100)}...
                                </div>
                              )}
                            </div>
                          </td>
                          <td>{paper.author?.name || 'Unknown'}</td>
                          <td>
                            <span className="category-badge">
                              {paper.category || 'General'}
                            </span>
                          </td>
                          <td>{new Date(paper.createdAt).toLocaleDateString()}</td>
                          <td>{paper.downloads || 0}</td>
                          <td>
                            <div className="content-actions">
                              <button 
                                onClick={() => window.open(`/research/${paper._id}`, '_blank')}
                                className="view-btn"
                                title="View paper"
                              >
                                👁️ View
                              </button>
                              <button 
                                onClick={() => handleDeletePaper(paper._id)}
                                className="delete-btn"
                                title="Delete paper"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {papersPagination.pages > 1 && (
                <div className="admin-pagination">
                  <button
                    disabled={papersPagination.page === 1}
                    onClick={() => {
                      setPapersPagination({...papersPagination, page: papersPagination.page - 1});
                    }}
                    className="pagination-btn"
                  >
                    <FaAngleLeft /> Previous
                  </button>
                  
                  <span className="pagination-info">
                    Page {papersPagination.page} of {papersPagination.pages} 
                    ({papersPagination.total} total papers)
                  </span>
                  
                  <button
                    disabled={papersPagination.page === papersPagination.pages}
                    onClick={() => {
                      setPapersPagination({...papersPagination, page: papersPagination.page + 1});
                    }}
                    className="pagination-btn"
                  >
                    Next <FaAngleRight />
                  </button>
                </div>
              )}
            </div>
          )}
          
          {contentTab === 'surveys' && (
            <div className="surveys-management">
              <div className="content-header">
                <h3>Surveys ({surveysPagination.total})</h3>
                <div className="content-controls">
                  <select 
                    value={surveysPagination.limit}
                    onChange={(e) => {
                      setSurveysPagination({
                        ...surveysPagination, 
                        limit: parseInt(e.target.value),
                        page: 1
                      });
                    }}
                    className="items-per-page"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                  <button 
                    onClick={fetchSurveys}
                    className="refresh-btn"
                    disabled={contentLoading}
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>
              
              {contentLoading ? (
                <div className="loading">Loading surveys...</div>
              ) : contentError ? (
                <div className="error">{contentError}</div>
              ) : surveys.length === 0 ? (
                <div className="empty-list">No surveys found</div>
              ) : (
                <div className="content-table-container">
                  <table className="content-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Creator</th>
                        <th>Status</th>
                        <th>Responses</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {surveys.map(survey => (
                        <tr key={survey._id}>
                          <td>
                            <div className="content-title">
                              {survey.title}
                              {survey.description && (
                                <div className="content-description">
                                  {survey.description.substring(0, 100)}...
                                </div>
                              )}
                            </div>
                          </td>
                          <td>{survey.creator?.full_name || 'Unknown'}</td>
                          <td>
                            <span className={`status-badge ${survey.status}`}>
                              {survey.status}
                            </span>
                          </td>
                          <td>{survey.responseCount || 0}</td>
                          <td>{new Date(survey.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="content-actions">
                              <button 
                                onClick={() => window.open(`/survey/${survey._id}`, '_blank')}
                                className="view-btn"
                                title="View survey"
                              >
                                👁️ View
                              </button>
                              <button 
                                onClick={() => handleDeleteSurvey(survey._id)}
                                className="delete-btn"
                                title="Delete survey"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {surveysPagination.pages > 1 && (
                <div className="admin-pagination">
                  <button
                    disabled={surveysPagination.page === 1}
                    onClick={() => {
                      setSurveysPagination({...surveysPagination, page: surveysPagination.page - 1});
                    }}
                    className="pagination-btn"
                  >
                    <FaAngleLeft /> Previous
                  </button>
                  
                  <span className="pagination-info">
                    Page {surveysPagination.page} of {surveysPagination.pages} 
                    ({surveysPagination.total} total surveys)
                  </span>
                  
                  <button
                    disabled={surveysPagination.page === surveysPagination.pages}
                    onClick={() => {
                      setSurveysPagination({...surveysPagination, page: surveysPagination.page + 1});
                    }}
                    className="pagination-btn"
                  >
                    Next <FaAngleRight />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="admin-dashboard-container">
      <DashboardNav />
      <div className="admin-dashboard-content">
        <h1>Admin Dashboard</h1>
        
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaTachometerAlt /> Overview
          </button>
          <button 
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers /> Users
          </button>
          <button 
            className={`admin-tab ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <FaFileAlt /> Content
          </button>
        </div>
        
        <div className="admin-tab-content">
          {activeTab === 'dashboard' && renderDashboardTab()}
          {activeTab === 'users' && renderUsersTab()}
          {activeTab === 'content' && renderContentTab()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
