import React, { useState } from "react";
import logo from "../../assets/logo1.jpg";
import "./About.css";

export default function About() {
  const [abkcLogoError, setAbkcLogoError] = useState(false);

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

      <section className="standards-section">
        <div className="standards-heading">
          <p className="eyebrow">Standards & Care</p>
          <h2>Built Around Trust, Health, and Quality</h2>
          <p>
            Our program is focused on responsible ownership, strong structure,
            stable temperaments, and clear communication with every family.
          </p>
        </div>

        <div className="standards-grid">
          <article className="standard-card ABKC-card">
            <div className="standard-icon-box">
              {!abkcLogoError ? (
                <img
                  src="/ABKC-logo.png"
                  alt="ABKC Logo"
                  className="ABKC-logo"
                  onError={() => setAbkcLogoError(true)}
                />
              ) : (
                <span>ABKC</span>
              )}
            </div>

            <div>
              <h3>ABKC Registered</h3>
              <p>
                Seibab Kennel dogs are registered with the ABKC. We focus on
                producing XL American Bullies with quality structure, presence,
                and family-ready temperaments.
              </p>
            </div>
          </article>

          <article className="standard-card">
            <div className="standard-icon-box">
              <span>✓</span>
            </div>

            <div>
              <h3>Health Tested</h3>
              <p>
                We care about long-term health and responsible pairings. Our
                dogs are health tested where applicable, and we encourage every
                buyer to continue regular vet care after bringing their puppy
                home.
              </p>
            </div>
          </article>

          <article className="standard-card">
            <div className="standard-icon-box">
              <span>DNA</span>
            </div>

            <div>
              <h3>Embark Tested</h3>
              <p>
                Embark testing is used where applicable to support better
                breeding decisions, genetic awareness, and transparency for
                families interested in our dogs.
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}