import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, updateUserProfile } from '../api';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }        const response = await getUser();
        setUser(response.data);
        setFormData({
          full_name: response.data.full_name,
          email: response.data.email,
          phone: response.data.phone,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } catch (err) {
        console.error('Error fetching user:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to fetch user data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    // Reset form validation messages
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Validate new passwords if provided
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (!formData.currentPassword) {
        setError('Please enter your current password');
        return;
      }
    }

    try {
      // Create update object with only changed fields
      const updateData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone
      };
      
      // Only include password fields if changing password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      const response = await updateUserProfile(updateData);
      setUser(response.data);
      setSuccessMessage('Profile updated successfully');
      setIsEditing(false);
      
      // Update auth context if name changed
      dispatch({ 
        type: 'UPDATE_USER', 
        payload: { name: response.data.full_name } 
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update profile');
      }
    }
  };
  const navigateToDashboard = () => {
    if (user.role === 'researcher') {
      navigate('/researcher-dashboard');
    } else if (user.role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/search');
    }
  };

  if (loading) return <div className="profile-container loading">Loading...</div>;

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      {user && !isEditing && (
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <img 
                src={require('../assets/profile-pic-placeholder.jpg')} 
                alt="Profile"
              />
            </div>
            <div className="profile-name">
              <h2>{user.full_name}</h2>
              <span className="profile-role">{user.role}</span>
            </div>
          </div>
          
          <div className="profile-details">
            <div className="profile-info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Phone</span>
              <span className="info-value">{user.phone}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Account Type</span>
              <span className="info-value capitalize">{user.role}</span>
            </div>
          </div>
          
          <div className="profile-actions">
            <button onClick={toggleEditMode} className="edit-profile-btn">
              Edit Profile
            </button>
            <button onClick={navigateToDashboard} className="dashboard-btn">
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
      
      {user && isEditing && (
        <div className="profile-card">
          <form onSubmit={handleSubmit} className="profile-edit-form">
            <h2>Edit Profile</h2>
            
            <div className="form-group">
              <label htmlFor="full_name">Full Name</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="password-change-section">
              <h3>Change Password (Optional)</h3>
              
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  minLength="6"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength="6"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" onClick={toggleEditMode} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;