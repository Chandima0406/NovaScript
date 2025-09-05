import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import NotificationsPanel from './NotificationsPanel';
import '../styles/Navbar.css';
import profilePic from '../assets/profile-pic-placeholder.jpg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Simplified navbar for auth pages (login/register only)
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/" className="logo">NovaScript</Link>
            <p className="logo-subtitle">AI-driven Research Management</p>
          </div>
          <Link to="/" className="back-home">Back To Home</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">NovaScript</Link>
        <div className="hamburger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <Link to="/home" className="nav-link">Home</Link>
          {user ? (
            <>              <Link to="/search" className="nav-link">Search</Link>
              <Link to="/ai-assistant" className="nav-link">AI Assistant</Link>              {user.role === 'researcher' && (
                <>
                  <Link to="/researcher-dashboard" className="nav-link">Dashboard</Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link to="/admin-dashboard" className="nav-link">Admin</Link>
                </>
              )}
              <NotificationsPanel onNavigate={(path) => navigate(path)} />
              <div className="profile-section">
                <img src={profilePic} alt="Profile" className="profile-pic" />
                <div className="profile-dropdown">
                  <span className="dropdown-name">{user.full_name}</span>
                  <Link to="/profile" className="dropdown-link">Profile</Link>
                  <button onClick={handleLogout} className="dropdown-link logout-btn">Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
              <Link to="/login" className="sign-in-btn">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;