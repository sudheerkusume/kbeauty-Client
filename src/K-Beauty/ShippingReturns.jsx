import React from 'react';

const ShippingReturns = () => {
    return (
        <div className="mt-4">
            <div className="accordion accordion-flush" id="shippingAccordion">
                <div className="accordion-item border-bottom">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed px-0 fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#shipOne">
                            FREE SHIPPING & DELIVERY
                        </button>
                    </h2>
                    <div id="shipOne" className="accordion-collapse collapse" data-bs-parent="#shippingAccordion">
                        <div className="accordion-body px-0 text-muted" style={{ fontSize: '13px' }}>
                            <p>We offer free standard shipping on all orders over ₹2000. For orders below ₹2000, a flat shipping fee of ₹99 will apply.</p>
                            <p>Delivery usually takes 3-5 business days for metro cities and 5-7 business days for other locations.</p>
                        </div>
                    </div>
                </div>
                <div className="accordion-item border-bottom">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed px-0 fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#shipTwo">
                            RETURNS & EXCHANGES
                        </button>
                    </h2>
                    <div id="shipTwo" className="accordion-collapse collapse" data-bs-parent="#shippingAccordion">
                        <div className="accordion-body px-0 text-muted" style={{ fontSize: '13px' }}>
                            <p>We accept returns for unused and unopened products within 7 days of delivery. Due to hygiene reasons, opened or used products cannot be returned.</p>
                            <p>Please contact our support team at support@kbeautymart.com to initiate a return.</p>
                        </div>
                    </div>
                </div>
                <div className="accordion-item border-bottom">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed px-0 fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#shipThree">
                            100% AUTHENTICITY GUARANTEED
                        </button>
                    </h2>
                    <div id="shipThree" className="accordion-collapse collapse" data-bs-parent="#shippingAccordion">
                        <div className="accordion-body px-0 text-muted" style={{ fontSize: '13px' }}>
                            <p>At K-BeautyMart, we source all our products directly from the brands or their authorized distributors in South Korea. We guarantee 100% authenticity for every item we sell.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingReturns;
