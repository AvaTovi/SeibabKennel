// src/Components/Background/Background.jsx
import React from 'react';
import './Background.css';
import video1 from '../../assets/SK1.mp4';            // ← put this back

const Background = ({ playStatus }) => {
  if (!playStatus) return null;

  return (
    <div className="background-frame">
      <video className="background-video" autoPlay loop muted>
        <source src={video1} type="video/mp4" />
      </video>
    </div>
  );
};

export default Background;
