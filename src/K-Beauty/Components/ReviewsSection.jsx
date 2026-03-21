import React from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import './ReviewsSection.css';

const ReviewsSection = () => {
    const reviews = [
        {
            id: 1,
            name: "Ananya Sharma",
            role: "Skincare Enthusiast",
            text: "The foam cleanser from Chaom is a game changer! My skin feels so fresh and hydrated after every use. Highly recommend K-Beautymart!",
            rating: 5,
            img: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            id: 2,
            name: "Rahul Verma",
            role: "Daily User",
            text: "Authentic products and amazing delivery speed. The Lador hair oil is literally the best I've used. No frizz at all!",
            rating: 5,
            img: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            id: 3,
            name: "Priya Das",
            role: "Verified Buyer",
            text: "I was skeptical about K-beauty in India, but these guys are legit. The packaging was premium and the product is amazing.",
            rating: 4,
            img: "https://randomuser.me/api/portraits/women/68.jpg"
        }
    ];

    return (
        <section className="reviews-section py-5" style={{ background: 'var(--bg-cream)' }}>
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="section-title" style={{ color: 'var(--text-primary)' }}>What Our Customers Say</h2>
                    <div className="title-underline mx-auto"></div>
                </div>

                <div className="row g-4">
                    {reviews.map((review) => (
                        <div className="col-md-4" key={review.id}>
                            <div className="review-card h-100 p-4">
                                <FaQuoteLeft className="quote-icon mb-3" />
                                <p className="review-text mb-4">"{review.text}"</p>
                                <div className="d-flex align-items-center mt-auto">
                                    <img src={review.img} alt={review.name} className="reviewer-img me-3" />
                                    <div>
                                        <h5 className="reviewer-name mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>{review.name}</h5>
                                        <p className="mb-0 review-role" style={{ fontSize: '12px', color: 'var(--pink-accent)' }}>{review.role}</p>
                                        <div className="rating-stars mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} size={12} color={i < review.rating ? "#FFD700" : "#EEE"} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;
