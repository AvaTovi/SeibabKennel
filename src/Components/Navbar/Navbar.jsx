import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo1.jpg";
import "./Navbar.css";

const Navbar = () => {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="Seibab Kennel logo" className="navbar-logo" />
        <div>
          <h1>Seibab Kennel</h1>
          <p>Extreme / XL American Bullies</p>
        </div>
      </Link>

      <nav className="nav-menu">
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>

        <NavLink to="/available-puppies" className="nav-link">
          Available Puppies
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