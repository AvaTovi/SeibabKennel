import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./UpcomingBreedings.css";

export default function UpcomingBreedings() {
  const [breedings, setBreedings] = useState([]);

  useEffect(() => {
    fetchBreedings();
  }, []);

  const fetchBreedings = async () => {
    const { data, error } = await supabase
      .from("UpcomingBreedings")
      .select("*")
      .eq("active", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (!error) {
      setBreedings(data || []);
    }
  };

  if (breedings.length === 0) return null;

  return (
    <section className="upcoming-breedings-section">
      <div className="upcoming-breedings-header">
        <div>
          <p className="eyebrow">Upcoming Breedings</p>
          <h2>Future Litters & Waitlist Updates</h2>
        </div>

        <p>
          View planned breedings and upcoming litters before puppies become
          available.
        </p>
      </div>

      <div className="upcoming-breedings-list">
        {breedings.map((breeding) => (
          <article
            className={`upcoming-breeding-card ${
              breeding.featured ? "featured-breeding-card" : ""
            }`}
            key={breeding.id}
          >
            {breeding.image_url && (
              <div className="upcoming-breeding-image">
                <img src={breeding.image_url} alt={breeding.title} />

                {breeding.featured && (
                  <span className="upcoming-featured-badge">Featured</span>
                )}
              </div>
            )}

            <div className="upcoming-breeding-content">
              <span className="upcoming-status-pill">
                {breeding.status || "Upcoming"}
              </span>

              <h3>{breeding.title}</h3>

              {(breeding.sire || breeding.dam) && (
                <div className="upcoming-parent-grid">
                  {breeding.sire && (
                    <div className="upcoming-parent-card">
                      {breeding.sire_image_url && (
                        <img src={breeding.sire_image_url} alt={breeding.sire} />
                      )}
                      <span>Sire</span>
                      <strong>{breeding.sire}</strong>
                    </div>
                  )}

                  {breeding.dam && (
                    <div className="upcoming-parent-card">
                      {breeding.dam_image_url && (
                        <img src={breeding.dam_image_url} alt={breeding.dam} />
                      )}
                      <span>Dam</span>
                      <strong>{breeding.dam}</strong>
                    </div>
                  )}
                </div>
              )}

              <div className="upcoming-breeding-details">
                {breeding.expected_date && (
                  <p>
                    <strong>Expected:</strong> {breeding.expected_date}
                  </p>
                )}
              </div>

              <p className="upcoming-breeding-description">
                {breeding.description}
              </p>

              <div className="upcoming-breeding-actions">
                <Link to="/contact" className="primary-button">
                  Contact About This Breeding
                </Link>

                <Link to="/whats-new" className="secondary-button">
                  View Kennel Updates
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
