import React, { useState, useEffect, useRef } from 'react';
import './ExpertBacking.css';
import Video from '../assets/video1.mov';

// High-performance cinematic counter using requestAnimationFrame and Expo-Out Easing
const StatCounter = ({ target, duration = 2500, delay = 0, isVisible, trigger }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) {
            setCount(0);
            return;
        }

        let startTime;
        let animationFrame;
        const targetNum = parseInt(target);

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            
            // Handle staggered start delay
            const elapsed = timestamp - startTime;
            if (elapsed < delay) {
                animationFrame = requestAnimationFrame(animate);
                return;
            }

            const progress = elapsed - delay;
            
            // Out-Expo easing: 1 - 2^(-10 * x)
            // Starts fast and slows down gracefully at the end for a "luxury" feel
            const x = Math.min(progress / duration, 1);
            const easing = 1 - Math.pow(2, -10 * x);
            const currentCount = Math.min(
                Math.floor(easing * targetNum),
                targetNum
            );

            setCount(currentCount);

            if (x < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [target, duration, delay, isVisible, trigger]);

    return <>{count}</>;
};

const ExpertBacking = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [trigger, setTrigger] = useState(0);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const handleHover = () => {
        // Re-trigger the animation when the user hovers
        setTrigger(prev => prev + 1);
    };

    return (
        <section className="expert-section py-5" style={{ background: 'var(--bg-cream)' }}>
            <div className="container">
                <div 
                    className="row align-items-center g-0 expert-card-wrap" 
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)', borderRadius: '20px', overflow: 'hidden' }}
                    onMouseEnter={handleHover}
                    ref={sectionRef}
                >
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
                            <span className="expert-label mb-3 d-block" style={{ color: 'var(--pink-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>Backed by Science</span>
                            <h2 className="expert-title mb-4" style={{ color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif" }}>Expertly Derived, <br />Purely Formulated.</h2>
                            <p className="expert-text text-secondary mb-4">
                                Every product in our collection is vetted by leading dermatologists. We focus on clean ingredients that deliver visible results without irritation.
                            </p>
                            <div className="expert-stats d-flex gap-5">
                                <div className="stat">
                                    <span className="stat-num d-block">
                                        <StatCounter target="100" isVisible={isVisible} trigger={trigger} />+
                                    </span>
                                    <span className="stat-label">Experts Vetted</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-num d-block">
                                        <StatCounter target="1500" delay={300} isVisible={isVisible} trigger={trigger} />+
                                    </span>
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
