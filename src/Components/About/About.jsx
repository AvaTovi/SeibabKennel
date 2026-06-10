import React from "react";
import logo from "../../assets/logo1.jpg";
import "./About.css";

export default function About() {
  return (
    <main className="about-page">
      <section className="about-card">
        <div className="about-logo-container">
          <img src={logo} alt="Seibab Kennel Logo" className="about-logo" />
        </div>

        <div className="about-content">
          <p className="eyebrow">About Us</p>
          <h1>About Seibab Kennel</h1>

          <p>
            Seibab Kennel Inc. is dedicated to breeding top-quality Extreme / XL
            American Bullies with strong structure, clean presentation, and
            family-friendly temperaments.
          </p>

          <p>
            Our goal is to raise confident, loyal companions that are healthy,
            well-socialized, and ready to become part of loving homes.
          </p>

          <p>
            Located in Dallas, TX, we take pride in our breeding standards,
            communication, and long-term support for every puppy we place.
          </p>
        </div>
      </section>
    </main>
  );
}