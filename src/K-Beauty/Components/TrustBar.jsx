import React from 'react';
import { IoShieldCheckmarkOutline, IoGlobeOutline, IoSparklesOutline } from 'react-icons/io5';
import './TrustBar.css';

const TrustBar = () => {
    const trustItems = [
        {
            icon: <IoShieldCheckmarkOutline size={24} />,
            title: "100% Authentic",
            desc: "Direct from Seoul"
        },
        {
            icon: <IoGlobeOutline size={24} />,
            title: "Global Shipping",
            desc: "Fast & Secure"
        },
        {
            icon: <IoSparklesOutline size={24} />,
            title: "Expertly Curated",
            desc: "Tested & Proven"
        }
    ];

    return (
        <div className="trust-bar-wrap py-4 border-bottom border-top bg-black border-secondary">
            <div className="container">
                <div className="row justify-content-center g-4">
                    {trustItems.map((item, index) => (
                        <div className="col-6 col-md-4" key={index}>
                            <div className="trust-item d-flex align-items-center justify-content-center">
                                <div className="trust-icon me-3">
                                    {item.icon}
                                </div>
                                <div className="trust-content text-start">
                                    <h6 className="mb-0 fw-bold text-white" style={{ fontSize: '13px', letterSpacing: '1px' }}>{item.title}</h6>
                                    <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrustBar;
