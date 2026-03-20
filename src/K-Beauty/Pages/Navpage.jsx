import React from 'react';
import { NavLink } from 'react-router-dom';

import navSale from '../assets/nav_sale.png';
import navRoutine from '../assets/NavPage.png';
import navAuthentic from '../assets/nav_authentic.png';

const Navpage = () => {
    const promoItems = [
        {
            title: "SALE",
            image: navSale,
            path: "/shop?isSale=true"
        },
        {
            title: "FREE ROUTINE",
            image: navRoutine,
            path: "/personalized-korean-skincare-routine"
        },
        {
            title: "AUTHENTIC",
            image: navAuthentic,
            path: "/shop"
        }
    ];

    return (
        <section className='container py-lg-4 py-2 px-1'>
            <div className="nav-page-container overflow-hidden" style={{ background: '#000', color: '#fff', minHeight: 'auto', borderRadius: '20px' }}>
                <div className="container-fluid px-2 px-md-5 py-3 py-md-5">
                    <div className="row g-4 justify-content-center">
                        {promoItems.map((item, index) => (
                            <div key={index} className="col-4 px-1 px-md-3">
                                <div className={`promo-item-wrapper text-center animate-up delay-${index}`}>
                                    <NavLink to={item.path} className="promo-link text-decoration-none d-block">
                                        <div className="promo-img-holder overflow-hidden" style={{
                                            borderRadius: '15px',
                                            backgroundColor: '#111',
                                            position: 'relative'
                                        }}>
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-100 d-block promo-img"
                                                style={{
                                                    objectFit: 'cover',
                                                    transition: 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)'
                                                }}
                                            />
                                            <div className="promo-shimmer"></div>
                                            <div className="img-overlay" style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 80%)',
                                                pointerEvents: 'none'
                                            }}></div>
                                            
                                            <div className="title-wrapper-box text-center">
                                                <h3 className="promo-title text-capitalize" style={{
                                                    letterSpacing: '0.5px',
                                                    color: '#fff',
                                                    fontStyle: 'italic',
                                                    lineHeight: '1.2',
                                                    transition: 'all 0.4s ease'
                                                }}>
                                                    {item.title.toLowerCase()}
                                                </h3>
                                                <div className="title-dash mx-auto mt-1" style={{
                                                    width: '20px',
                                                    height: '1.5px',
                                                    background: 'var(--gold)',
                                                    transition: 'width 0.4s ease'
                                                }}></div>
                                            </div>
                                        </div>
                                    </NavLink>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <style>{`
                .promo-img {
                    aspect-ratio: 1080/1350;
                }
                .promo-item-wrapper {
                    transition: transform 0.4s ease;
                }
                .promo-img-holder {
                    box-shadow: 0 10px 20px rgba(0,0,0,0.8);
                    border: 1px solid rgba(212, 175, 55, 0.1);
                    transform: perspective(1000px);
                }
                
                /* Shimmering beam effect */
                .promo-shimmer {
                    position: absolute;
                    top: 0;
                    left: -150%;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(
                        to right,
                        transparent 0%,
                        rgba(255, 255, 255, 0.1) 50%,
                        transparent 100%
                    );
                    transform: skewX(-25deg);
                    transition: 0.75s;
                    pointer-events: none;
                }

                .promo-link:hover .promo-shimmer {
                    left: 200%;
                }

                .promo-link:hover .promo-img {
                    transform: scale(1.08) translateY(-3px);
                    filter: brightness(1.1);
                }

                .title-wrapper-box {
                    position: absolute;
                    bottom: 25px;
                    left: 0;
                    right: 0;
                    z-index: 5;
                    pointer-events: none;
                    transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
                }

                .promo-link:hover .title-wrapper-box {
                    transform: translateY(-8px);
                }

                .promo-title {
                    font-family: 'Playfair Display', serif !important;
                    font-weight: 500;
                    font-size: 1.8rem;
                    text-shadow: 0 4px 15px rgba(0,0,0,1);
                    transition: color 0.4s ease;
                }

                .promo-link:hover .promo-title {
                    color: var(--gold) !important;
                }

                .promo-link:hover .title-dash {
                    width: 40px !important;
                    box-shadow: 0 0 10px var(--gold);
                }

                .animate-up {
                    animation: floatAnim 4s ease-in-out infinite;
                }

                .delay-1 { animation-delay: 0.5s; }
                .delay-2 { animation-delay: 1s; }

                @keyframes floatAnim {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }

                @media (max-width: 768px) {
                    .promo-img {
                        aspect-ratio: 1080/1350 !important; /* Keep original ratio to show subject */
                    }
                    .promo-title {
                        font-size: 0.6rem !important;
                        letter-spacing: 0px !important;
                    }
                    .title-wrapper-box {
                        bottom: 12px;
                    }
                    .title-dash {
                        width: 12px !important;
                        height: 1px !important;
                    }
                    .animate-up {
                        animation: none;
                    }
                    .nav-page-container {
                        border-radius: 12px !important;
                    }
                    .promo-img-holder {
                        border-radius: 8px !important;
                    }
                }
                
                /* Extra small phones */
                @media (max-width: 375px) {
                    .promo-title {
                        font-size: 0.55rem !important;
                    }
                    .title-wrapper-box {
                        bottom: 10px;
                    }
                }
            `}</style>
            </div>

        </section>
    );
};

export default Navpage;