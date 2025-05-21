import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchEngine from './pages/SearchEngine';
import PublishResearch from './pages/PublishResearch';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import AIAssistant from './pages/AIAssistant';
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
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/forgot-password" element={<div>Forgot Password Page (Placeholder)</div>} />
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;