import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo1.jpg'; // your logo
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="header-banner">
      <div className="header-content">
        <img src={logoImg} alt="Seibab Kennel Logo" className="header-logo" />
        <div className="header-text">
          <h1>Seibab Kennel</h1>
          <p>Best and Most Affordable Prices</p>
        </div>
      </div>
      <nav className="nav-menu">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/info" className="nav-link">Seibab Information</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/contact" className="nav-link nav-contact-button">Contact Us</Link>
      </nav>
    </header>
  );
};

export default Navbar;
