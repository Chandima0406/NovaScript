import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    // Simulate successful registration by navigating to login page
    navigate('/login');
  };

  return (
    <div className="register-page">
      <main className="register-main">
        <h1 className="register-title">Sign Up For NovaScript</h1>
        {error && <p className="error-message">{error}</p>}
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="full-name"
              name="full_name"
              placeholder="Full Name"
              className="form-input"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Phone Number"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="confirm-password"
              name="confirm_password"
              placeholder="Confirm Password"
              className="form-input"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <select
              id="role"
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select your Role</option>
              <option value="researcher">Researcher</option>
              <option value="user">User</option>
            </select>
          </div>
          <button type="submit" className="register-button">Register</button>
        </form>
        <p className="login-prompt">
          Already Have An Account? <Link to="/login" className="login-link">Log In</Link>
        </p>
      </main>
    </div>
  );
};

export default RegisterPage;