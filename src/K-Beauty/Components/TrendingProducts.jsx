import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import WishlistButton from '../WishlistButton';
import './TrendingProducts.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import API_BASE_URL from "../config";

const TrendingProducts = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/products`)
            .then((res) => {
                // Sorting by _id descending (Newest First)
                const sortedAll = (res.data || []).sort((a, b) => b._id.localeCompare(a._id));
                // Filter for highly rated products (4.0+) from the newest ones
                const trending = sortedAll.filter(p => p.rating >= 4).slice(0, 4);
                setProducts(trending);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <section className="trending-section py-5 bg-black">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <span className="trending-subtitle">Customer Favorites</span>
                        <h2 className="trending-title">Trending Products</h2>
                    </div>
                    <Link to="/SkinCare" className="trending-view-all">View All Products</Link>
                </div>

                <div className="row g-4 mobile-scroll-row">
                    {products.map((product) => {
                        const combo = product.combo;
                        const isCombo = (combo && (combo.isCombo === true || combo.isCombo === "true")) || (product.title && product.title.includes(' + '));
                        const comboSavings = combo?.savings || (product.price - product.offerPrice);

                        const discountPercent = product.price && product.offerPrice
                            ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
                            : 0;

                        const targetLink = `/${product.category === 'Makeup' ? 'Makeup' : 'SkinCare'}/${product._id}`;

                        return (
                            <div className="col-6 col-md-3" key={product._id}>
                                {isCombo ? (
                                    <Link to={targetLink} className="combo-ref-card">
                                        <div className="combo-ref-badge-wrap">
                                            <div className="combo-ref-badge">Combo Deal</div>
                                        </div>
                                        <div className="combo-ref-savings-bar">
                                            Save <span className="save-text">₹{comboSavings}</span> | {discountPercent}% OFF
                                        </div>
                                        <div className="combo-ref-images">
                                            <img src={product.images?.[0] || 'https://via.placeholder.com/150'} className="combo-ref-img" alt="" />
                                            <span className="combo-ref-plus">+</span>
                                            <img src={product.images?.[1] || product.images?.[0] || 'https://via.placeholder.com/150'} className="combo-ref-img" alt="" />
                                        </div>
                                        <div className="combo-ref-info">
                                            <div className="combo-ref-includes">Includes: {product.title}</div>
                                            <div className="combo-ref-price-wrap">
                                                <span className="combo-ref-price-new">₹{product.offerPrice}</span>
                                                <span className="combo-ref-price-old">₹{product.price}</span>
                                            </div>
                                            <button className="combo-ref-btn-gold" onClick={(e) => { e.preventDefault(); navigate(targetLink); }}>
                                                Shop
                                            </button>
                                        </div>
                                    </Link>
                                ) : (
                                    <Link to={targetLink} className="trending-card">
                                        <div className="trending-img-container">
                                            {discountPercent > 20 && (
                                                <div className="premium-discount-badge" style={{ zIndex: 11 }}>
                                                    <span className="discount-val-p">{discountPercent}</span><span className="animated-percent">%</span>
                                                    <span className="discount-label-p">OFF</span>
                                                </div>
                                            )}
                                            <img src={product.images?.[0] || 'https://via.placeholder.com/400'} alt={product.title} className="trending-img" />
                                            <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }}>
                                                <WishlistButton product={product} />
                                            </div>
                                        </div>
                                        <div className="trending-info pt-3">
                                            <span className="trending-brand-link" onClick={() => navigate(`/brand/${product.brand}`)}>{product.brand}</span>
                                            <h3 className="trending-name mb-1">{product.title}</h3>
                                            <div className="trending-price-box">
                                                <p className="trending-offer mb-0">₹{product.offerPrice}</p>
                                                <span className="trending-old text-decoration-line-through">₹{product.price}</span>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TrendingProducts;
