import React, { useState } from 'react';
import { FiTruck, FiAward, FiUsers, FiX } from 'react-icons/fi';
import { RiPlantLine } from 'react-icons/ri';

const ShippingDetails = () => {
    const [activeDetail, setActiveDetail] = useState(null);
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
                        <div key={index} className="col-6 col-sm-6 col-lg-3 text-center px-lg-4 px-1 px-md-3">
                            <div className="feature-card h-100 p-3 p-md-4 d-flex flex-column align-items-center justify-content-center">
                                <div className="icon-wrapper mb-4 d-flex justify-content-center align-items-center">
                                    {detail.icon}
                                </div>
                                <h5 className="feature-title mb-3">
                                    {detail.title}
                                </h5>
                                <p className="feature-desc mb-0">
                                    {detail.desc}
                                </p>
                                <button
                                    className="d-block d-md-none btn-more-shipping mt-2"
                                    onClick={() => setActiveDetail(detail)}
                                >
                                    More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Premium K-Beauty Modal */}
            {activeDetail && (
                <div className="shipping-modal-overlay d-flex d-md-none align-items-center justify-content-center px-3" onClick={() => setActiveDetail(null)}>
                    <div className="shipping-modal-content p-4 text-center" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setActiveDetail(null)}>
                            <FiX size={20} />
                        </button>
                        <div className="modal-icon-wrapper mb-4 mx-auto d-flex justify-content-center align-items-center">
                            {activeDetail.icon}
                        </div>
                        <h3 className="modal-title mb-3">{activeDetail.title}</h3>
                        <p className="modal-desc">{activeDetail.desc}</p>
                    </div>
                </div>
            )}
            
            {/* Embedded CSS for Premium Dark Theme & Hover Effects */}
            <style>{`
                .premium-shipping-section {
                    background-color: var(--bg-cream); /* Sleek cream background */
                    border-radius: 20px;
                    box-shadow: var(--shadow-soft);
                    position: relative;
                    margin-left: auto;
                    margin-right: auto;
                    max-width: 1400px;
                }

                .feature-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border-soft);
                    border-radius: 16px;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: default;
                }

                .feature-card:hover {
                    transform: translateY(-10px);
                    background: rgba(232, 180, 184, 0.05); /* Subtle blush pink tint */
                    border-color: var(--pink-accent);
                    box-shadow: var(--shadow-hover);
                }

                .icon-wrapper {
                    color: var(--pink-accent); /* Soft blush pink */
                    height: 80px;
                    width: 80px;
                    background: rgba(232, 180, 184, 0.1); /* Soft pink background circle */
                    border-radius: 50%;
                    transition: all 0.4s ease;
                }

                .feature-card:hover .icon-wrapper {
                    background: var(--pink-accent);
                    color: #fff;
                    transform: scale(1.1);
                    box-shadow: 0 0 15px rgba(232, 180, 184, 0.4);
                }

                .feature-title {
                    font-weight: 600;
                    color: var(--text-primary);
                    font-size: 1.15rem;
                    letter-spacing: 0.3px;
                    transition: color 0.3s ease;
                }

                .feature-card:hover .feature-title {
                    color: var(--text-primary);
                }

                .feature-desc {
                    font-size: 0.85rem;
                    line-height: 1.6;
                    color: var(--text-secondary);
                    font-weight: 400;
                    transition: color 0.3s ease;
                    display: -webkit-box;
                    -webkit-line-clamp: unset;
                    -webkit-box-orient: vertical;
                    overflow: visible;
                }

                @media (max-width: 768px) {
                    .feature-desc {
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                        display: -webkit-box;
                    }
                    
                    .btn-more-shipping {
                        background: none;
                        border: none;
                        color: var(--pink-accent);
                        font-size: 11px;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        padding: 0;
                        border-bottom: 1px solid var(--pink-accent);
                        cursor: pointer;
                    }

                    /* Modal Styles */
                    .shipping-modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.7);
                        backdrop-filter: blur(8px);
                        z-index: 9999;
                        animation: fadeIn-ship 0.3s ease;
                    }

                    .shipping-modal-content {
                        background: var(--bg-cream);
                        border: 1px solid var(--border-soft);
                        border-radius: 24px;
                        width: 100%;
                        max-width: 320px;
                        position: relative;
                        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                        animation: slideUp-ship 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    }

                    .modal-close-btn {
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: rgba(232, 180, 184, 0.1);
                        border: none;
                        color: var(--pink-accent);
                        height: 32px;
                        width: 32px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .modal-icon-wrapper {
                        color: var(--pink-accent);
                        height: 70px;
                        width: 70px;
                        background: rgba(232, 180, 184, 0.1);
                        border-radius: 50%;
                    }

                    .modal-title {
                        font-weight: 700;
                        color: var(--text-primary);
                        letter-spacing: 0.5px;
                    }

                    .modal-desc {
                        font-size: 14px;
                        color: var(--text-secondary);
                        line-height: 1.6;
                    }

                    @keyframes fadeIn-ship {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }

                    @keyframes slideUp-ship {
                        from { transform: translateY(30px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                }

                .feature-card:hover .feature-desc {
                    color: var(--text-secondary);
                }
            `}</style>
        </div>
    );
};

export default ShippingDetails;
