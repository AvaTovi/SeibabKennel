import React, { useRef } from "react";
import { supabase } from "../../supabaseClient";
import "./Contact.css";

const INSTAGRAM_URL = "https://www.instagram.com/seibab_kennels/";

const Contact = () => {
  const form = useRef();

  const sendMessage = async (e) => {
    e.preventDefault();

    const name = e.target.user_name.value;
    const email = e.target.user_email.value;
    const message = e.target.message.value;

    const { error } = await supabase.from("Messages").insert([
      {
        name,
        email,
        message,
        status: "New",
      },
    ]);

    if (error) {
      alert("Message failed to send.");
      return;
    }

    alert("Message sent successfully!");
    e.target.reset();
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <p className="eyebrow">Contact Us</p>
        <h1>Let’s Talk Puppies</h1>
        <p>
          Have questions about available puppies, studs, upcoming litters,
          pricing, or the process? Send us a message and we’ll get back to you.
        </p>
      </section>

      <section className="contact-layout">
        <div className="contact-info-card">
          <h2>Seibab Kennel</h2>
          <p>Extreme / XL American Bullies</p>

          <div className="contact-info-list">
            <p>
              <strong>Location:</strong> Dallas, TX
            </p>
            <p>
              <strong>Phone:</strong> (972) 330-3392
            </p>
            <p>
              <strong>Email:</strong> info@seibabkennel.com
            </p>
          </div>

          <div className="social-card">
            <div>
              <span className="social-kicker">Follow Seibab Kennel</span>
              <h3>See Updates on Instagram</h3>
              <p>
                Follow for new puppies, studs, upcoming breedings, and
                behind-the-scenes kennel content.
              </p>
            </div>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="instagram-button"
            >
              <span>Instagram</span>
              <strong>@seibab_kennels</strong>
            </a>
          </div>
        </div>

        <form className="contact-form" ref={form} onSubmit={sendMessage}>
          <label>
            Name
            <input type="text" name="user_name" placeholder="Your Name" required />
          </label>

          <label>
            Email
            <input
              type="email"
              name="user_email"
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Message
            <textarea
              name="message"
              rows="6"
              placeholder="Tell us what puppy, stud, or information you are interested in..."
              required
            />
          </label>

          <button type="submit">Send Message</button>
        </form>
      </section>
    </main>
  );
};

export default Contact;