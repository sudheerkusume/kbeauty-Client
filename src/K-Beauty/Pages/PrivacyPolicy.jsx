import React, { useEffect } from 'react';
import AOS from 'aos';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <div className="bg-black text-white py-5 min-vh-100">
            <div className="container py-5">
                <h1 className="display-4 mb-5 text-gold" style={{ fontFamily: "'Playfair Display', serif" }}>Privacy Policy</h1>
                <div className="lh-lg opacity-75">
                    <p>Last Updated: March 18, 2026</p>
                    <section className="mb-4">
                        <h3 className="text-white mb-3">1. Information We Collect</h3>
                        <p>We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This includes your name, email address, phone number, and shipping address.</p>
                    </section>
                    <section className="mb-4">
                        <h3 className="text-white mb-3">2. How We Use Your Information</h3>
                        <p>We use the information we collect to process your orders, provide customer support, and send you updates about our products and services.</p>
                    </section>
                    <section className="mb-4">
                        <h3 className="text-white mb-3">3. Data Security</h3>
                        <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>
                    </section>
                    <section className="mb-4">
                        <h3 className="text-white mb-3">4. Contact Us</h3>
                        <p>If you have any questions about this Privacy Policy, please contact us at kbeautymartworkspaces@gmail.com or +91 9177509985.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
