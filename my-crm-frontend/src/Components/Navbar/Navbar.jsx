import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar")
    navbar.classList.toggle("active", window.scrollY > 100)
  });
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Cantar</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="navbar-buttons">
        <Link to="/login" className="btn">Login</Link>
        <Link to="/register" className="btn">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
