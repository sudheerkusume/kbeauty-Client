import React, { useState, useEffect } from 'react';
import './SkinQuiz.css';
import { IoCloseOutline } from 'react-icons/io5';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import { Link } from 'react-router-dom';

const SkinQuiz = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [selections, setSelections] = useState({
        skinType: null,
        concern: null
    });
    const [recommendations, setRecommendations] = useState([]);

    const getRouteCategory = (category) => {
        if (category === 'Skincare') return 'SkinCare';
        return category;
    };

    const steps = [
        {
            id: 1,
            title: "What's your skin type?",
            options: ["Dry", "Oily", "Combination", "Sensitive"]
        },
        {
            id: 2,
            title: "What is your primary concern?",
            options: ["Hydration", "Acne", "Aging", "Brightening"]
        }
    ];

    const handleSelect = (option) => {
        if (step === 1) {
            setSelections({ ...selections, skinType: option });
            setStep(2);
        } else {
            setSelections({ ...selections, concern: option });
            fetchRecommendations(option);
            setStep(3);
        }
    };

    const fetchRecommendations = (concern) => {
        // Simple mock matching for now - in production, this would query the DB
        axios.get(`${API_BASE_URL}/products`)
            .then(res => {
                const results = res.data.filter(p =>
                    p.description.toLowerCase().includes(concern.toLowerCase()) ||
                    p.benefits.some(b => b.toLowerCase().includes(concern.toLowerCase()))
                );
                setRecommendations(results.slice(0, 3));
            })
            .catch(err => console.log(err));
    };

    if (!isOpen) return null;

    return (
        <div className="quiz-overlay" onClick={onClose}>
            <div className="quiz-modal" onClick={e => e.stopPropagation()}>
                <button className="quiz-close" onClick={onClose}><IoCloseOutline size={30} /></button>

                <div className="quiz-content p-4 p-md-5">
                    {step <= 2 ? (
                        <div className="quiz-step-view">
                            <span className="step-count">Step {step} of 2</span>
                            <h2 className="quiz-question mt-3 mb-4">{steps[step - 1].title}</h2>
                            <div className="quiz-options">
                                {steps[step - 1].options.map(opt => (
                                    <button
                                        key={opt}
                                        className="quiz-opt-btn"
                                        onClick={() => handleSelect(opt)}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="quiz-results-view">
                            <h2 className="quiz-question mb-4">Your Personalized Routine</h2>
                            <p className="text-muted mb-4">Based on your {selections.skinType} skin and {selections.concern} concern, we recommend:</p>
                            <div className="recommendations-grid">
                                {recommendations.map(prod => (
                                    <Link
                                        to={`/${getRouteCategory(prod.category)}/${prod.id}`}
                                        className="rec-item-link"
                                        key={prod.id}
                                        onClick={onClose}
                                    >
                                        <div className="rec-item">
                                            <div className="rec-img"><img src={prod.images?.[0] || prod.image} alt={prod.title} /></div>
                                            <h5 className="rec-title mt-2">{prod.title}</h5>
                                            <span className="rec-price">₹{prod.offerPrice}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <button className="btn-editorial-luxe mt-5" onClick={onClose}>Shop My Routine</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkinQuiz;
