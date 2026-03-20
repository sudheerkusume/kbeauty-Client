import React from 'react';
import { FiTruck, FiAward, FiUsers } from 'react-icons/fi';
import { RiPlantLine } from 'react-icons/ri';

const ShippingDetails = () => {
    const details = [
        {
            icon: <FiTruck size={42} strokeWidth={1.2} />,
            title: "Fast Shipping",
            desc: "Worldwide delivery, secure packaging, and quick order processing."
        },
        {
            icon: <RiPlantLine size={42} />, 
            title: "Eco Friendly",
            desc: "Sustainability, cruelty-free, recyclable packaging, and ethical sourcing."
        },
        {
            icon: <FiAward size={42} strokeWidth={1.2} />,
            title: "Genuine Products",
            desc: "Authorized retailer, premium quality, and dermatologist-approved formulas."
        },
        {
            icon: <FiUsers size={42} strokeWidth={1.2} />,
            title: "Customer Care",
            desc: "24/7 support, easy returns, and hassle-free shopping experience."
        }
    ];

    return (
        <div className="premium-shipping-section py-5 my-4">
            <div className="container">
                <div className="row g-4 justify-content-center">
                    {details.map((detail, index) => (
                        <div key={index} className="col-12 col-sm-6 col-lg-3 text-center px-lg-4 px-3">
                            <div className="feature-card h-100 p-4 d-flex flex-column align-items-center justify-content-center">
                                <div className="icon-wrapper mb-4 d-flex justify-content-center align-items-center">
                                    {detail.icon}
                                </div>
                                <h5 className="feature-title mb-3">
                                    {detail.title}
                                </h5>
                                <p className="feature-desc mb-0">
                                    {detail.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Embedded CSS for Premium Dark Theme & Hover Effects */}
            <style>{`
                .premium-shipping-section {
                    background-color: #070707; /* Sleek dark background matching image */
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                    position: relative;
                    margin-left: auto;
                    margin-right: auto;
                    max-width: 1400px;
                }

                .feature-card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: default;
                }

                .feature-card:hover {
                    transform: translateY(-10px);
                    background: rgba(255, 42, 122, 0.03); /* Subtle pink tint */
                    border-color: rgba(255, 42, 122, 0.2);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.5), inset 0 0 20px rgba(255, 42, 122, 0.03);
                }

                .icon-wrapper {
                    color: #FF1E74; /* Matches neon pink from image */
                    height: 80px;
                    width: 80px;
                    background: rgba(255, 30, 116, 0.05); /* Soft background circle */
                    border-radius: 50%;
                    transition: all 0.4s ease;
                }

                .feature-card:hover .icon-wrapper {
                    background: rgba(255, 30, 116, 0.15);
                    color: #FF3B8A;
                    transform: scale(1.1);
                    filter: drop-shadow(0 0 15px rgba(255, 30, 116, 0.7)); /* Stunning neon glow */
                }

                .feature-title {
                    font-weight: 600;
                    color: #E0E0E0; /* Bright readable white/gray */
                    font-size: 1.15rem;
                    letter-spacing: 0.3px;
                    transition: color 0.3s ease;
                }

                .feature-card:hover .feature-title {
                    color: #FFFFFF;
                }

                .feature-desc {
                    font-size: 0.9rem;
                    line-height: 1.7;
                    color: #888888; /* Muted gray matching the image context */
                    font-weight: 400;
                    transition: color 0.3s ease;
                }

                .feature-card:hover .feature-desc {
                    color: #AAAAAA;
                }
            `}</style>
        </div>
    );
};

export default ShippingDetails;
