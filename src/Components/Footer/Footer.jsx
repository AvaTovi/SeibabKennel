import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <nav className="footer-nav">
      <Link to="/" className="footer-link">Home</Link>
      <Link to="/info" className="footer-link">Seibab Information</Link>
      <Link to="/about" className="footer-link">About</Link>
      <Link to="/contact" className="footer-link">Contact</Link>
    </nav>
    <div className="footer-info">
      <p>Seibab Kennel Inc. © 2023</p>
      <p>Phone: (555) 123-4567</p>
      <p>Email: info@seibabkennel.com</p>
    </div>
  </footer>
);

export default Footer;
