import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  return (
    <div className="register-page">
      <main className="register-main">
        <h1 className="register-title">Sign Up For NovaScript</h1>
        <form className="register-form">
          <div className="form-group">
            <input
              type="text"
              id="full-name"
              name="full-name"
              placeholder="Full Name"
              className="form-input"
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
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="Confirm Password"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <select
              id="role"
              name="role"
              className="form-input"
              required
            >
              <option value="" disabled selected>Select your Role</option>
              <option value="researcher">Researcher</option>
              <option value="student">Student</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
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