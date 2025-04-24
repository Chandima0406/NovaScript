import React from 'react';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">NovaScript</div>
      <ul className="navbar-links">
        <li><a href="/">HOME</a></li>
        <li><a href="/about">ABOUT</a></li>
        <li><a href="/contact">CONTACT</a></li>
        <li><a href="/">HOME</a></li>
      </ul>
      <button className="navbar-signup">Sign Up</button>
    </nav>
  );
}

export default Navbar;