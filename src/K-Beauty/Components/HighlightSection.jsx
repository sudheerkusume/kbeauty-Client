import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_BASE_URL from "../../config";
import ProductCardMinimal from './ProductCardMinimal';
import Banner5 from '../assets/MainBanner5.png'; // Using this as the mask
import './HighlightSection.css';

const HighlightSection = () => {
    const [highlightProducts, setHighlightProducts] = useState([]);

    useEffect(() => {
        // Fetch 4 products for the right-side grid
        axios.get(`${API_BASE_URL}/products?limit=4`)
            .then((res) => {
                // Get 4 products, ideally taking ones that are available
                const selected = (res.data || []).slice(0, 4).map((p, idx) => {
                    // Force the 4th item to be a bestseller for the UI preview
                    if (idx === 3) p.isBestSeller = true;
                    return p;
                });
                setHighlightProducts(selected);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <section className="highlight-section py-5" style={{ background: 'var(--bg-cream)' }}>
            <div className="container">
                <div className="section-header text-left mb-4 justify-content-start">
                    <h2 className="section-title text-start pe-4 m-0 display-inline" style={{ background: 'var(--bg-cream)', color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>THIS WEEK'S HIGHLIGHT</h2>
                    <div className="header-divider flex-grow-1 header-line-long"></div>
                </div>

                <div className="row g-4 highlight-layout">
                    {/* Left: Featured Banner */}
                    <div className="col-12 col-lg-4">
                        <div className="featured-banner-card">
                            <div className="featured-content">
                                <h3>YOUTH RENEW<br />MASK</h3>
                                <p>Perform and continues with youth your new skin — in youth renew mask.</p>
                                <button className="btn-secondary mt-3">SHOP THE MASK</button>
                            </div>
                            {/* We just use a background or put the image at bottom left */}
                            <div className="featured-img-wrap">
                                <img src={Banner5} alt="Youth Renew Mask Model" />
                            </div>
                        </div>
                    </div>

                    {/* Right: 4 Column Grid */}
                    <div className="col-12 col-lg-8">
                        <div className="row g-3">
                            {highlightProducts.map((product) => (
                                <div className="col-6 col-md-3" key={product._id || Math.random()}>
                                    <ProductCardMinimal product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HighlightSection;
