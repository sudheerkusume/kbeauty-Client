import React from "react";
import iconMain from "../assets/iconMain.PNG";
import iconMain1 from "../assets/iconMain1.jpg"
import iconMain2 from "../assets/iconMain2.jpg"
import iconMain3 from "../assets/iconMain3.PNG"
import iconMain4 from "../assets/iconMain4.PNG"
import iconMain5 from "../assets/iconMain5.JPG"
const IconPage = () => {
    const marqueeItems = [
        { text: "Skin Luxury Essentials", icon: iconMain },
        { text: "Pure Glow Ritual", icon: iconMain1 },
        { text: "Everyday Radiance", icon: iconMain2 },
        { text: "Timeless Beauty Care", icon: iconMain3 },
        { text: "Redefine Your Glow", icon: iconMain4 },
        { text: "Always Flawless Skin", icon: iconMain5 },
    ];

    return (
        <div className="premium-marquee-section">
            <div className="marquee-outer-container">
                <div className="marquee-inner-wrapper">
                    <div className="marquee-track">
                        {/* Repeat items multiple times for an ultra-smooth loop */}
                        {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
                            <div key={index} className="marquee-group">
                                <div className="marquee-icon-wrapper">
                                    <img
                                        src={item.icon}
                                        alt="ritual icon"
                                        className="marquee-icon-img"
                                    />
                                </div>
                                <span className="marquee-label">{item.text}</span>
                                <div className="marquee-dot"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .premium-marquee-section {
                    background: #000;
                    padding: 2.5rem 0;
                    position: relative;
                    z-index: 10;
                    border-bottom: 1px solid rgba(212, 175, 55, 0.15);
                    overflow: hidden;
                }

                .marquee-outer-container {
                    position: relative;
                    width: 100%;
                    /* Edge fade effect */
                    mask-image: linear-gradient(
                        to right, 
                        transparent, 
                        black 15%, 
                        black 85%, 
                        transparent
                    );
                    -webkit-mask-image: linear-gradient(
                        to right, 
                        transparent, 
                        black 15%, 
                        black 85%, 
                        transparent
                    );
                }

                .marquee-inner-wrapper {
                    overflow: hidden;
                    white-space: nowrap;
                    display: flex;
                }

                .marquee-track {
                    display: flex;
                    align-items: center;
                    animation: marquee-infinite 60s linear infinite;
                    will-change: transform;
                    gap: 0;
                }

                .marquee-group {
                    display: flex;
                    align-items: center;
                    padding: 0 3rem; /* Reduced from 3.5rem */
                    flex-shrink: 0;
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    cursor: default;
                }

                .marquee-group:hover {
                    transform: scale(1.05);
                }

                .marquee-icon-wrapper {
                    width: 65px;
                    height: 65px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1.5px solid rgba(212, 175, 55, 0.3);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 1.5rem;
                    transition: all 0.5s ease;
                    position: relative;
                    box-shadow: 0 0 15px rgba(212, 175, 55, 0.1);
                }

                .marquee-group:hover .marquee-icon-wrapper {
                    background: rgba(212, 175, 55, 0.1);
                    border-color: #D4AF37;
                    box-shadow: 0 0 20px rgba(212, 175, 55, 0.15);
                    transform: rotate(8deg);
                }

                .marquee-icon-img {
                    width: 58px; /* Increased from 38px */
                    height: 58px; /* Increased from 38px */
                    object-fit: contain;
                    border-radius: 50%; /* Ensures perfect fit in the circle */
                    filter: saturate(1.1) brightness(1.2);
                    transition: transform 0.4s ease;
                }

                .marquee-group:hover .marquee-icon-img {
                    transform: scale(1.15);
                }

                .marquee-label {
                    color: rgba(255, 255, 255, 0.85);
                    font-size: 0.95rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 2.5px;
                    font-family: 'Outfit', sans-serif;
                    transition: all 0.4s ease;
                }

                .marquee-group:hover .marquee-label {
                    color: #D4AF37;
                    letter-spacing: 3px;
                }

                .marquee-dot {
                    width: 4px;
                    height: 4px;
                    background: #D4AF37;
                    border-radius: 50%;
                    margin-left: 2rem; /* Reduced from 3.5rem */
                    opacity: 0.3;
                    /* Hide dot on last item if needed, but not necessary for infinite loop */
                }

                @keyframes marquee-infinite {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }

                .premium-marquee-section:hover .marquee-track {
                    animation-play-state: paused;
                }

                /* Mobile Optimization */
                @media (max-width: 991px) {
                    .premium-marquee-section {
                        padding: 1.8rem 0;
                    }
                    .marquee-group {
                        padding: 0 1.5rem; /* Reduced from 2.5rem */
                    }
                    .marquee-icon-wrapper {
                        width: 52px;
                        height: 52px;
                        margin-right: 1rem;
                    }
                    .marquee-icon-img {
                        width: 46px; /* Increased from 30px */
                        height: 46px; /* Increased from 30px */
                    }
                    .marquee-label {
                        font-size: 0.75rem;
                        letter-spacing: 1.5px !important;
                    }
                    .marquee-track {
                        animation-duration: 40s;
                    }
                    .marquee-dot {
                        margin-left: 1.5rem; /* Reduced from 2.5rem */
                    }
                }
            `}</style>
        </div>
    );
};

export default IconPage;