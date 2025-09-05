import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaSearch, FaFileUpload, FaPoll, FaHandsHelping, FaRobot, FaBell, FaSignOutAlt, FaUserShield, FaMoneyBillWave } from 'react-icons/fa';
import { AuthContext } from '../AuthContext';
import '../styles/DashboardNav.css';

const DashboardNav = () => {  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isResearcher = user && user.role === 'researcher';
  const isAdmin = user && user.role === 'admin';
  
  return (
    <div className="dashboard-nav">
      <div className="dashboard-nav-header">
        <div className="dashboard-logo">
          <Link to="/">NovaScript</Link>
        </div>
        <div className="dashboard-user">
          <div className="dashboard-user-info">
            <h3>{user?.full_name || 'User'}</h3>
            <span className="role-badge">{user?.role || 'Guest'}</span>
          </div>
        </div>
      </div>
        <nav className="dashboard-menu">
        <ul>          <li>
            <Link to={isResearcher ? "/researcher-dashboard" : (isAdmin ? "/admin-dashboard" : "/search")} className="menu-item">
              <FaTachometerAlt className="menu-icon" />
              {isResearcher || isAdmin ? 'Dashboard' : 'Search'}
            </Link>
          </li>
            {isAdmin && (
            <li>
              <Link to="/admin-dashboard" className="menu-item">
                <FaUserShield className="menu-icon" />
                Admin Panel
              </Link>
            </li>
            )}
            <li>
            <Link to="/profile" className="menu-item">
              <FaUser className="menu-icon" />
              My Profile
            </Link>
          </li>
            <li>
            <Link to="/search" className="menu-item">
              <FaSearch className="menu-icon" />
              Search Papers
            </Link>
          </li>
          
          {isResearcher ? (
            <>              <li>
                <Link to="/publish" className="menu-item">
                  <FaFileUpload className="menu-icon" />
                  Publish Research
                </Link>
              </li>
                <li>
                <Link to="/create-survey" className="menu-item">
                  <FaPoll className="menu-icon" />
                  Create Survey
                </Link>
              </li>
            </>
          ) : (            <li>
              <Link to="/support-survey" className="menu-item">
                <FaHandsHelping className="menu-icon" />
                Participate in Surveys
              </Link>
            </li>
          )}            <li>
            <Link to="/ai-assistant" className="menu-item">
              <FaRobot className="menu-icon" />
              AI Assistant
            </Link>
          </li>
            <li>
            <Link to="/notifications" className="menu-item">
              <FaBell className="menu-icon" />
              Notifications
            </Link>
          </li>
        </ul>
          <div className="dashboard-nav-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt className="menu-icon" />
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default DashboardNav;
