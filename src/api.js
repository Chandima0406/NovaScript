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

// Projects
export const getProjects = () => API.get('/projects');
export const publishProject = (data) => API.post('/projects', data);
export const getProjectById = (projectId) => API.get(`/projects/${projectId}`);
export const updateProject = (projectId, data) => API.put(`/projects/${projectId}`, data);
export const getResearchPapers = () => API.get('/projects/user');
export const deleteResearchPaper = (paperId) => API.delete(`/projects/${paperId}`);

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

export default API;