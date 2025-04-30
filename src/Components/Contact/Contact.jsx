import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    //FIX THIS STEP FOR THE EMAIL
    emailjs.sendForm(
      'your_service_id',  // from emailjs dashboard
      'your_template_id', // from emailjs dashboard
      form.current,
      'your_public_key'   // from emailjs dashboard
    ).then(
      (result) => {
        alert("Message sent!");
      },
      (error) => {
        alert("Failed to send message.");
      }
    );

    e.target.reset(); // clear form
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <form className="contact-form" ref={form} onSubmit={sendEmail}>
        <label>
          Name
          <input type="text" name="user_name" placeholder="Your Name" required />
        </label>
        <label>
          Email
          <input type="email" name="user_email" placeholder="you@example.com" required />
        </label>
        <label>
          Message
          <textarea name="message" rows="5" placeholder="What’s on your mind?" required />
        </label>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
