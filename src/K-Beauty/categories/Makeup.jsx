import axios from "axios";
import API_BASE_URL from "../config";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';

const Makeup = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/products?category=Makeup`)
            .then((res) => {
                setProducts(res.data);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="container-fluid py-5" style={{ background: '#000', borderBottom: '1px solid var(--border-gold)' }}>
            <div className="container py-lg-4">
                {/* Refined Header Section */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-5">
                    <div className="mb-4 mb-md-0">
                        <span className="section-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '4px', color: '#C8A27C', display: 'block', marginBottom: '12px' }}>
                            Our Best Selection
                        </span>
                        <h2 className="laneige-title" style={{ fontSize: '2.8rem', fontWeight: 600 }}>
                            Makeup
                        </h2>
                    </div>
                    <button
                        className="btn-editorial-luxe"
                        style={{ padding: '12px 25px', fontSize: '0.7rem' }}
                        onClick={() => navigate("/Makeup")}
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
                                <Link to={`/Makeup/${product._id}`} className="signature-premium-card">
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
                                            onError={(e) => (e.target.src = "https://via.placeholder.com/600x800")}
                                        />
                                        {product.images?.[1] && (
                                            <img
                                                src={product.images[1]}
                                                alt={product.title}
                                                className="premium-hover-img"
                                                onError={(e) => (e.target.src = "https://via.placeholder.com/600x800")}
                                            />
                                        )}
                                    </div>

                                    <div className="card-content-p">
                                        <span className="premium-care-label">PREMIUM CARE</span>
                                        <h3 className="premium-product-title">
                                            {product.title}
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
            </div>
        </div>
    );
};

export default Makeup;
