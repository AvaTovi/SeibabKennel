import React from 'react';
import './Hero.css';
import { Link } from 'react-router-dom';

const Hero = ({ heroData }) => {
  return (
    <div className="hero">
      <div className="hero-text">
        <p>{heroData.text1}</p>
        <p>{heroData.text2}</p>
      </div>

      <div className="hero-bottom-navbar">
        <div className="hero-bottom-left">
          <div className="hero-info-text">
            <p>Seibab Kennel Inc. © 2023</p>
            <p>Phone: (555) 123-4567</p>
            <p>Email: info@seibabkennel.com</p>
          </div>
        </div>

        <div className="hero-bottom-right">
          <ul className="hero-info-links">
            <li><Link to="/info">Seibab Information</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Hero;
