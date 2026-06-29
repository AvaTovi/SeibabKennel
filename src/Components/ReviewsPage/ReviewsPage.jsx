import React from "react";
import Reviews from "../Reviews/Reviews";
import "./ReviewsPage.css";

export default function ReviewsPage() {
  return (
    <main className="reviews-page">
      <section className="reviews-page-hero">
        <p className="eyebrow">Customer Reviews</p>
        <h1>What Families Are Saying</h1>
        <p>
          Read featured 5-star reviews from Seibab Kennel families and leave
          feedback about your experience.
        </p>
      </section>

      <Reviews />
    </main>
  );
}
