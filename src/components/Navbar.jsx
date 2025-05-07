import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

// Placeholder profile picture (you can replace this with the actual user image)
import profilePic from '../assets/profile-pic-placeholder.jpg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null); // User state kept for UI purposes
  const location = useLocation();

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Handle logout (simplified without localStorage)
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {isAuthPage ? (
          <>
            <div className="navbar-logo">
              <Link to="/" className="logo">NovaScript</Link>
              <p className="logo-subtitle">AI-driven Research Management</p>
            </div>
            <Link to="/" className="back-home">Back To Home</Link>
          </>
        ) : (
          <>
            <Link to="/" className="logo">NovaScript</Link>
            <div className="hamburger" onClick={toggleMenu}>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
            <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
              <Link to="/home" className="nav-link">Home</Link>
              <Link to="/home" className="nav-link">About</Link>
              <Link to="/home" className="nav-link">Contact</Link>
              <Link to="/home" className="nav-link">Home</Link>
              {user ? (
                <div className="profile-section">
                  <img src={profilePic} alt="Profile" className="profile-pic" />
                  <div className="profile-dropdown">
                    <Link to="/profile" className="dropdown-link">Profile</Link>
                    <button onClick={handleLogout} className="dropdown-link logout-btn">Logout</button>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/login" className="sign-in-btn">Login</Link>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;