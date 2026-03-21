import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Mainlogo.png';
import cherryLeft from '../assets/Cherryblogs2.PNG';
import cherryRight1 from '../assets/Footer_Cherry1.png';
import cherryRight2 from '../assets/Footer_Cherry2.png';
import footerPetal from '../assets/footer1_petal.png';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-luxury py-5 px-3">
            {/* Specific Branches with Multi-Motion */}
            <img src={cherryLeft} alt="error" className="cherry-branch branch-left" />
            <img src={cherryRight1} alt="error" className="cherry-branch branch-right-1" />
            {/* <img src={cherryRight2} alt="error" className="cherry-branch branch-right-2" /> */}

            {/* Falling Petals */}
            <div className="petal-container">
                {[...Array(6)].map((_, i) => (
                    <img key={i} src={footerPetal} alt="" className={`petal p${i + 1}`} />
                ))}
            </div>

            <div className="container">
                <div className="row gy-5 text-start">
                    {/* Section 1: Explore */}
                    <div className="col-md-3 col-sm-6">
                        <h6 className="footer-title">Explore</h6>
                        <ul className="list-unstyled">
                            <li className="mb-3"><Link to="/About" className="footericon-hover-link py-2 d-inline-block">About K-Beautymart</Link></li>
                            <li className="mb-3"><Link to="/brandlogo" className="footericon-hover-link py-2 d-inline-block">Our Brands</Link></li>
                            <li className="mb-3"><Link to="/contact" className="footericon-hover-link py-2 d-inline-block">Contact Us</Link></li>
                            <li className="mb-3"><Link to="/faq" className="footericon-hover-link py-2 d-inline-block">Beauty FAQ</Link></li>
                            <li className="mb-3"><Link to="/blog" className="footericon-hover-link py-2 d-inline-block">Beauty Journal</Link></li>
                        </ul>
                    </div>

                    {/* Section 2: Shop */}
                    <div className="col-md-3 col-sm-6">
                        <h6 className="footer-title">Shop K-Beauty</h6>
                        <ul className="list-unstyled">
                            <li className="mb-3"><Link to="/Skincare" className="footer-hover-link py-2 d-inline-block">Skincare</Link></li>
                            <li className="mb-3"><Link to="/BestSellers" className="footer-hover-link py-2 d-inline-block">Best Sellers</Link></li>
                            <li className="mb-3"><Link to="/" className="footer-hover-link py-2 d-inline-block">New Arrivals</Link></li>
                            <li className="mb-3"><Link to="/SunCare" className="footer-hover-link py-2 d-inline-block">Sun Care</Link></li>
                            <li className="mb-3"><Link to="/SheetMasks" className="footer-hover-link py-2 d-inline-block">Sheet Masks</Link></li>
                            <li className="mb-3"><Link to="/rewards" className="footer-hover-link py-2 d-inline-block">Beauty Rewards</Link></li>
                        </ul>
                    </div>

                    {/* Section 3: Brand Info */}
                    <div className="col-md-3 col-sm-6">
                        <img
                            src={logo}
                            alt="K-Beautymart Logo"
                            className="footer-logo mb-4"
                        />
                        <p className="footer-description">
                            <strong>K-Beautymart</strong> is your premier destination for curated, 100% authentic Korean skincare. Experience the ultimate glass skin glow.
                        </p>
                        <p className="footer-description">
                            Directly sourced from Seoul to bring you the cutting edge of beauty innovation and scientific excellence.
                        </p>
                    </div>

                    {/* Section 4: Get In Touch */}
                    <div className="col-md-3 col-sm-6">
                        <h6 className="footer-title">Stay Connected</h6>
                        <p className="footer-description mb-4">
                            <strong>HQ Office:</strong><br />
                            Gangnam-gu, Teheran-ro, Suite 502<br />
                            Seoul, South Korea<br />
                            <em>India Hub: Jubilee Hills, Hyderabad</em>
                        </p>

                        <form className="footer-newsletter d-flex">
                            <input
                                type="email"
                                placeholder="Enter email for glow tips"
                                className="form-control bg-white text-dark border-light"
                                style={{ borderRadius: '0' }}
                            />
                            <button type="submit" className="footer-newsletter-btn bg-gold text-white border-0 px-3">→</button>
                        </form>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="footer-bottom mt-5 pt-4 border-top">
                    <div className="row align-items-center">
                        <div className="col-md-8 text-center text-md-start">
                            <p className="mb-0 small text-muted">
                                &copy; 2026 K-Beautymart. All rights reserved. &nbsp;|&nbsp;
                                <Link to="/privacy" className="text-muted text-decoration-none mx-2">Privacy Policy</Link>
                                <Link to="/terms" className="text-muted text-decoration-none mx-2">Terms of Service</Link>
                                <Link to="/refund-policy" className="text-muted text-decoration-none mx-2">Refund Policy</Link>
                            </p>
                        </div>
                        <div className="col-md-4 d-flex justify-content-center justify-content-md-end gap-3 mt-4 mt-md-0">
                            <a href="#!" className="social-icon"><FaFacebookF /></a>
                            <a href="#!" className="social-icon"><FaTwitter /></a>
                            <a href="#!" className="social-icon"><FaInstagram /></a>
                            <a href="#!" className="social-icon"><FaLinkedinIn /></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
