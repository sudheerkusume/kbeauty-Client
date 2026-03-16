import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiLock, FiUser, FiMail } from 'react-icons/fi';

const Checkin = () => {
    const [details, setDetails] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setDetails({
            ...details, [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { userid, emailaddress, password } = details;
        if (userid === "admin" && emailaddress === "admin@gmail.com" && password === "admin123") {
            navigate("/dashboard");
        } else {
            alert("Invalid Credentials");
        }
    };

    return (
        <div className='admin-login-wrapper' style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff'
        }}>
            <div className='col-lg-4 col-md-6 col-sm-10 px-3 px-sm-0'>
                <div className='p-4 p-md-5' style={{ backgroundColor: '#f0f3f9', borderRadius: '40px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                    <div className="text-center mb-5">
                        <h2 style={{ fontWeight: 800, letterSpacing: '-1.5px', color: '#1a2b4b', fontSize: '2.4rem' }}>
                            K-BEAUTY <span style={{ color: '#2b59c3' }}>ADMIN</span>
                        </h2>
                        <p className="text-muted small uppercase mt-2" style={{ letterSpacing: '1px', fontWeight: 700 }}>Management Portal Access</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-muted mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>User ID</label>
                            <div className="position-relative">
                                <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"><FiUser /></span>
                                <input
                                    type='text'
                                    name='userid'
                                    onChange={handleChange}
                                    placeholder='Enter Admin ID'
                                    className='form-control ps-5 border-0 luxury-input'
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-muted mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Email Address</label>
                            <div className="position-relative">
                                <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"><FiMail /></span>
                                <input
                                    type='email'
                                    name='emailaddress'
                                    onChange={handleChange}
                                    placeholder='admin@example.com'
                                    className='form-control ps-5 border-0 luxury-input'
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="form-label small fw-bold text-muted mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Password</label>
                            <div className="position-relative">
                                <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"><FiLock /></span>
                                <input
                                    type='password'
                                    name='password'
                                    onChange={handleChange}
                                    placeholder='••••••••'
                                    className='form-control ps-5 border-0 luxury-input'
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type='submit'
                            className='btn w-100 rounded-5 transition-all'
                            style={{
                                background: 'linear-gradient(90deg, #25d3df 0%, #2b59c3 100%)',
                                color: '#fff',
                                fontWeight: 700,
                                height: '64px',
                                border: 'none',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                boxShadow: '0 10px 20px rgba(43, 89, 195, 0.2)',
                                fontSize: '1.1rem'
                            }}
                            onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 15px 30px rgba(43, 89, 195, 0.3)'; }}
                            onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 10px 20px rgba(43, 89, 195, 0.2)'; }}
                        >
                            Authorize Access
                        </button>
                    </form>

                    <div className="text-center mt-5">
                        <a href="/" className="text-decoration-none small text-muted hover-gold fw-bold">Return to Main Website</a>
                    </div>
                </div>
            </div>

            <style>
                {`
                    .luxury-input {
                        padding: 0 32px; border-radius: 50px; background: #f1f3f9; border: 1px solid #d1d9e6;
                        font-size: 15px; font-weight: 700;
                        color: #1a2b4b;
                        box-shadow: inset 0 4px 10px rgba(0, 0, 0, 0.08);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        height: 60px;
                    }
                    .luxury-input::placeholder {
                        text-transform: none; font-weight: 500; letter-spacing: normal; opacity: 0.6;
                    }
                    .luxury-input:focus {
                        box-shadow: inset 0 4px 10px rgba(0, 0, 0, 0.08), 0 0 0 4px rgba(43, 89, 195, 0.1);
                        border-color: #2b59c3;
                        background: #fff;
                        outline: none;
                    }
                    .hover-gold:hover {
                        color: #2b59c3 !important;
                    }
                `}
            </style>
        </div>
    );
};

export default Checkin;