import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./WhatsNewPreview.css";

export default function WhatsNewPreview() {
  const [updates, setUpdates] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchUpdates();
  }, []);

  useEffect(() => {
    if (updates.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % updates.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [updates]);

  const fetchUpdates = async () => {
    const { data, error } = await supabase
      .from("WhatsNew")
      .select("*")
      .eq("active", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error) {
      setUpdates(data || []);
    }
  };

  if (updates.length === 0) return null;

  const activeUpdate = updates[activeIndex];

  return (
    <section className="whats-new-preview">
      <div className="preview-alert-bar">
        <span className="preview-live-dot"></span>
        <p>Latest Kennel Update</p>
      </div>

      <div className="preview-card">
        {activeUpdate.image_url && (
          <div className="preview-image">
            <img src={activeUpdate.image_url} alt={activeUpdate.title} />
          </div>
        )}

        <div className="preview-content">
          <span>{activeUpdate.tag}</span>
          <h2>{activeUpdate.title}</h2>
          <p>{activeUpdate.description}</p>

          <Link to="/whats-new" className="preview-button">
            View What’s New
          </Link>
        </div>
      </div>

      {updates.length > 1 && (
        <div className="preview-dots">
          {updates.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={activeIndex === index ? "active" : ""}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}