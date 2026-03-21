import axios from "axios";
import API_BASE_URL from "../config";
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import WishlistButton from '../WishlistButton';
import './BestSeller.css';

const BestSellers = () => {
    const [products, setProducts] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const headerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/products?bestseller=true`)
            .then((res) => {
                const sortedData = (res.data || []).sort((a, b) => b._id.localeCompare(a._id));
                setProducts(sortedData);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.10 }
        );

        if (headerRef.current) {
            observer.observe(headerRef.current);
        }

        return () => {
            if (headerRef.current) {
                observer.unobserve(headerRef.current);
            }
        };
    }, []);

    return (
        <div className="container-fluid py-5" style={{ background: 'var(--bg-cream)', borderBottom: '1px solid var(--border-soft)' }}>
            <div className="container py-lg-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-md-5 mb-3">
                    <div className="mb-md-4 mb-2">
                        <span className="section-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '4px', color: 'var(--pink-accent)', display: 'block', marginBottom: '12px' }}>
                            Our Best Selection
                        </span>
                        <h4
                            ref={headerRef}
                            className={`laneige-title animated-marker ${isVisible ? 'in-view' : ''}`}
                            style={{ fontSize: '2.0rem', fontWeight: 600, color: 'var(--text-primary)', '--pink-accent': '#e1949eff' }}
                        >
                            BEST SELLERS
                            <svg className='svg-marker' viewBox='0 0 201 14' preserveAspectRatio='none'>
                                <path d="M3 10.5732c55.565 6.61382 168.107 -0.117058 197.753 4.63415"></path>
                            </svg>
                        </h4>
                    </div>
                    <button
                        className="btn-editorial-luxe d-none d-md-inline-flex"
                        onClick={() => navigate("/BestSellers")}
                    >
                        Shop All <IoIosArrowForward size={14} className="ms-2" />
                    </button>
                </div>

                {/* 4-Card Product Grid */}
                <div className="row gx-4 gy-4 signature-row-fix">
                    {products.slice(0, 4).map((product, index) => {
                        const discountPercent = product.price && product.offerPrice
                            ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
                            : 0;

                        return (
                            <div className="col-6 col-md-3" key={product._id || index}>
                                <Link to={`/BestSellers/${product._id}`} className="signature-premium-card">
                                    {discountPercent > 20 && (
                                        <div className="premium-discount-badge">
                                            <span className="discount-val-p">{discountPercent}<span className="animated-percent">%</span></span>
                                            <span className="discount-label-p">OFF</span>
                                        </div>
                                    )}

                                    <div className="premium-img-container">
                                        <img
                                            src={product.images?.[0]}
                                            alt={product.title}
                                            className="premium-main-img"
                                            loading="lazy"
                                            onError={(e) => (e.target.src = "https://via.placeholder.com/600x800")}
                                        />
                                        {product.images?.[1] && (
                                            <img
                                                src={product.images[1]}
                                                alt={product.title}
                                                className="premium-hover-img"
                                                loading="lazy"
                                                onError={(e) => (e.target.src = "https://via.placeholder.com/600x800")}
                                            />
                                        )}
                                        <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }}>
                                            <WishlistButton product={product} />
                                        </div>
                                    </div>

                                    <div className="card-content-p">
                                        <span className="premium-care-label">PREMIUM CARE</span>
                                        <h3 className="premium-product-title" style={{ color: '#3d2c23', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                                            {product.title || product.name || "K-Beauty Product"}
                                        </h3>

                                        <div className="premium-price-wrap">
                                            {product.price > product.offerPrice && (
                                                <span className="premium-old-price">₹{product.price}</span>
                                            )}
                                            <span className="premium-offer-price">₹{product.offerPrice}</span>
                                        </div>

                                        <button className="signature-shop-btn">
                                            Shop Now
                                        </button>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile-Only Shop All Button at Bottom */}
                <div className="d-flex d-md-none justify-content-center mt-4 pt-2">
                    <button
                        className="btn-editorial-luxe"
                        onClick={() => navigate("/BestSellers")}
                    >
                        Shop All <IoIosArrowForward size={14} className="ms-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BestSellers;
