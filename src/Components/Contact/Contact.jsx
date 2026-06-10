import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "your_service_id",
        "your_template_id",
        form.current,
        "your_public_key"
      )
      .then(
        () => {
          alert("Message sent!");
        },
        () => {
          alert("Failed to send message.");
        }
      );

    e.target.reset();
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <p className="eyebrow">Contact Us</p>
        <h1>Let’s Talk Puppies</h1>
        <p>
          Have questions about available puppies, upcoming litters, pricing, or
          the process? Send us a message and we’ll get back to you.
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
              <strong>Phone:</strong> (555) 123-4567
            </p>
            <p>
              <strong>Email:</strong> info@seibabkennel.com
            </p>
          </div>
        </div>

        <form className="contact-form" ref={form} onSubmit={sendEmail}>
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
              placeholder="Tell us what puppy or information you are interested in..."
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