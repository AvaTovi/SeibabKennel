// src/Components/Navbar/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo1.jpg";    // ← make sure this matches your filename exactly
import "./Navbar.css";

const Navbar = () => (
  <header className="header-banner">
    <div className="header-content">
      <img src={logo} alt="Seibab Kennel logo" className="header-logo" />
      <div className="header-text">
        <h1>Seibab Kennel</h1>
        <p>Best and Affordable Prices</p>
      </div>
    </div>
    <nav className="nav-menu">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/available-puppies" className="nav-link">Available Puppies</Link>
      <Link to="/about" className="nav-link">About</Link>
      <Link to="/contact" className="nav-contact-button">Contact Us</Link>
    </nav>
  </header>
);

export default Navbar;
