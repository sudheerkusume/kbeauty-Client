import React from 'react';
import { FaTruck, FaShieldAlt, FaUndo, FaHeadset } from 'react-icons/fa';

const FeaturesRow = () => {
    const features = [
        {
            icon: <FaTruck />,
            title: "Free Shipping",
            desc: "On orders over ₹2000"
        },
        {
            icon: <FaUndo />,
            title: "Easy Returns",
            desc: "30-day money back guarantee"
        },
        {
            icon: <FaShieldAlt />,
            title: "100% Authentic",
            desc: "Directly from brands"
        },
        {
            icon: <FaHeadset />,
            title: "24/7 Support",
            desc: "Dedicated beauty experts"
        }
    ];

    return (
        <div className="row g-4 py-4 mt-2 border-top border-bottom">
            {features.map((feature, index) => (
                <div key={index} className="col-6 col-md-3 text-center">
                    <div className="mb-2" style={{ fontSize: '24px', color: '#1906ec' }}>
                        {feature.icon}
                    </div>
                    <h6 className="mb-1" style={{ fontSize: '14px', fontWeight: '600' }}>{feature.title}</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '11px' }}>{feature.desc}</p>
                </div>
            ))}
        </div>
    );
};

export default FeaturesRow;
