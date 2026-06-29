import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./AvailablePuppies.css";
import UpcomingBreedings from "../UpcomingBreedings/UpcomingBreedings";

export default function AvailablePuppies() {
  const [selected, setSelected] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [puppies, setPuppies] = useState([]);
  const [interestForm, setInterestForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    fetchPuppies();
  }, []);

  const fetchPuppies = async () => {
    const { data, error } = await supabase
      .from("Puppies")
      .select("*")
      .order("featured", { ascending: false })
      .order("id", { ascending: false });

    if (!error) {
      setPuppies(data || []);
    }
  };

  const openPuppy = async (puppy) => {
    setSelected(puppy);
    setActiveImage(puppy.image_url);

    await supabase.from("Analytics").insert([
      {
        item_type: "puppy",
        item_id: puppy.id,
        item_name: puppy.name,
        action: "view",
      },
    ]);
  };

  const closeModal = () => {
    setSelected(null);
    setActiveImage("");
    setInterestForm({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  const submitInterest = async (e) => {
    e.preventDefault();

    const fullMessage = `
PUPPY INTEREST

Interested Puppy: ${selected.name}
Status: ${selected.status}
Gender: ${selected.gender}
Price: ${selected.price}

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
        item_type: "puppy",
        item_id: selected.id,
        item_name: selected.name,
        action: "inquiry",
      },
    ]);

    alert("Your interest was sent successfully!");
    closeModal();
  };

  const availablePuppies = puppies.filter((puppy) => !puppy.sold);
  const soldPuppies = puppies.filter((puppy) => puppy.sold);

  return (
    <main className="available-page">
      <section className="available-hero">
        <p className="eyebrow">Available Puppies</p>
        <h1>Find Your Next XL Bully</h1>
        <p>Browse current puppies, upcoming breedings, and past placements.</p>
      </section>

      <UpcomingBreedings />

      <section className="available-section-shell">
        <div className="available-section-top">
          <div>
            <p className="eyebrow">Available Now</p>
            <h2>Current Puppies</h2>
          </div>

          <p>
            Click any puppy to view more photos, pedigree information, and send
            an interest message directly to the owner.
          </p>
        </div>

        <div className="available-section-inner">
          {availablePuppies.length === 0 ? (
            <section className="no-puppies-box">
              <h3>No puppies listed right now</h3>
              <p>Please check back soon or contact us about upcoming litters.</p>
            </section>
          ) : (
            <section className="puppy-grid">
              {availablePuppies.map((puppy) => (
                <button
                  key={puppy.id}
                  className="puppy-card"
                  onClick={() => openPuppy(puppy)}
                >
                  <div className="puppy-image-wrap">
                    <img src={puppy.image_url} alt={puppy.name} />

                    {puppy.featured && (
                      <span className="featured-badge">Featured</span>
                    )}
                  </div>

                  <div className="puppy-card-content">
                    <span className="status-label">{puppy.status}</span>
                    <h3>{puppy.name}</h3>
                    <p className="puppy-gender">{puppy.gender}</p>
                    <p className="puppy-desc">{puppy.description}</p>
                    <p className="puppy-price">{puppy.price}</p>
                  </div>
                </button>
              ))}
            </section>
          )}
        </div>
      </section>

      {soldPuppies.length > 0 && (
        <section className="available-section-shell sold-gallery-section">
          <div className="available-section-top">
            <div>
              <p className="eyebrow">Past Puppies</p>
              <h2>Sold Puppy Gallery</h2>
            </div>

            <p>
              A clean look at puppies that have already found their new homes.
            </p>
          </div>

          <div className="available-section-inner">
            <section className="puppy-grid">
              {soldPuppies.map((puppy) => (
                <button
                  key={puppy.id}
                  className="puppy-card sold-card"
                  onClick={() => openPuppy(puppy)}
                >
                  <div className="puppy-image-wrap">
                    <img src={puppy.image_url} alt={puppy.name} />
                    <span className="sold-badge">Sold</span>
                  </div>

                  <div className="puppy-card-content">
                    <h3>{puppy.name}</h3>
                    <p className="puppy-gender">{puppy.gender}</p>
                    <p className="puppy-desc">{puppy.description}</p>
                  </div>
                </button>
              ))}
            </section>
          </div>
        </section>
      )}

      {selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content interest-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>

            <div className="interest-modal-grid">
              <div className="interest-image-panel">
                <div className="puppy-modal-images">
                  <img src={activeImage} alt={selected.name} />

                  <div className="puppy-thumb-row">
                    {[selected.image_url, ...(selected.gallery_urls || [])].map(
                      (url) => (
                        <button
                          key={url}
                          type="button"
                          className={activeImage === url ? "active" : ""}
                          onClick={() => setActiveImage(url)}
                        >
                          <img src={url} alt="Puppy thumbnail" />
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="interest-details-panel">
                <div className="modal-badge-row">
                  <span className="status-label modal-status">
                    {selected.sold ? "Sold" : selected.status}
                  </span>

                  {selected.featured && (
                    <span className="featured-pill">Featured Puppy</span>
                  )}
                </div>

                <h3>{selected.name}</h3>

                <div className="puppy-detail-list">
                  <p>
                    <strong>Gender:</strong> {selected.gender}
                  </p>
                  <p>
                    <strong>Price:</strong>{" "}
                    <span className="modal-price">{selected.price}</span>
                  </p>
                </div>

                <div className="modal-description-section">
                  <h4>Description</h4>
                  <p className="modal-description">{selected.description}</p>
                </div>

                {selected.pedigree_url && (
                  <a
                    className="pedigree-button"
                    href={selected.pedigree_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Pedigree PDF
                  </a>
                )}

                {!selected.sold && (
                  <div className="interest-box">
                    <h4>Interested in {selected.name}?</h4>
                    <p>
                      Fill this out and the owner will receive your message in
                      the admin dashboard.
                    </p>

                    <form className="interest-form" onSubmit={submitInterest}>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={interestForm.name}
                        onChange={(e) =>
                          setInterestForm({
                            ...interestForm,
                            name: e.target.value,
                          })
                        }
                        required
                      />

                      <input
                        type="email"
                        placeholder="Your Email"
                        value={interestForm.email}
                        onChange={(e) =>
                          setInterestForm({
                            ...interestForm,
                            email: e.target.value,
                          })
                        }
                        required
                      />

                      <input
                        type="tel"
                        placeholder="Your Phone Number"
                        value={interestForm.phone}
                        onChange={(e) =>
                          setInterestForm({
                            ...interestForm,
                            phone: e.target.value,
                          })
                        }
                      />

                      <textarea
                        placeholder={`Hi, I am interested in ${selected.name}.`}
                        value={interestForm.message}
                        onChange={(e) =>
                          setInterestForm({
                            ...interestForm,
                            message: e.target.value,
                          })
                        }
                        required
                      />

                      <button type="submit">Send Puppy Interest</button>
                    </form>
                  </div>
                )}

                {selected.sold && (
                  <div className="sold-message-box">
                    <h4>This puppy has been sold</h4>
                    <p>
                      Contact us about upcoming litters or other available
                      puppies.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}