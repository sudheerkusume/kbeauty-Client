import React, { useState } from 'react';
import { FiChevronDown, FiHelpCircle, FiSearch, FiMessageCircle } from "react-icons/fi";
import { FaChevronRight, FaWifi, FaMobileAlt, FaBatteryFull } from "react-icons/fa";

import API_BASE_URL from "../config";
import phoneMockup from '../assets/Phone.JPG';
import AOS from 'aos';
import 'aos/dist/aos.css';

const STATIC_FAQS = [
    {
        id: 1,
        category: "General",
        question: "What is K-Beauty?",
        answer: "K-Beauty refers to skincare and makeup products that originate from South Korea. It's known for its focus on skin health, hydration, and an illuminated 'glass skin' look, often using natural ingredients combined with innovative technology."
    },
    {
        id: 2,
        category: "General",
        question: "Are your products authentic?",
        answer: "Yes, 100%. We source our products directly from authorized distributors and brands in South Korea. Every product comes with a guarantee of authenticity."
    },
    {
        id: 3,
        category: "Products",
        question: "How do I choose the right product for my skin type?",
        answer: "We categorize our products by skin type (Dry, Oily, Sensitive, Combination). You can use our filters on the Shop All page or contact our experts through the Contact page for personalized recommendations."
    },
    {
        id: 4,
        category: "Shipping",
        question: "Where do you ship from?",
        answer: "We ship all orders from our headquarters in Kakinada, Andhra Pradesh, ensuring faster delivery across India."
    },
    {
        id: 5,
        category: "Payments",
        question: "What payment methods do you accept?",
        answer: "We accept all major credit/debit cards, UPI (Google Pay, PhonePe, Paytm), and Net Banking. Cash on Delivery (COD) is also available for most pin codes."
    }
];

const Faq = () => {
    const [activeCategory, setActiveCategory] = useState("General");
    const [selectedFaq, setSelectedFaq] = useState(STATIC_FAQS.find(f => f.category === "General"));

    const categories = ["General", "Products", "Shipping", "Payments"];
    const filteredFaqs = STATIC_FAQS.filter(faq => faq.category === activeCategory);

    const handleQuestionClick = (faq) => {
        setSelectedFaq(faq);
    };

    return (
        <section className="faq-page py-5">
            <div className="container py-lg-5">
                <div className="text-center mb-5">
                    <span className="contact-tag">Customer Support</span>
                    <h1 className="contact-title display-3">Got <span>Questions?</span></h1>
                    <p className="lead text-light mx-auto" style={{ maxWidth: '650px', opacity: 0.9 }}>
                        Browse our categories and select a question to see the detailed guide
                        in our K-Beauty mobile assistant.
                    </p>
                </div>

                <div className="row g-5 mt-4 justify-content-center">
                    {/* Left Column: Compact Categories & Questions */}
                    <div className="col-lg-6">
                        <div className="faq-selection-wrapper">
                            {/* Compact Vertical Categories Sidebar */}
                            <div className="faq-category-sidebar">
                                <div className="d-flex flex-column gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => { setActiveCategory(cat); }}
                                            className={`faq-cat-sidebar-btn ${activeCategory === cat ? 'active' : ''}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Column 2: Selection Cards */}
                            <div className="faq-questions-results">
                                <h5 className="fw-bold mb-4 text-glow-gold">
                                    <FiMessageCircle className="me-2" />
                                    {activeCategory} Support
                                </h5>
                                <div className="faq-selection-cards-stack">
                                    {filteredFaqs.length > 0 ? (
                                        filteredFaqs.map((faq, index) => (
                                            <div
                                                key={faq.id}
                                                className={`faq-mini-card ${selectedFaq?.id === faq.id ? 'active' : ''}`}
                                                onClick={() => handleQuestionClick(faq)}
                                            >
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className={`faq-status-dot ${selectedFaq?.id === faq.id ? 'active' : ''}`}></div>
                                                    <h6 className="mb-0 fw-bold">{faq.question}</h6>
                                                </div>
                                                <FaChevronRight className="arrow-small" />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-muted">Loading...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Large, Clear Phone Mockup */}
                    <div className="col-lg-6">
                        <div className="faq-phone-showcase-v2">
                            <div className="phone-wrapper-clear ">
                                <img src={phoneMockup} alt="Clear Phone UI" className="phone-asset-hd" />

                                <div className="phone-screen-clear">
                                    <div className="phone-status-bar-hd">
                                        <div className="time">12:30</div>
                                        <div className="icons">
                                            <FaWifi />
                                            <FaMobileAlt />
                                            <FaBatteryFull />
                                        </div>
                                    </div>

                                    {/* Hardware Notch Mimic */}
                                    <div className="hardware-notch"></div>


                                    <div className="phone-content-scroller">
                                        {selectedFaq ? (
                                            <div className="hd-answer-view animate__animated animate__fadeIn">
                                                <span className="hd-tag">{selectedFaq.category}</span>
                                                <h3 className="hd-q-text">{selectedFaq.question}</h3>
                                                <div className="hd-accent-line"></div>
                                                <div className="hd-answer-box">
                                                    <p className="hd-a-text">{selectedFaq.answer}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="hp-empty">
                                                <p>Select a question <br /> to get started</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="phone-home-line"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Faq;