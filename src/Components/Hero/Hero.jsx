// src/Components/Hero/Hero.jsx
import React from 'react';
import './Hero.css';

const Hero = ({ heroData }) => {
  return (
    <div className="hero">
      <div className="hero-text">
        <p>{heroData.text1}</p>
        <p>{heroData.text2}</p>
      </div>
      {/* ↓ no more bottom navbar here ↓ */}
    </div>
  );
};

export default Hero;
