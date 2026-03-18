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
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/products?Country=${selectedCountry}`)
            .then((res) => {
                // Sorting by _id descending AND filtering out combo products
                const filtered = (res.data || [])
                    .filter(p => !p.combo || (p.combo.isCombo !== true && p.combo.isCombo !== "true"))
                    .filter(p => !p.title?.includes(' + ')) // Extra safety check
                    .sort((a, b) => b._id.localeCompare(a._id));
                setProducts(filtered);
            })
            .catch((err) => console.log(err));
    }, [selectedCountry]);

    return (
        <section className="korean-section py-5 bg-black">
            <div className="container">
                <div className="text-center mb-5">
                    <span className="korean-subtitle">Authentic Selection</span>
                    <h2 className="korean-title text-white">The {selectedCountry} Collection</h2>
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

                <div className="korean-slider-wrap position-relative">
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
                                            <h3 className="korean-name text-white mb-1" style={{ fontSize: '13px', minHeight: '38px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.title}</h3>
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
        </section>
    );
};

export default KoreanCollection;
