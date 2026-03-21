import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './BrandLogos.css';
import API_BASE_URL from "../config";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/autoplay';

const BrandLogos = () => {
    const [brands, setBrands] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/brands`)
            .then(res => setBrands(res.data))
            .catch(err => console.log(err));
    }, []);

    const resolveImg = (img) => {
        if (!img) return null;
        if (img.startsWith('http') || img.startsWith('/') || img.startsWith('data:')) return img;
        return `/assets/${img}`;
    };


    return (
        <section className="partners-section">
            <div className="container">
                <div className="row justify-content-center mb-5">
                    <div className="col-12 col-md-8 text-center partners-header">
                        <span className="partners-subtitle">TRUSTED BY EXPERTS</span>
                        {/* <h2 className="partners-title">Our Collaborative Brands</h2> */}
                        <h1 className="special-title" style={{ color: 'var(--text-primary)' }}>
                            Our Collaborative <span style={{ color: 'var(--pink-accent)' }}>Brands</span></h1>

                        <div className="partners-divider"></div>
                        <p className="partners-desc mt-4">
                            We curate the most innovative and authentic K-Beauty brands, bringing you exclusive formulations directly from Seoul.
                        </p>
                    </div>
                </div>

                <div className="partners-carousel-wrap">
                    <Swiper
                        modules={[Autoplay, FreeMode]}
                        spaceBetween={0}
                        slidesPerView={2.5}
                        freeMode={true}
                        loop={true}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            480: { slidesPerView: 3.5 },
                            768: { slidesPerView: 4.5 },
                            1024: { slidesPerView: 5.5 },
                            1300: { slidesPerView: 6.5 }
                        }}
                        className="brands-swiper"
                    >
                        {brands.map((brand, index) => (
                            <SwiperSlide key={`brand-slide-${index}`}>
                                <div
                                    className="matrix-cell"
                                    onClick={() => navigate(`/brand/${brand.name}`)}
                                >
                                    <img src={resolveImg(brand.img)} alt={brand.name} className="matrix-logo" />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

            </div>
        </section>
    );
};

export default BrandLogos;
