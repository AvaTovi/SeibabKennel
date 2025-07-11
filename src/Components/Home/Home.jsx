import React, { useState } from "react";
import { Link } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "./home.css";
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
  { type: "video", src: video1, title: "Seibab Walk" },
  { type: "image", src: dog1, title: "Dog 1" },
  { type: "image", src: dog2, title: "Dog 2" },
  { type: "image", src: dog3, title: "Dog 3" },
  { type: "image", src: dog4, title: "Dog 4" },
  { type: "image", src: dog5, title: "Dog 5" },
  { type: "image", src: dog6, title: "Dog 6" },
  { type: "image", src: dog7, title: "Dog 7" },
  { type: "image", src: dog8, title: "Dog 8" },
];

export default function Home() {
  const [openIndex, setOpenIndex] = useState(-1);

  // Build slides array for the Lightbox component
  const slides = mediaItems.map((m) => ({
    type: m.type,
    src: m.src,
    title: m.title,
  }));

  return (
    <main className="home">
        {/* above vid/pic container */}
        <div className="above-pic-container">
        <div className="text1">Welcome to Seibab Kennel!</div>
        <div className="text2">Extreme / XL American Bully’s</div>
        <div className="text3">
          Discover our elite breeding program—where health, temperament,
          and championship bloodlines come together to raise your next
          loyal companion.
        </div>
        <Link to="/available-puppies" className="browse-button">Browse Available Puppies</Link>
      </div>
      {/* Video thumbnail */}
      <div className="home-video-container">
        <video
          className="home-video"
          src={video1}
          autoPlay
          loop
          muted
          onClick={() => setOpenIndex(0)}
        />
      </div>

      {/* Gallery Thumbnails */}
      <section className="home-gallery">
        {mediaItems.slice(1).map((item, i) => (
          <div
            className="thumb"
            key={i + 1}
            onClick={() => setOpenIndex(i + 1)}
          >
            <img src={item.src} alt={item.title} />
          </div>
        ))}
      </section>

      {/* Lightbox */}
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

      {/* below vid/pic container */}
      <div className="below-pic-container">
        <div className="text4">Ready to Browse Puppies?</div>
        <Link to="/available-puppies" className="browse-button2">Browse Available Puppies</Link>
      </div>
    </main>
  );
}