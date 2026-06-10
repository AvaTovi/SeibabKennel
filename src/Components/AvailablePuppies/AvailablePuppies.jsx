import React, { useState } from "react";
import "./AvailablePuppies.css";

import dog1 from "../../assets/dog1.png";
import dog2 from "../../assets/dog2.png";
import dog3 from "../../assets/dog3.png";
import dog4 from "../../assets/dog4.jpg";

const puppies = [
  {
    id: 1,
    name: "Bella",
    src: dog1,
    desc: "Fawn female with a smooth coat, strong structure, and confident personality.",
    price: "$2,500",
  },
  {
    id: 2,
    name: "Max",
    src: dog2,
    desc: "Blue brindle male with XL build, great presence, and outstanding temperament.",
    price: "$2,800",
  },
  {
    id: 3,
    name: "Luna",
    src: dog3,
    desc: "Lilac female, friendly, playful, and raised with close daily care.",
    price: "$3,100",
  },
  {
    id: 4,
    name: "Rocky",
    src: dog4,
    desc: "Fawn male with a social personality, clean structure, and family-ready attitude.",
    price: "$2,700",
  },
];

export default function AvailablePuppies() {
  const [selected, setSelected] = useState(null);

  return (
    <main className="available-page">
      <section className="available-hero">
        <p className="eyebrow">Available Puppies</p>
        <h1>Find Your Next XL Bully</h1>
        <p>
          Browse our currently available puppies. Click any card to view a larger
          image and details.
        </p>
      </section>

      <section className="puppy-grid">
        {puppies.map((puppy) => (
          <button
            key={puppy.id}
            className="puppy-card"
            onClick={() => setSelected(puppy)}
          >
            <img src={puppy.src} alt={puppy.name} />
            <div className="puppy-card-content">
              <h3>{puppy.name}</h3>
              <p className="puppy-desc">{puppy.desc}</p>
              <p className="puppy-price">{puppy.price}</p>
            </div>
          </button>
        ))}
      </section>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>
              ×
            </button>

            <img src={selected.src} alt={selected.name} />
            <h3>{selected.name}</h3>
            <p>{selected.desc}</p>
            <p className="puppy-price">{selected.price}</p>
          </div>
        </div>
      )}
    </main>
  );
}