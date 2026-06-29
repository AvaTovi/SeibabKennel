import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo1.jpg";
import "./Navbar.css";

const Navbar = () => {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="Seibab Kennel Logo" className="navbar-logo" />

        <div>
          <h1>Seibab Kennel</h1>
          <p>Extreme / XL American Bullies</p>
        </div>
      </Link>

      <nav className="nav-menu">
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>

        <NavLink to="/whats-new" className="nav-link">
          What&apos;s New
        </NavLink>

        <NavLink to="/available-puppies" className="nav-link">
          Available Puppies
        </NavLink>

        <NavLink to="/studs" className="nav-link">
          Studs
        </NavLink>

        <NavLink to="/puppy-info" className="nav-link">
          Puppy Info
        </NavLink>

        <NavLink to="/reviews" className="nav-link">
          Reviews
        </NavLink>

        <NavLink to="/about" className="nav-link">
          About
        </NavLink>

        <NavLink to="/contact" className="nav-contact-button">
          Contact Us
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
