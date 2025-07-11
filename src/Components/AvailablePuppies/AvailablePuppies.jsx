import React, { useState } from "react";
import "./AvailablePuppies.css";

const puppies = [
  {
    id: 1,
    name: "Bella",
    src: "/assets/dog1.png",
    desc: "Fawn Female, smooth coat, champion bloodlines.",
    price: "$2,500",
  },
  {
    id: 2,
    name: "Max",
    src: "/assets/dog2.png",
    desc: "Blue Brindle Male, extra XL, outstanding temperament.",
    price: "$2,800",
  },
  {
    id: 3,
    name: "Luna",
    src: "/assets/dog3.png",
    desc: "Lilac Female, 14 weeks old, super friendly.",
    price: "$3,100",
  },
  {
    id: 4,
    name: "Rocky",
    src: "/assets/dog4.jpg",
    desc: "Fawn Male, 11 weeks, very sociable and smart.",
    price: "$2,700",
  },
  // …add as many as you’d like
];

export default function AvailablePuppies() {
  const [selected, setSelected] = useState(null);

  return (
    <main className="available-page">
      <h2>Available XL Bullies</h2>
      <div className="puppy-grid">
        {puppies.map((p) => (
          <div
            key={p.id}
            className="puppy-card"
            onClick={() => setSelected(p)}
          >
            <h3>{p.name}</h3>
            <img src={p.src} alt={p.name} />
            <p className="puppy-desc">{p.desc}</p>
            <p className="puppy-price">{p.price}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="modal-overlay"
          onClick={() => setSelected(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <h3>{selected.name}</h3>
            <img src={selected.src} alt={selected.name} />
            <p>{selected.desc}</p>
            <p className="puppy-price">{selected.price}</p>
          </div>
        </div>
      )}
    </main>
  );
}
