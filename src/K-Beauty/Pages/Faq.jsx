import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiChevronDown, FiHelpCircle, FiSearch, FiMessageCircle } from "react-icons/fi";
import { FaChevronRight, FaWifi, FaMobileAlt, FaBatteryFull } from "react-icons/fa";

import API_BASE_URL from "../config";
import phoneMockup from '../assets/Phone.JPG';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Faq = () => {
    const [faqs, setFaqs] = useState([]);
    const [activeCategory, setActiveCategory] = useState("General");
    const [selectedFaq, setSelectedFaq] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/faq`);
            setFaqs(response.data);
            const initial = response.data.find(f => f.category === "General");
            if (initial) setSelectedFaq(initial);
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        }
    };

    const categories = ["General", "Products", "Shipping", "Payments"];
    const filteredFaqs = faqs.filter(faq => faq.category === activeCategory);

    const handleQuestionClick = (faq) => {
        setSelectedFaq(faq);
    };

    return (
        <section className="faq-page py-5">
            <div className="container py-lg-5">
                <div className="text-center mb-5" data-aos="fade-up">
                    <span className="contact-tag">Customer Support</span>
                    <h1 className="contact-title display-3">Got <span>Questions?</span></h1>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: '650px' }}>
                        Browse our categories and select a question to see the detailed guide
                        in our K-Beauty mobile assistant.
                    </p>
                </div>

                <div className="row g-5 mt-4 justify-content-center">
                    {/* Left Column: Compact Categories & Questions */}
                    <div className="col-lg-6" data-aos="fade-right">
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
                                <h5 className="fw-bold mb-4 text-coral opacity-75">{activeCategory} Support</h5>
                                <div className="faq-selection-cards-stack">
                                    {filteredFaqs.length > 0 ? (
                                        filteredFaqs.map((faq, index) => (
                                            <div
                                                key={faq.id}
                                                className={`faq-mini-card ${selectedFaq?.id === faq.id ? 'active' : ''}`}
                                                onClick={() => handleQuestionClick(faq)}
                                                data-aos="fade-up"
                                                data-aos-delay={index * 50}
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
                    <div className="col-lg-6" data-aos="fade-left">
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