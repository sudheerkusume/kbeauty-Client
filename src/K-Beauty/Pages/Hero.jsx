import React, { useState, useEffect } from 'react';
import './Hero.css';
import Banner1 from '../assets/MainBanner1.png';
import Banner2 from '../assets/MainBanner2.png';


const Hero = () => {
    const slides = [Banner1, Banner2];
    const [currentSlide, setCurrentSlide] = useState(0);


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <section className="pure-hero-slider">
            <div className="slider-container">
                {slides.map((image, index) => (
                    <div
                        key={index}
                        className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${image})` }}
                    >

                    </div>
                ))}
            </div>

            {/* Premium Progress Indicators */}
            <div className="banner-nav">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`nav-item ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    >
                        <div className="progress-track">
                            <div className="progress-fill"></div>
                        </div>
                    </div>
                ))}
            </div>


        </section>
    );
};

export default Hero;
