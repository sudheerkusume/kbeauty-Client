import React from 'react';
import { NavLink } from 'react-router-dom';
import { BsSearch, BsArrowLeft } from 'react-icons/bs';

const NoPage = () => {
    return (
        <div className="nopage-wrapper py-5 bg-black" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', color: '#fff' }}>
            <div className="container text-center">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        {/* Main Error Indicator */}
                        <div className="error-code-container mb-4">
                            <h1 style={{ fontSize: 'clamp(100px, 20vw, 180px)', fontWeight: 800, margin: 0, lineHeight: 1, letterSpacing: '-5px', color: '#f8f9fa', textShadow: '2px 2px 0px #c2ad4e, 4px 4px 0px #c2ad4e22' }}>
                                404
                            </h1>
                        </div>

                        {/* Content Message */}
                        <div className="error-content" data-aos="fade-up">
                            <h2 className="mb-3" style={{ fontWeight: 700, fontSize: '2rem' }}>Oops! Page Not Found</h2>
                            <p className="text-muted mb-5 px-md-5" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                                The destination you're looking for was either washed away or moved to a secret location. Let's get you back to your beauty routine!
                            </p>

                            {/* Action Buttons */}
                            <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
                                <NavLink
                                    to="/"
                                    className="btn d-flex align-items-center gap-2 px-4 py-3"
                                    style={{ backgroundColor: '#000', color: '#fff', borderRadius: '50px', fontWeight: 600, border: 'none', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#c2ad4e'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#000'}
                                >
                                    <BsArrowLeft size={20} /> Back to Home
                                </NavLink>

                                <NavLink
                                    to="/Skincare"
                                    className="btn btn-outline-dark px-4 py-3"
                                    style={{ borderRadius: '50px', fontWeight: 600, transition: 'all 0.3s ease' }}
                                >
                                    Shop Best Sellers
                                </NavLink>
                            </div>

                            {/* Helpful Utilities */}
                            <div className="p-4 rounded-4" style={{ backgroundColor: '#fcfcfc', border: '1px dashed #eee' }}>
                                <h6 className="mb-3">Or try searching for products:</h6>
                                <div className="input-group mb-3 mx-auto" style={{ maxWidth: '400px' }}>
                                    <input
                                        type="text"
                                        className="form-control border-end-0 ps-3"
                                        placeholder="Search for skincare, makeup..."
                                        style={{ height: '50px', borderRadius: '50px 0 0 50px', borderColor: '#eee' }}
                                    />
                                    <button className="btn btn-dark px-4" style={{ borderRadius: '0 50px 50px 0' }}>
                                        <BsSearch />
                                    </button>
                                </div>
                                <div className="shortcuts d-flex justify-content-center gap-3 small text-muted">
                                    <NavLink to="/contact" className="text-decoration-none text-muted">Contact Support</NavLink>
                                    <span>|</span>
                                    <NavLink to="/faq" className="text-decoration-none text-muted">View FAQ</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
          .error-code-container {
            position: relative;
            user-select: none;
          }
          .btn-outline-dark:hover {
            background-color: #000 !important;
            color: #fff !important;
          }
          @media (max-width: 576px) {
            .error-content h2 { font-size: 1.5rem !important; }
            .error-content p { font-size: 1rem !important; }
          }
        `}
            </style>
        </div>
    );
};

export default NoPage;
