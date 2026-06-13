import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./Reviews.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 5,
    review: "",
    imageFile: null,
  });

  useEffect(() => {
    fetchFeaturedReviews();
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews]);

  const fetchFeaturedReviews = async () => {
    const { data, error } = await supabase
      .from("Reviews")
      .select("*")
      .eq("rating", 5)
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error) setReviews(data || []);
  };

  const uploadReviewImage = async (file) => {
    if (!file) return null;

    const cleanFileName = file.name
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");

    const filePath = `reviews/${Date.now()}-${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from("kennel-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      alert(`Image upload failed: ${error.message}`);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("kennel-images")
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  };

  const submitReview = async (e) => {
    e.preventDefault();

    const ratingNumber = Number(form.rating);
    const isFiveStar = ratingNumber === 5;
    const imageUrl = await uploadReviewImage(form.imageFile);

    const { error } = await supabase.from("Reviews").insert([
      {
        name: form.name,
        email: form.email,
        rating: ratingNumber,
        review: form.review,
        image_url: imageUrl,
        approved: isFiveStar,
      },
    ]);

    if (error) {
      alert("Review failed to submit.");
      return;
    }

    if (isFiveStar) {
      alert("Thank you! Your 5-star review was added.");
      fetchFeaturedReviews();
    } else {
      alert("Thank you for your feedback. The owner will review it.");
    }

    setForm({
      name: "",
      email: "",
      rating: 5,
      review: "",
      imageFile: null,
    });

    e.target.reset();
  };

  const activeReview = reviews[activeIndex];

  return (
    <section className="reviews-section">
      <div className="reviews-header">
        <p className="eyebrow">Customer Reviews</p>
        <h2>What Families Are Saying</h2>
        <p>
          Leave a review for Seibab Kennel. 5-star reviews may be featured on
          the website, while other feedback is sent privately to the admin.
        </p>
      </div>

      {activeReview && (
        <>
          <div className="review-showcase">
            <div className="review-showcase-content">
              <div className="stars">★★★★★</div>
              <p className="review-quote">“{activeReview.review}”</p>
              <h4>{activeReview.name}</h4>
            </div>

            {activeReview.image_url && (
              <div className="review-showcase-image">
                <img src={activeReview.image_url} alt={activeReview.name} />
              </div>
            )}
          </div>

          {reviews.length > 1 && (
            <div className="review-dots">
              {reviews.map((review, index) => (
                <button
                  key={review.id}
                  type="button"
                  className={activeIndex === index ? "active" : ""}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <form className="review-form" onSubmit={submitReview}>
        <h3>Leave a Review</h3>

        <div className="review-form-grid">
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <select
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: e.target.value })}
        >
          <option value="5">★★★★★ 5 Stars</option>
          <option value="4">★★★★☆ 4 Stars</option>
          <option value="3">★★★☆☆ 3 Stars</option>
          <option value="2">★★☆☆☆ 2 Stars</option>
          <option value="1">★☆☆☆☆ 1 Star</option>
        </select>

        <textarea
          placeholder="Write your review..."
          value={form.review}
          onChange={(e) => setForm({ ...form, review: e.target.value })}
          required
        />

        <label className="review-upload-box">
          <span>Upload a photo optional</span>
          <small>Show off your puppy or stud!</small>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm({ ...form, imageFile: e.target.files[0] })
            }
          />
        </label>

        <button type="submit">Submit Review</button>
      </form>
    </section>
  );
};

export default Reviews;