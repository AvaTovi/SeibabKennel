import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Studs.css";

export default function Studs() {
  const [studs, setStuds] = useState([]);
  const [selectedStud, setSelectedStud] = useState(null);

  useEffect(() => {
    fetchStuds();
  }, []);

  const fetchStuds = async () => {
    const { data, error } = await supabase
      .from("Studs")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setStuds(data || []);
  };

  return (
    <main className="studs-page">
      <section className="studs-hero">
        <p className="eyebrow">Stud Services</p>
        <h1>Seibab Kennel Studs</h1>
        <p>View our available and upcoming XL American Bully studs.</p>
      </section>

      <section className="stud-info-banner">
        <div>
          <h2>Interested in a Stud Service?</h2>
          <p>Contact us for availability, pricing, and breeding requirements.</p>
        </div>

        <Link to="/contact" className="primary-button">
          Contact About Studs
        </Link>
      </section>

      <section className="studs-grid">
        {studs.map((stud) => (
          <button
            key={stud.id}
            className="stud-card"
            onClick={() => setSelectedStud(stud)}
          >
            <div className="stud-image-wrap">
              <img src={stud.image_url} alt={stud.name} />
              <span>{stud.status}</span>
            </div>

            <div className="stud-card-content">
              <h3>{stud.name}</h3>
              <p className="stud-bloodline">{stud.bloodline}</p>
              <p className="stud-description">{stud.description}</p>
              <p className="stud-fee">{stud.fee}</p>
            </div>
          </button>
        ))}
      </section>

      {selectedStud && (
        <div className="stud-modal-overlay" onClick={() => setSelectedStud(null)}>
          <div className="stud-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="stud-modal-close"
              onClick={() => setSelectedStud(null)}
            >
              ×
            </button>

            <img src={selectedStud.image_url} alt={selectedStud.name} />

            <div className="stud-modal-content">
              <p className="eyebrow">{selectedStud.status}</p>
              <h2>{selectedStud.name}</h2>
              <p>{selectedStud.description}</p>
              <p>
                <strong>Bloodline:</strong> {selectedStud.bloodline}
              </p>
              <p>
                <strong>Stud Fee:</strong> {selectedStud.fee}
              </p>

              <Link to="/contact" className="primary-button">
                Ask About This Stud
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}