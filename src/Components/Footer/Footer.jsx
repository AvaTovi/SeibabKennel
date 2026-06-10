import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h2>Seibab Kennel</h2>
          <p>Extreme / XL American Bullies raised with quality and care.</p>
        </div>

        <nav className="footer-nav">
          <Link to="/" className="footer-link">
            Home
          </Link>

          <Link to="/available-puppies" className="footer-link">
            Available Puppies
          </Link>

          <Link to="/about" className="footer-link">
            About
          </Link>

          <Link to="/contact" className="footer-link">
            Contact
          </Link>
        </nav>
      </div>

      <div className="footer-bottom">
        <p>Seibab Kennel Inc. © 2023</p>
        <p>Phone: (555) 123-4567 | Email: info@seibabkennel.com</p>
      </div>
    </footer>
  );
};

export default Footer;