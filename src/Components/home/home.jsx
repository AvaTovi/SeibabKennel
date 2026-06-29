import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "./home.css";

import Reviews from "../Reviews/Reviews";
import WhatsNewPreview from "../WhatsNewPreview/WhatsNewPreview";

import video1 from "../../assets/SK1.mp4";
import dog1 from "../../assets/dog1.png";
import dog2 from "../../assets/dog2.png";
import dog3 from "../../assets/dog3.png";
import dog4 from "../../assets/dog4.jpg";
import dog5 from "../../assets/seibab_dog.jpg";
import dog6 from "../../assets/seibab_dog2.jpg";
import dog7 from "../../assets/seibab_dog3.jpg";
import dog8 from "../../assets/seibab_dog4.jpg";

const mediaItems = [
  { type: "video", src: video1, title: "Seibab Kennel Walk" },
  { type: "image", src: dog1, title: "XL Bully" },
  { type: "image", src: dog2, title: "XL Bully" },
  { type: "image", src: dog3, title: "XL Bully" },
  { type: "image", src: dog4, title: "XL Bully" },
  { type: "image", src: dog5, title: "XL Bully" },
  { type: "image", src: dog6, title: "XL Bully" },
  { type: "image", src: dog7, title: "XL Bully" },
  { type: "image", src: dog8, title: "XL Bully" },
];

function ScrollFade({ children, className = "", as: Tag = "section", delay = 0 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const revealOnScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight - 120) {
        setIsVisible(true);
        window.removeEventListener("scroll", revealOnScroll);
      }
    };

    revealOnScroll();

    window.addEventListener("scroll", revealOnScroll);
    window.addEventListener("resize", revealOnScroll);

    return () => {
      window.removeEventListener("scroll", revealOnScroll);
      window.removeEventListener("resize", revealOnScroll);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateY(0px) scale(1)"
          : "translateY(90px) scale(0.96)",
        filter: isVisible ? "blur(0px)" : "blur(14px)",
        transition: `opacity 1000ms ease ${delay}ms, transform 1000ms ease ${delay}ms, filter 1000ms ease ${delay}ms`,
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </Tag>
  );
}

export default function Home() {
  const [openIndex, setOpenIndex] = useState(-1);

  const slides = mediaItems.map((item) => ({
    type: item.type,
    src: item.src,
    title: item.title,
  }));

  return (
    <main className="home">
      <ScrollFade as="div">
        <WhatsNewPreview />
      </ScrollFade>

      <ScrollFade className="hero-section" delay={100}>
        <div className="hero-content">
          <p className="eyebrow">Elite XL American Bullies</p>

          <h1>
            Welcome to <span>Seibab Kennel</span>
          </h1>

          <p className="hero-description">
            Discover our elite breeding program where health, temperament, and
            championship bloodlines come together to raise confident, loyal, and
            family-ready companions.
          </p>

          <div className="hero-buttons">
            <Link to="/available-puppies" className="primary-button">
              Browse Available Puppies
            </Link>

            <Link to="/about" className="secondary-button">
              Learn About Us
            </Link>
          </div>
        </div>

        <div className="hero-video-card" onClick={() => setOpenIndex(0)}>
          <video
            className="hero-video"
            src={video1}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="video-badge">Watch Preview</div>
        </div>
      </ScrollFade>

      <ScrollFade className="trust-section">
        <div className="trust-card">
          <h3>Health Focused</h3>
          <p>Raised with care, structure, and attention to wellness.</p>
        </div>

        <div className="trust-card">
          <h3>Family Temperament</h3>
          <p>Confident, loyal, and socialized for loving homes.</p>
        </div>

        <div className="trust-card">
          <h3>Quality Bloodlines</h3>
          <p>Built around strong structure, presence, and breed standards.</p>
        </div>
      </ScrollFade>

      <ScrollFade className="gallery-section">
        <div className="section-heading">
          <p className="eyebrow">Our Gallery</p>
          <h2>Meet the Seibab Look</h2>
          <p>
            View our dogs and get a closer look at the strength, structure, and
            confidence behind our kennel.
          </p>
        </div>

        <div className="home-gallery">
          {mediaItems.slice(1).map((item, index) => (
            <button
              className="thumb"
              key={index + 1}
              onClick={() => setOpenIndex(index + 1)}
            >
              <img src={item.src} alt={item.title} />
            </button>
          ))}
        </div>
      </ScrollFade>

      <ScrollFade className="cta-section">
        <h2>Ready to find your next companion?</h2>
        <p>
          Browse our available puppies or contact us to learn more about upcoming
          litters.
        </p>
        <Link to="/available-puppies" className="primary-button">
          Browse Puppies
        </Link>
      </ScrollFade>

      <ScrollFade as="div">
        <Reviews />
      </ScrollFade>

      {openIndex >= 0 && (
        <Lightbox
          open={true}
          index={openIndex}
          close={() => setOpenIndex(-1)}
          slides={slides}
          render={{
            slide: ({ slide }) =>
              slide.type === "video" ? (
                <video
                  src={slide.src}
                  controls
                  autoPlay
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              ) : (
                <img
                  src={slide.src}
                  alt={slide.title}
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              ),
          }}
        />
      )}
    </main>
  );
}