import React from 'react';
import './Contact.css';  // create this for your contact-page styles

const Contact = () => (
  <div className="contact-page">
    <h1>Contact Us</h1>
    <form className="contact-form">
      <label>
        Name
        <input type="text" name="name" placeholder="Your Name" />
      </label>
      <label>
        Email
        <input type="email" name="email" placeholder="you@example.com" />
      </label>
      <label>
        Message
        <textarea name="message" rows="5" placeholder="What’s on your mind?" />
      </label>
      <button type="submit">Send Message</button>
    </form>
  </div>
);

export default Contact;
