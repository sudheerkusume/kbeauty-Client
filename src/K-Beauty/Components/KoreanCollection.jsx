import API_BASE_URL from "../config";
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
                // Sorting by _id descending (Newest First)
                const sortedData = (res.data || []).sort((a, b) => b._id.localeCompare(a._id));
                setProducts(sortedData);
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
                        {products.map((product) => (
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
                                        <h3 className="korean-name text-white">{product.title}</h3>
                                        <p className="korean-price">₹{product.offerPrice}</p>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button className="korean-nav-btn korean-prev"><IoIosArrowBack /></button>
                    <button className="korean-nav-btn korean-next"><IoIosArrowForward /></button>
                </div>
            </div>
        </section>
    );
};

export default KoreanCollection;
