import React, { useState } from "react";
import { Link } from "react-router-dom";
import Reviews from "../Reviews/Reviews";
import "./PuppyInfo.css";

const infoSections = [
  {
    title: "Before Buying a Puppy",
    description:
      "Helpful information for families who are thinking about bringing home an XL American Bully.",
    questions: [
      {
        question: "Is an XL American Bully a good family dog?",
        answer:
          "XL American Bullies are known for being loyal, confident, affectionate, and family-oriented when they are raised, socialized, and cared for properly. Like any breed, they need structure, attention, exercise, training, and responsible ownership.",
      },
      {
        question: "What should I know before buying a puppy?",
        answer:
          "Before buying, you should be ready for the cost of food, vet care, training, supplies, time, and long-term commitment. Puppies need patience, consistency, and a stable home environment.",
      },
      {
        question: "Are these dogs good for first-time owners?",
        answer:
          "They can be, but first-time owners should be prepared to learn about training, structure, boundaries, and proper socialization. A strong dog needs a responsible owner who is willing to be consistent.",
      },
    ],
  },
  {
    title: "Reserve & Deposit Information",
    description:
      "Understand how reserving a puppy works and what to expect during the process.",
    questions: [
      {
        question: "How do I reserve a puppy?",
        answer:
          "To reserve a puppy, contact us about the puppy you are interested in. The owner will explain availability, pricing, deposit details, and the next steps.",
      },
      {
        question: "Are deposits refundable?",
        answer:
          "Deposit terms should always be confirmed directly with the owner before sending payment. In many breeding programs, deposits are used to hold a puppy and may not be refundable once the puppy is reserved.",
      },
      {
        question: "Can I join a waitlist for an upcoming litter?",
        answer:
          "Yes. If puppies are not currently available, you can contact us about upcoming breedings and future litters. The owner can explain the waitlist process and expected availability.",
      },
    ],
  },
  {
    title: "Bringing Your Puppy Home",
    description:
      "What to expect when your puppy is ready to leave and adjust to the new home.",
    questions: [
      {
        question: "What should I buy before bringing my puppy home?",
        answer:
          "You should have puppy food, food and water bowls, a crate, collar, leash, toys, cleaning supplies, bedding, and a safe space prepared before pickup.",
      },
      {
        question: "How should I introduce the puppy to my home?",
        answer:
          "Keep the first few days calm and simple. Let the puppy adjust slowly, avoid overwhelming them with too many people at once, and begin building a routine for feeding, potty breaks, crate time, and rest.",
      },
      {
        question: "How long does it take a puppy to adjust?",
        answer:
          "Every puppy is different, but many puppies need a few days to a few weeks to fully settle in. A consistent routine helps them feel safe and confident.",
      },
    ],
  },
  {
    title: "Food, Health & Vet Care",
    description:
      "Basic health and care information every buyer should understand.",
    questions: [
      {
        question: "What should I feed my puppy?",
        answer:
          "Ask the owner what food the puppy is currently eating before switching. If you change food, transition slowly over several days to avoid stomach issues.",
      },
      {
        question: "When should I take my puppy to the vet?",
        answer:
          "Schedule a vet visit shortly after bringing your puppy home. Your vet can review vaccine needs, health status, deworming, diet, and care recommendations.",
      },
      {
        question: "Do puppies need vaccines?",
        answer:
          "Yes. Puppies need a vaccine schedule recommended by a licensed veterinarian. Your vet will tell you what shots are needed and when.",
      },
    ],
  },
  {
    title: "Training & Socialization",
    description:
      "Good structure early helps your puppy grow into a confident adult dog.",
    questions: [
      {
        question: "When should training start?",
        answer:
          "Training should start right away with simple basics like name recognition, crate routine, potty schedule, leash manners, and calm boundaries.",
      },
      {
        question: "How important is socialization?",
        answer:
          "Socialization is very important. Puppies should be introduced to new people, sounds, environments, and safe experiences gradually and positively.",
      },
      {
        question: "Should I crate train my puppy?",
        answer:
          "Crate training can be very helpful for potty training, safety, routine, and giving the puppy a calm place to rest. It should always be done patiently and positively.",
      },
    ],
  },
  {
    title: "Stud Services & Breeding Questions",
    description:
      "Helpful information for people interested in stud services or future breedings.",
    questions: [
      {
        question: "How do I ask about stud service?",
        answer:
          "Go to the Studs page, select the stud you are interested in, and submit an inquiry. The owner will follow up with availability, requirements, pricing, and next steps.",
      },
      {
        question: "What information should I provide for stud service?",
        answer:
          "Provide information about your female dog, health status, pedigree if available, timing, location, and what you are looking for in the breeding.",
      },
      {
        question: "Can I ask about upcoming breedings?",
        answer:
          "Yes. Upcoming breedings can be viewed on the Available Puppies page. You can contact the owner about waitlist availability and future litter plans.",
      },
    ],
  },
];

export default function PuppyInfo() {
  const [openSection, setOpenSection] = useState(0);
  const [openQuestion, setOpenQuestion] = useState("0-0");

  const toggleQuestion = (sectionIndex, questionIndex) => {
    const key = `${sectionIndex}-${questionIndex}`;
    setOpenQuestion(openQuestion === key ? "" : key);
  };

  return (
    <main className="puppy-info-page">
      <section className="puppy-info-hero">
        <p className="eyebrow">Puppy Info</p>
        <h1>New Buyer Q&A Guide</h1>
        <p>
          Learn what to expect before buying, reserving, bringing home, and
          caring for your puppy.
        </p>

        <div className="puppy-info-hero-actions">
          <Link to="/available-puppies" className="primary-button">
            View Available Puppies
          </Link>

          <Link to="/contact" className="secondary-button">
            Ask a Question
          </Link>
        </div>
      </section>

      <section className="puppy-info-shell">
        <div className="puppy-info-sidebar">
          <p className="eyebrow">Topics</p>

          {infoSections.map((section, index) => (
            <button
              key={section.title}
              className={openSection === index ? "active" : ""}
              onClick={() => {
                setOpenSection(index);
                setOpenQuestion(`${index}-0`);
              }}
              type="button"
            >
              {section.title}
            </button>
          ))}
        </div>

        <div className="puppy-info-content">
          <div className="puppy-info-topic-header">
            <span>{String(openSection + 1).padStart(2, "0")}</span>
            <div>
              <h2>{infoSections[openSection].title}</h2>
              <p>{infoSections[openSection].description}</p>
            </div>
          </div>

          <div className="qa-list">
            {infoSections[openSection].questions.map((item, questionIndex) => {
              const key = `${openSection}-${questionIndex}`;
              const isOpen = openQuestion === key;

              return (
                <article className={`qa-card ${isOpen ? "open" : ""}`} key={key}>
                  <button
                    type="button"
                    className="qa-question"
                    onClick={() => toggleQuestion(openSection, questionIndex)}
                  >
                    <span>{item.question}</span>
                    <strong>{isOpen ? "−" : "+"}</strong>
                  </button>

                  {isOpen && <p className="qa-answer">{item.answer}</p>}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="puppy-info-cta">
        <div>
          <p className="eyebrow">Still Have Questions?</p>
          <h2>Talk With Seibab Kennel</h2>
          <p>
            If you are interested in a puppy, upcoming breeding, or stud service,
            send a message and the owner can help guide you.
          </p>
        </div>

        <Link to="/contact" className="primary-button">
          Contact Us
        </Link>
      </section>

      <Reviews />
    </main>
  );
}