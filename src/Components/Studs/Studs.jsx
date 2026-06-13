import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./Studs.css";
import Reviews from "../Reviews/Reviews";

export default function Studs() {
  const [studs, setStuds] = useState([]);
  const [selectedStud, setSelectedStud] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [interestForm, setInterestForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    fetchStuds();
  }, []);

  const fetchStuds = async () => {
    const { data, error } = await supabase
      .from("Studs")
      .select("*")
      .order("featured", { ascending: false })
      .order("id", { ascending: false });

    if (!error) setStuds(data || []);
  };

  const openStud = async (stud) => {
    setSelectedStud(stud);
    setActiveImage(stud.image_url);

    await supabase.from("Analytics").insert([
      {
        item_type: "stud",
        item_id: stud.id,
        item_name: stud.name,
        action: "view",
      },
    ]);
  };

  const closeStud = () => {
    setSelectedStud(null);
    setActiveImage("");
    setInterestForm({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  const submitStudInterest = async (e) => {
    e.preventDefault();

    const fullMessage = `
STUD SERVICE INTEREST

Interested Stud: ${selectedStud.name}
Status: ${selectedStud.status}
Bloodline: ${selectedStud.bloodline}
Stud Fee: ${selectedStud.fee}

Customer Phone: ${interestForm.phone || "Not provided"}

Customer Message:
${interestForm.message}
    `;

    const { error } = await supabase.from("Messages").insert([
      {
        name: interestForm.name,
        email: interestForm.email,
        message: fullMessage,
        status: "New",
      },
    ]);

    if (error) {
      alert("Interest message failed to send.");
      return;
    }

    await supabase.from("Analytics").insert([
      {
        item_type: "stud",
        item_id: selectedStud.id,
        item_name: selectedStud.name,
        action: "inquiry",
      },
    ]);

    alert("Your stud inquiry was sent successfully!");
    closeStud();
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
          <p>Click a stud below to view details and send an inquiry.</p>
        </div>
      </section>

      {studs.length === 0 ? (
        <section className="no-studs-box">
          <h2>No studs listed yet</h2>
          <p>Check back soon or contact us for upcoming stud availability.</p>
        </section>
      ) : (
        <section className="studs-grid">
          {studs.map((stud) => (
            <button key={stud.id} className="stud-card" onClick={() => openStud(stud)}>
              <div className="stud-image-wrap">
                <img src={stud.image_url} alt={stud.name} />
                <span>{stud.status}</span>
                {stud.featured && <div className="featured-badge">Featured</div>}
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
      )}

    <Reviews />

      {selectedStud && (
        <div className="stud-modal-overlay" onClick={closeStud}>
          <div className="stud-modal" onClick={(e) => e.stopPropagation()}>
            <button className="stud-modal-close" onClick={closeStud}>
              ×
            </button>

            <div className="stud-modal-grid">
              <div className="stud-modal-images">
                <img src={activeImage} alt={selectedStud.name} />

                <div className="stud-thumb-row">
                  {[selectedStud.image_url, ...(selectedStud.gallery_urls || [])].map(
                    (url) => (
                      <button
                        key={url}
                        className={activeImage === url ? "active" : ""}
                        onClick={() => setActiveImage(url)}
                      >
                        <img src={url} alt="Stud thumbnail" />
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="stud-modal-content">
                <p className="eyebrow">{selectedStud.status}</p>
                {selectedStud.featured && <span className="featured-pill">Featured Stud</span>}

                <h2>{selectedStud.name}</h2>

                <p>
                  <strong>Bloodline:</strong> {selectedStud.bloodline}
                </p>

                <p>
                  <strong>Stud Fee:</strong> {selectedStud.fee}
                </p>

                <div className="stud-description-section">
                  <h4>Description</h4>
                  <p>{selectedStud.description}</p>
                </div>

                {selectedStud.pedigree_url && (
                  <a
                    className="pedigree-button"
                    href={selectedStud.pedigree_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Pedigree PDF
                  </a>
                )}

                <div className="stud-interest-box">
                  <h3>Interested in {selectedStud.name}?</h3>
                  <p>
                    Fill this out and the owner will receive your stud inquiry in the
                    admin dashboard.
                  </p>

                  <form className="stud-interest-form" onSubmit={submitStudInterest}>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={interestForm.name}
                      onChange={(e) =>
                        setInterestForm({ ...interestForm, name: e.target.value })
                      }
                      required
                    />

                    <input
                      type="email"
                      placeholder="Your Email"
                      value={interestForm.email}
                      onChange={(e) =>
                        setInterestForm({ ...interestForm, email: e.target.value })
                      }
                      required
                    />

                    <input
                      type="tel"
                      placeholder="Your Phone Number"
                      value={interestForm.phone}
                      onChange={(e) =>
                        setInterestForm({ ...interestForm, phone: e.target.value })
                      }
                    />

                    <textarea
                      placeholder={`Hi, I am interested in stud service with ${selectedStud.name}.`}
                      value={interestForm.message}
                      onChange={(e) =>
                        setInterestForm({ ...interestForm, message: e.target.value })
                      }
                      required
                    />

                    <button type="submit">Send Stud Inquiry</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}