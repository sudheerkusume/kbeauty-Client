import React, { useEffect, useState } from 'react';
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
                        const discountPercent = product.price && product.offerPrice
                            ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
                            : 0;

                        return (
                        <div className="col-6 col-md-3" key={product._id}>
                            <Link to={`/${product.category === 'Makeup' ? 'Makeup' : 'SkinCare'}/${product._id}`} className="trending-card">
                                <div className="trending-img-container">
                                    {discountPercent > 20 && (
                                        <div className="premium-discount-badge" style={{ zIndex: 11 }}>
                                            <span className="discount-val-p">{discountPercent}</span><span className="animated-percent">%</span>
                                            <span className="discount-label-p">OFF</span>
                                        </div>
                                    )}
                                    <img 
                                        src={product.images?.[0]} 
                                        alt={product.title} 
                                        className="trending-img" 
                                        loading="lazy"
                                    />
                                    <div className="position-absolute top-0 end-0 m-2 d-flex align-items-center gap-2" style={{ zIndex: 10 }}>
                                        <div className="trending-rating-badge position-relative top-0 right-0 m-0">
                                            <FaStar size={12} className="me-1" /> {product.rating}
                                        </div>
                                        <WishlistButton product={product} />
                                    </div>
                                </div>
                                <div className="trending-info pt-3">
                                    <span
                                        className="trending-brand-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            navigate(`/brand/${product.brand}`);
                                        }}
                                    >
                                        {product.brand}
                                    </span>
                                    <h3 className="trending-name text-white">{product.title}</h3>
                                    <div className="trending-price-box">
                                        <span className="trending-offer">₹{product.offerPrice}</span>
                                        {product.price > product.offerPrice && (
                                            <span className="trending-old text-decoration-line-through">₹{product.price}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TrendingProducts;
