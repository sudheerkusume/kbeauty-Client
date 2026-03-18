import React, { useEffect } from 'react';
import AOS from 'aos';

const RefundPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <div className="bg-black text-white py-5 min-vh-100">
            <div className="container py-5">
                <h1 className="display-4 mb-5 text-gold" style={{ fontFamily: "'Playfair Display', serif" }}>Refund & Cancellation Policy</h1>
                <div className="lh-lg opacity-75">
                    <p>Last Updated: March 18, 2026</p>
                    <section className="mb-4">
                        <h3 className="text-white mb-3">1. Cancellations</h3>
                        <p>Orders can only be cancelled within 2 hours of placement. Once the order has been processed or shipped, it cannot be cancelled.</p>
                    </section>
                    <section className="mb-4">
                        <h3 className="text-white mb-3">2. Returns</h3>
                        <p>Due to the hygienic nature of beauty products, we only accept returns if the product is damaged during transit or if the wrong item was delivered. Please notify us within 24 hours of delivery.</p>
                    </section>
                    <section className="mb-4">
                        <h3 className="text-white mb-3">3. Refunds</h3>
                        <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed to your original method of payment within 5-7 business days.</p>
                    </section>
                    <section className="mb-4">
                        <h3 className="text-white mb-3">4. Contact for Refunds</h3>
                        <p>For any refund or return related queries, please contact us at kbeautymartworkspaces@gmail.com.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
