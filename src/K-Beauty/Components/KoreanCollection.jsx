import API_BASE_URL from "../config";
import { FiPlus } from 'react-icons/fi';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import WishlistButton from '../WishlistButton';
import 'swiper/css';
import 'swiper/css/navigation';
import './KoreanCollection.css';

const KoreanCollection = () => {
    const [products, setProducts] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('Korea');
    const [isFading, setIsFading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsFading(true);
        // Short delay to allow fade-out before data swap
        const timer = setTimeout(() => {
            axios.get(`${API_BASE_URL}/products`)
                .then((res) => {
                    const allProducts = res.data || [];
                    const filtered = allProducts
                        .filter(p => p.Country === selectedCountry)
                        .filter(p => !p.combo || (p.combo.isCombo !== true && p.combo.isCombo !== "true"))
                        .sort((a, b) => b._id.localeCompare(a._id));
                    setProducts(filtered);
                    // Fade back in after content is ready
                    setTimeout(() => setIsFading(false), 50);
                })
                .catch((err) => {
                    console.log(err);
                    setIsFading(false);
                });
        }, 300);

        return () => clearTimeout(timer);
    }, [selectedCountry]);

    return (
        <section className="korean-section py-5" style={{ background: 'var(--bg-cream)' }}>
            <div className="container">
                <div className="text-center mb-5">
                    <span className="korean-subtitle">Authentic Selection</span>
                    {/* Premium Section Title with High Contrast */}
                    {/* <h2 className="korean-title mb-2" style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
                        The {selectedCountry} <span style={{ color: 'var(--pink-accent)' }}>Collection</span>

                    </h2> */}
                    <h1 className="special-title" style={{ color: 'var(--text-primary)' }}>
                        The {selectedCountry} <span style={{ color: 'var(--pink-accent)' }}>Collection</span></h1>

                    <p className="korean-desc mx-auto" style={{ maxWidth: '600px' }}>
                        Experience the gold standard of beauty with our curated selection of authentic {selectedCountry} skincare and makeup.
                    </p>
                </div>

                <div className="filter-tabs d-flex justify-content-center mb-5">
                    <div className="filter-pill-wrap">
                        <button
                            className={`pill-btn ${selectedCountry === 'Korea' ? 'active' : ''}`}
                            onClick={() => setSelectedCountry('Korea')}
                        >
                            Korean
                        </button>
                        <button
                            className={`pill-btn ${selectedCountry === 'India' ? 'active' : ''}`}
                            onClick={() => setSelectedCountry('India')}
                        >
                            Indian
                        </button>
                    </div>
                </div>

                <div className={`korean-slider-wrap position-relative transition-container ${isFading ? 'fading-out' : 'fading-in'}`}>
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={20}
                        slidesPerView={2.2}
                        navigation={{
                            prevEl: '.korean-prev',
                            nextEl: '.korean-next',
                        }}
                        breakpoints={{
                            768: { slidesPerView: 2.5 },
                            1024: { slidesPerView: 3.5 },
                        }}
                    >
                        {products.map((product) => {
                            // Defensive parsing in case backend returns combo as a string
                            let combo = product.combo;
                            if (typeof combo === 'string') {
                                try { combo = JSON.parse(combo); } catch (e) { combo = null; }
                            }

                            const isCombo = combo && (combo.isCombo === true || combo.isCombo === "true");

                            return (
                                <SwiperSlide key={product._id}>
                                    <Link to={`/${product.category === 'Makeup' ? 'Makeup' : 'SkinCare'}/${product._id}`} className="korean-card">
                                        <div className="korean-img-container">
                                            <img src={product.images?.[0]} alt={product.title} loading="lazy" />
                                            <div className="korean-badge">{selectedCountry === 'Korea' ? 'K-BEAUTY' : 'MADE IN INDIA'}</div>
                                            <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }}>
                                                <WishlistButton product={product} />
                                            </div>
                                        </div>
                                        <div className="korean-info text-center pt-3">
                                            <span
                                                className="korean-brand-link"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    navigate(`/brand/${product.brand}`);
                                                }}
                                            >
                                                {product.brand}
                                            </span>
                                            <h3 className="korean-name mb-1" style={{ color: 'var(--text-primary)', fontSize: '13px', minHeight: '18px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{product.title}</h3>
                                            <div className="d-flex align-items-center justify-content-center gap-2">
                                                <p className="korean-price mb-0">₹{product.offerPrice}</p>
                                                <span className="text-muted text-decoration-line-through small" style={{ fontSize: '0.75rem', opacity: 0.6 }}>₹{product.price}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    <button className="korean-nav-btn korean-prev"><IoIosArrowBack /></button>
                    <button className="korean-nav-btn korean-next"><IoIosArrowForward /></button>
                </div>
            </div>
            <style>{`
                .transition-container {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .fading-out {
                    opacity: 0;
                    transform: translateY(10px) scale(0.98);
                    filter: blur(4px);
                }
                .fading-in {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    filter: blur(0);
                }
            `}</style>
        </section>
    );
};

export default KoreanCollection;
