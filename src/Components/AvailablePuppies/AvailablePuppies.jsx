import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./AvailablePuppies.css";

export default function AvailablePuppies() {
  const [selected, setSelected] = useState(null);
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
      .order("id", { ascending: false });

    if (!error) {
      setPuppies(data || []);
    }
  };

  const closeModal = () => {
    setSelected(null);
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

    alert("Your interest was sent successfully!");
    closeModal();
  };

  return (
    <main className="available-page">
      <section className="available-hero">
        <p className="eyebrow">Available Puppies</p>
        <h1>Find Your Next XL Bully</h1>
        <p>Browse our current puppies and contact us for more details.</p>
      </section>

      {puppies.length === 0 ? (
        <section className="no-puppies-box">
          <h2>No puppies listed right now</h2>
          <p>Please check back soon or contact us about upcoming litters.</p>
        </section>
      ) : (
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
                <p className="puppy-gender">{puppy.gender}</p>
                <p className="puppy-desc">{puppy.description}</p>
                <p className="puppy-price">{puppy.price}</p>
              </div>
            </button>
          ))}
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
                <img src={selected.image_url} alt={selected.name} />
              </div>

              <div className="interest-details-panel">
                <span className="status-label modal-status">
                  {selected.status}
                </span>

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

                <div className="interest-box">
                  <h4>Interested in {selected.name}?</h4>
                  <p>
                    Fill this out and the owner will receive your message in the
                    admin dashboard.
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
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}