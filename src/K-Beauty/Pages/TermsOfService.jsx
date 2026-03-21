import React, { useEffect } from 'react';
import AOS from 'aos';

const TermsOfService = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <div className="py-5 min-vh-100" style={{ background: 'var(--bg-cream)', color: 'var(--text-primary)' }}>
            <div className="container py-5">
                <h1 className="display-4 mb-5 text-gold" style={{ fontFamily: "'Playfair Display', serif" }}>Terms of Service</h1>
                <div className="lh-lg opacity-75">
                    <p>Last Updated: March 18, 2026</p>
                    <section className="mb-4">
                        <h3 className="text-white mb-3">1. Terms of Use</h3>
                        <p>By accessing this website, you are agreeing to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
                    </section>
                    <section className="mb-4">
                        <h3 className="text-white mb-3">2. User Accounts</h3>
                        <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.</p>
                    </section>
                    <section className="mb-4">
                        <h3 className="text-white mb-3">3. Intellectual Property</h3>
                        <p>The website and its original content, features, and functionality are and will remain the exclusive property of K-Beautymart.</p>
                    </section>
                    <section className="mb-4">
                        <h3 className="text-white mb-3">4. Limitation of Liability</h3>
                        <p>In no event shall K-Beautymart be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
