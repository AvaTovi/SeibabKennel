import React from 'react';
import './About.css';

const About = () => {
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'black'}}>
        <div className="about-page">
      <h1>About Seibab Kennel</h1>
      <p>
        At Seibab Kennel, we specialize in responsibly raising and caring for some of the most beloved and respected dog breeds. 
        Our passion is rooted in health, temperament, and building lifelong bonds between people and pets.
      </p>
      <p>
        Since our founding, we've been committed to ethical breeding practices, transparency, and community education. 
        Whether you're looking for a loyal companion or seeking advice on responsible pet ownership, we're here to help.
      </p>
    </div>
    </div>
  );
};

export default About;
