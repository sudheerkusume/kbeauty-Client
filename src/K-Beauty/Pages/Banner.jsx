import React from "react";
import { Link } from "react-router-dom";
import "./Banner.css";
import faceGlow from "../assets/Banner.jpg";
import productImg from "../assets/Banner2.png";
import icon from "../assets/Mainlogo.png"
export default function Banner() {
    return (
        <section className="banner-section py-lg-5 py-3">
            <div className="container">
                <div className="row g-0 banner-container overflow-hidden">

                    {/* LEFT: PRODUCT */}
                    <div className="col-12 col-md-5 product-column d-flex align-items-center justify-content-center p-4 p-lg-5 position-relative z-1">

                        {/* Cool Background Text Overlay */}
                        <div className="product-bg-text">
                            <h2 className="routine-title-bg">
                                <span className="solid-text">Korean</span><br />
                                <span className="hollow-text">Skincare</span><br />
                                <span className="solid-text">Routine</span>
                            </h2>
                        </div>

                        <Link to="/SkinCare/69b54ae47bdf7a42a270c19d" className="product-card position-relative z-3 text-decoration-none d-block" style={{ cursor: 'pointer' }}>
                            <span className="discount-badge">-12%</span>
                            <img src={productImg} alt="product" className="banner-product-img" />
                        </Link>
                    </div>

                    {/* RIGHT: IMAGE + CONTENT */}
                    <div className="col-12 col-md-7 routine-column position-relative">

                        {/* IMAGE */}
                        <div className="routine-img-wrapper">

                            <img src={faceGlow} alt="face" className="routine-face-img" />
                            <div className="glow-scan-effect"></div>
                        </div>

                        {/* TEXT */}
                        <div className="routine-content p-4 p-lg-5">

                            {/* CALLOUTS WITH L-SHAPE POINTERS */}
                            <div className="routine-points-overlay">
                                {/* Left Side Callouts */}
                                <div className="callout-absolute item-1">
                                    <span className="callout-text">Dark Spots Lightened</span>
                                    <div className="pointer-wrapper">
                                        <div className="line-h" style={{ width: '30px' }}></div>
                                        <div className="line-d down-right" style={{ width: '45px' }}><div className="pointer-dot r-dot"></div></div>
                                    </div>
                                </div>

                                <div className="callout-absolute item-2">
                                    <span className="callout-text">Whiteheads Reduced</span>
                                    <div className="pointer-wrapper">
                                        <div className="line-h" style={{ width: '25px' }}></div>
                                        <div className="line-d up-right" style={{ width: '55px' }}><div className="pointer-dot r-dot"></div></div>
                                    </div>
                                </div>

                                <div className="callout-absolute item-3">
                                    <span className="callout-text">Radiant Glow</span>
                                    <div className="pointer-wrapper">
                                        <div className="line-h" style={{ width: '40px' }}></div>
                                        <div className="line-d up-right" style={{ width: '35px' }}><div className="pointer-dot r-dot"></div></div>
                                    </div>
                                </div>

                                {/* Right Side Callouts */}
                                <div className="callout-absolute item-4">
                                    <div className="pointer-wrapper">
                                        <div className="line-d down-left" style={{ width: '45px' }}><div className="pointer-dot l-dot"></div></div>
                                        <div className="line-h" style={{ width: '25px' }}></div>
                                    </div>
                                    <span className="callout-text">Glass Skin Glow ✨</span>
                                </div>

                                <div className="callout-absolute item-logo">
                                    <img src={icon} alt="Brand Logo" className="banner-callout-logo" />
                                </div>

                                <div className="callout-absolute item-6">
                                    <div className="pointer-wrapper">
                                        <div className="line-d up-left" style={{ width: '30px' }}><div className="pointer-dot l-dot"></div></div>
                                        <div className="line-h" style={{ width: '40px' }}></div>
                                    </div>
                                    <span className="callout-text">Healthier Skin Barrier</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
