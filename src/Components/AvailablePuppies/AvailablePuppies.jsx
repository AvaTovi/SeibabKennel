import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./AvailablePuppies.css";

export default function AvailablePuppies() {
  const [selected, setSelected] = useState(null);
  const [puppies, setPuppies] = useState([]);

  useEffect(() => {
    fetchPuppies();
  }, []);

  const fetchPuppies = async () => {
    const { data, error } = await supabase
      .from("Puppies")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setPuppies(data || []);
  };

  return (
    <main className="available-page">
      <section className="available-hero">
        <p className="eyebrow">Available Puppies</p>
        <h1>Find Your Next XL Bully</h1>
        <p>Browse our current puppies and contact us for more details.</p>
      </section>

      <section className="puppy-grid">
        {puppies.map((puppy) => (
          <button
            key={puppy.id}
            className="puppy-card"
            onClick={() => setSelected(puppy)}
          >
            <img src={puppy.image_url} alt={puppy.name} />

            <div className="puppy-card-content">
              <span className="status-label">{puppy.status}</span>
              <h3>{puppy.name}</h3>
              <p>{puppy.gender}</p>
              <p className="puppy-desc">{puppy.description}</p>
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

            <img src={selected.image_url} alt={selected.name} />
            <h3>{selected.name}</h3>
            <p>{selected.gender}</p>
            <p>{selected.description}</p>
            <p className="puppy-price">{selected.price}</p>
          </div>
        </div>
      )}
    </main>
  );
}