import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPopup.css';

const AuthPopup = ({ isLogin }) => {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Only show if user is NOT logged in
        if (isLogin) return;

        // Check if shown in this session
        const hasBeenShown = sessionStorage.getItem('auth_popup_shown');
        
        if (!hasBeenShown) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000); // Show after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [isLogin]);

    const closePopup = () => {
        setIsVisible(false);
        sessionStorage.setItem('auth_popup_shown', 'true');
    };

    const handleAction = (path) => {
        closePopup();
        navigate(path);
    };

    if (!isVisible) return null;

    return (
        <div className="auth-popup-overlay">
            <div className="auth-popup-content animate__animated animate__fadeInUp">
                <button className="close-btn" onClick={closePopup}>&times;</button>
                
                <div className="auth-popup-header">
                    <span className="premium-tag">K-Beauty Private Circle</span>
                    <h2>Join the Glow</h2>
                    <p>Unlock exclusive deals, track orders, and get personalized skincare recommendations.</p>
                </div>

                <div className="auth-popup-actions">
                    <button 
                        className="btn-gold-luxe" 
                        onClick={() => handleAction('/login')}
                    >
                        Sign In
                    </button>
                    <button 
                        className="btn-outline-luxe" 
                        onClick={() => handleAction('/signup')}
                    >
                        Create Account
                    </button>
                </div>

                <div className="auth-popup-footer">
                    <p onClick={closePopup}>Continue as Guest</p>
                </div>
            </div>
        </div>
    );
};

export default AuthPopup;
