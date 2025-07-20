import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Handle FormData for multipart requests
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  return config;
});

// User
export const register = (data) => API.post('/register', data);
export const login = (data) => API.post('/login', data);
export const getUser = () => API.get('/user');
export const updateUserProfile = (data) => API.put('/user/profile', data);

// Projects
export const getProjects = (params = {}) => API.get('/projects', { params });
export const publishProject = (data) => API.post('/projects', data);
export const getProjectById = (projectId) => API.get(`/projects/${projectId}`);
export const updateProject = (projectId, data) => API.put(`/projects/${projectId}`, data);
export const getResearchPapers = () => API.get('/projects/user');
export const deleteResearchPaper = (paperId) => API.delete(`/projects/${paperId}`);

// Research Projects
export const createResearchProject = (data) => API.post('/research-projects', data);
export const getUserResearchProjects = () => API.get('/research-projects/user');
export const getResearchProjectById = (projectId) => API.get(`/research-projects/${projectId}`);
export const updateResearchProject = (projectId, data) => API.put(`/research-projects/${projectId}`, data);
export const updateResearchProjectTimeline = (projectId, timeline) => API.put(`/research-projects/${projectId}/timeline`, { timeline });
export const deleteResearchProject = (projectId) => API.delete(`/research-projects/${projectId}`);
export const getResearchProjectStats = () => API.get('/research-projects/stats');

// Surveys
export const createSurvey = (data) => API.post('/surveys', data);
export const updateSurvey = (surveyId, data) => API.put(`/surveys/${surveyId}`, data);
export const getSurveyById = (surveyId) => API.get(`/surveys/${surveyId}`);
export const getAllSurveys = () => API.get('/surveys');
export const getAnsweredSurveys = () => API.get('/surveys/user/answered');
export const submitSurveyResponse = (surveyId, data) => API.post(`/surveys/${surveyId}/respond`, data);
export const getUserSurveys = () => API.get('/surveys/user');
export const deleteSurvey = (surveyId) => API.delete(`/surveys/${surveyId}`);
export const getSurveyResponses = (surveyId) => API.get(`/surveys/${surveyId}/responses`);
export const getSurveyAnalytics = (surveyId) => API.get(`/surveys/${surveyId}/analytics`);

// AI Assistant
export const sendAIMessage = (data) => API.post('/ai/chat', data);
export const generateAIProposal = (data) => API.post('/ai/generate-proposal', data);
export const getAIReviewForPaper = (data) => API.post('/ai/review-paper', data);
export const getAIStatus = () => API.get('/ai/status');
export const switchAIProvider = (provider) => API.post('/ai/switch-provider', { provider });

// Notifications
export const getUserNotifications = (page = 1, limit = 10, onlyUnread = false) => 
  API.get(`/notifications?page=${page}&limit=${limit}&onlyUnread=${onlyUnread}`);
export const markNotificationAsRead = (notificationId) => 
  API.patch(`/notifications/${notificationId}/read`);
export const markAllNotificationsAsRead = () => 
  API.patch('/notifications/read-all');
export const deleteNotification = (notificationId) => 
  API.delete(`/notifications/${notificationId}`);

// Milestones
export const getMilestones = (params = {}) => API.get('/milestones', { params });
export const createMilestone = (data) => API.post('/milestones', data);
export const updateMilestone = (milestoneId, data) => API.put(`/milestones/${milestoneId}`, data);
export const deleteMilestone = (milestoneId) => API.delete(`/milestones/${milestoneId}`);
  
// Admin API
export const getPlatformStats = () => API.get('/admin/stats');
export const getAdminUsers = (params = {}) => API.get('/admin/users', { params });
export const updateUserRole = (userId, role) => API.put(`/admin/users/${userId}/role`, { role });
export const toggleUserStatus = (userId, status) => API.put(`/admin/users/${userId}/status`, { status });
export const getAdminProjects = (params = {}) => API.get('/admin/projects', { params });
export const getAdminSurveys = (params = {}) => API.get('/admin/surveys', { params });
export const broadcastNotification = (data) => API.post('/admin/notifications/broadcast', data);

// Budget API
export const getProjectBudgets = (projectId) => API.get(`/budgets/project/${projectId}`);
export const getBudgetSummary = (projectId) => API.get(`/budgets/project/${projectId}/summary`);
export const addBudgetEntry = (projectId, data) => API.post(`/budgets/project/${projectId}`, data);
export const updateBudgetEntry = (projectId, budgetId, data) => API.put(`/budgets/project/${projectId}/${budgetId}`, data);
export const deleteBudgetEntry = (projectId, budgetId) => API.delete(`/budgets/project/${projectId}/${budgetId}`);

export default API;