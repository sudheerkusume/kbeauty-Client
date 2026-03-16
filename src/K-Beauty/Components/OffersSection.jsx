import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import WishlistButton from '../WishlistButton';
import 'swiper/css';
import 'swiper/css/pagination';
import API_BASE_URL from "../config";
import './OffersSection.css';

const OffersSection = () => {
    const [offerProducts, setOfferProducts] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/products`)
            .then((res) => {
                // Filter all products that have a discount
                const discounted = res.data
                    .filter(p => p.price > p.offerPrice)
                    .sort((a, b) => (b.price - b.offerPrice) - (a.price - a.offerPrice));
                setOfferProducts(discounted);
            })
            .catch((err) => console.log(err));
    }, []);

    if (offerProducts.length === 0) return null;

    return (
        <section className="offers-slider-section py-5 bg-black">
            <div className="container">
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <span className="offers-badge-mini">Today's Deals</span>
                        <h2 className="offers-main-title">Special Offers</h2>
                    </div>
                    <div className="offers-nav-group d-none d-md-flex">
                        <button className="offers-arr offers-prev"><IoIosArrowBack /></button>
                        <button className="offers-arr offers-next ms-2"><IoIosArrowForward /></button>
                    </div>
                </div>

                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation={{
                        prevEl: '.offers-prev',
                        nextEl: '.offers-next',
                    }}
                    autoplay={{ delay: 5000 }}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1200: { slidesPerView: 2 },
                    }}
                    className="offers-swiper"
                >
                    {offerProducts.map((product) => (
                        <SwiperSlide key={product._id}>
                            <div className="offer-card-luxe">
                                <div className="row g-0 align-items-center">
                                    <div className="col-5">
                                        <div className="offer-img-box">
                                            <img src={product.images?.[0] || product.image} alt={product.title} className="img-fluid" />
                                            <div className="offer-tag">-{Math.round(((product.price - product.offerPrice) / product.price) * 100)}%</div>
                                            <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }}>
                                                <WishlistButton product={product} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-7">
                                        <div className="offer-details p-3 p-md-4">
                                            <h3 className="offer-prod-title">{product.title}</h3>
                                            <div className="offer-pricing">
                                                <span className="offer-price-new">₹{product.offerPrice}</span>
                                                <span className="offer-price-old ms-2">₹{product.price}</span>
                                            </div>
                                            <Link
                                                to={`/${product.category === 'Makeup' ? 'Makeup' : 'SkinCare'}/${product._id}`}
                                                className="offer-cta-link mt-3"
                                            >
                                                Shop Deal <IoIosArrowForward size={12} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default OffersSection;
