import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Reviews from "../Reviews/Reviews";
import "./WhatsNew.css";

export default function WhatsNew() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    const { data, error } = await supabase
      .from("WhatsNew")
      .select("*")
      .eq("active", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (!error) {
      setUpdates(data || []);
    }
  };

  return (
    <main className="whats-new-page">
      <section className="whats-new-hero">
        <p className="eyebrow">What’s New</p>
        <h1>Latest Updates From Seibab Kennel</h1>
        <p>
          Stay updated on new puppies, studs, breed announcements, upcoming
          litters, and important kennel news.
        </p>
      </section>

      {updates.length === 0 ? (
        <section className="whats-new-empty">
          <h2>No updates posted yet</h2>
          <p>Check back soon for new kennel announcements.</p>
        </section>
      ) : (
        <section className="whats-new-grid">
          {updates.map((item) => (
            <article className="whats-new-card" key={item.id}>
              {item.image_url && (
                <div className="whats-new-image">
                  <img src={item.image_url} alt={item.title} />
                  {item.featured && <span>Featured</span>}
                </div>
              )}

              <div className="whats-new-content">
                <span className="whats-new-tag">{item.tag}</span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>

                <Link
                  to={item.redirect_path || "/whats-new"}
                  className="whats-new-button"
                >
                  {item.button_text || "Learn More"}
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}

      <Reviews />
    </main>
  );
}