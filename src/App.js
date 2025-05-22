import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchEngine from './pages/SearchEngine';
import PublishResearch from './pages/PublishResearch';
import SupportSurvey from './pages/SupportSurvey';
import CreateSurvey from './pages/CreateSurvey';
import AnswerSurvey from './pages/AnswerSurvey';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search" element={<SearchEngine />} />
            <Route path="/publish" element={<PublishResearch />} />
            <Route path="/publish/:projectId" element={<PublishResearch />} />
            <Route path="/support-survey" element={<SupportSurvey />} />
            <Route path="/create-survey" element={<CreateSurvey />} />
            <Route path="/answer-survey/:surveyId" element={<AnswerSurvey />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/forgot-password" element={<div>Forgot Password Page (Placeholder)</div>} />
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;