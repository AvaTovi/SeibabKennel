import React from "react";
import logo from "../../assets/logo1.jpg"; // adjust path/name if needed
import "./About.css";

export default function About() {
  return (
    <main className="about-page">
      {/* Logo at top */}
      <div className="about-logo-container">
        <img
          src={logo}
          alt="Seibab Kennel Logo"
          className="about-logo"
        />
      </div>

      {/* Page content */}
      <div className="about-content">
        <h1>About Seibab Kennel</h1>
        <p>
          Seibab Kennel Inc. is dedicated to breeding top-quality XL American Bullies 
          with championship bloodlines, impeccable health testing, and exceptional temperaments. 
          Since 2023, our mission has been to raise strong, loving companions who thrive as 
          part of your family.
        </p>
        <p>
          Located in Dallas, TX, we pride ourselves on our ethical breeding practices, 
          personalized follow-up support, and lifetime commitment to every puppy we place.
        </p>
      </div>
    </main>
  );
}
