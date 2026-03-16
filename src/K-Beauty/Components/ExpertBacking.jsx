import React from 'react';
import './ExpertBacking.css';
import Video from '../assets/video1.mov'
const ExpertBacking = () => {
    return (
        <section className="expert-section py-5 bg-black">
            <div className="container">
                <div className="row align-items-center g-0 expert-card-wrap">
                    <div className="col-md-5 px-0">
                        <div className="expert-img-box">
                            <video
                                src={Video}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="expert-video"
                            />
                        </div>
                    </div>
                    <div className="col-md-7 px-5 py-5 py-md-0">
                        <div className="expert-content ps-md-4">
                            <span className="expert-label mb-3 d-block">Backed by Science</span>
                            <h2 className="expert-title mb-4">Expertly Derived, <br />Purely Formulated.</h2>
                            <p className="expert-text text-secondary mb-4">
                                Every product in our collection is vetted by leading dermatologists. We focus on clean ingredients that deliver visible results without irritation.
                            </p>
                            <div className="expert-stats d-flex gap-5">
                                <div className="stat">
                                    <span className="stat-num d-block">100+</span>
                                    <span className="stat-label">Experts Vetted</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-num d-block">1500+</span>
                                    <span className="stat-label">Tested formulas</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExpertBacking;
