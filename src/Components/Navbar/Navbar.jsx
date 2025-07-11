import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => (
  <header className="header-banner">
    <div className="header-content">
      <img src="/logo.png" alt="Seibab Kennel logo" className="header-logo" />
      <div className="header-text">
        <h1>Seibab Kennel</h1>
        <p>Best and Affordable Prices</p>
      </div>
    </div>
    <nav className="nav-menu">
      <NavLink to="/" className="nav-link">Home</NavLink>
      <NavLink to="/available-puppies" className="nav-link">Available Puppies</NavLink>
      <NavLink to="/about" className="nav-link">About</NavLink>
      <Link   to="/contact" className="nav-contact-button">Contact Us</Link>
    </nav>
  </header>
);

export default Navbar;
