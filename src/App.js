import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext, AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchEngine from './pages/SearchEngine';
import PublishResearch from './pages/PublishResearch';
import StartNewResearch from './pages/StartNewResearch';
import ManageResearch from './pages/ManageResearch';
import SupportSurvey from './pages/SupportSurvey';
import CreateSurvey from './pages/CreateSurvey';
import AnswerSurvey from './pages/AnswerSurvey';
import ResearcherDashboard from './pages/ResearcherDashboard';
import AIAssistant from './pages/AIAssistant';
import Profile from './pages/Profile';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboard from './pages/AdminDashboard';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Footer from './components/Footer';
import './App.css';

// ProtectedRoute component to restrict access
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

// Layout component with Navbar and Footer
const DefaultLayout = () => {
  return (
    <>
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Dashboard routes - without global navbar and footer */}
            <Route
              path="/researcher-dashboard"
              element={
                <ProtectedRoute>
                  <ResearcherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* All other routes with the DefaultLayout (navbar+footer) */}
            <Route element={<DefaultLayout />}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<div>Forgot Password Page (Placeholder)</div>} />
              
              {/* Protected Routes */}
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <SearchEngine />
                  </ProtectedRoute>
                }
              />              <Route
                path="/publish"
                element={
                  <ProtectedRoute>
                    <PublishResearch />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/publish/:projectId"
                element={
                  <ProtectedRoute>
                    <PublishResearch />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/start-research"
                element={
                  <ProtectedRoute>
                    <StartNewResearch />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-research/:projectId"
                element={
                  <ProtectedRoute>
                    <ManageResearch />              </ProtectedRoute>
                }
              />
              <Route
                path="/support-survey"
                element={
                  <ProtectedRoute>
                    <SupportSurvey />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-survey"
                element={
                  <ProtectedRoute>
                    <CreateSurvey />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-survey/:surveyId"
                element={
                  <ProtectedRoute>
                    <CreateSurvey />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/answer-survey/:surveyId"
                element={
                  <ProtectedRoute>
                    <AnswerSurvey />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-assistant"
                element={
                  <ProtectedRoute>
                    <AIAssistant />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
