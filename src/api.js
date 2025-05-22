// G:\NovaScript\client\src\api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const register = (data) => API.post('/register', data);
export const login = (data) => API.post('/login', data);
export const publishProject = (data) => API.post('/projects', data);
export const getProjects = () => API.get('/projects');
export const getProjectById = (projectId) => API.get(`/projects/${projectId}`);
export const updateProject = (projectId, data) => API.put(`/projects/${projectId}`, data);
export const deleteProject = (projectId) => API.delete(`/projects/${projectId}`);
export const createSurvey = (data) => API.post('/surveys', data);
export const getSurveyById = (surveyId) => API.get(`/surveys/${surveyId}`);
export const updateSurvey = (surveyId, data) => API.put(`/surveys/${surveyId}`, data);
export const deleteSurvey = (surveyId) => API.delete(`/surveys/${surveyId}`);
export const getUserSurveys = () => API.get('/surveys/user');
export const getAnsweredSurveys = () => API.get('/surveys/user/answered');
export const getAllSurveys = () => API.get('/surveys');
export const submitSurveyResponse = (surveyId, data) => API.post(`/surveys/${surveyId}/respond`, data);
export const getSurveyResponses = (surveyId) => API.get(`/surveys/${surveyId}/responses`);
export const getSurveyAnalytics = (surveyId) => API.get(`/surveys/${surveyId}/analytics`);

export default API;