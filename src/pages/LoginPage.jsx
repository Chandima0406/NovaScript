import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <main className="login-main">
        <h1 className="login-title">Log In To NovaScript</h1>
        <form className="login-form">
          <div className="form-group">
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email/Username"
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
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" name="remember" />
              Remember Me
            </label>
            <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
          </div>
          <button type="submit" className="login-button">Log In</button>
        </form>
        <p className="signup-prompt">
          Don’t Have An Account Yet? <Link to="/register" className="signup-link">Sign Up</Link>
        </p>
      </main>
    </div>
  );
};

export default LoginPage;