import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

import API_BASE_URL from "../config";
import contactBg from '../assets/contact_bg.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Contact = () => {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
        });
        AOS.refresh();
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();

        axios.post(`${API_BASE_URL}/enquiries`, { name, mobile, email, message })
            .then(() => {
                alert("Thank you! Your enquiry has been sent to KBeautyMart. We'll be in touch soon.");
                setName("");
                setMobile("");
                setEmail("");
                setMessage("");
            })
            .catch((err) => console.log(err));
    };

    return (
        <section className="contact-page py-5">
            <div className="container py-lg-5">
                <div className="text-center mb-4 mb-md-5">
                    <span className="contact-tag">Get In Touch</span>
                    <h1 className="contact-title display-4">Let's Start Your <br /><span className="text-glow-gold">Glow Journey</span></h1>
                    <p className="lead text-light mx-auto" style={{ maxWidth: '600px', opacity: 0.9 }}>
                        Whether you have a question about our products or need a personalized skincare recommendation,
                        our K-Beauty experts are here for you.
                    </p>
                </div>

                <div className="row g-4 g-lg-5 align-items-stretch">
                    {/* Contact Info Card */}
                    <div className="col-lg-5 col-md-6">
                        <div className="contact-card h-100">
                            <div className="contact-image-wrapper">
                                <img src={contactBg} alt="K-Beauty Aesthetic" className="img-fluid" />
                            </div>

                            <h3 className="contact-title h2 mb-4"><span>Contact</span> Info</h3>
                            <p className="mb-4 mb-lg-5 text-muted small">
                                We're always excited to hear from our community. Visit us or reach out through any of these channels.
                            </p>

                            <div className="d-flex align-items-center mb-4">
                                <div className="contact-info-icon">
                                    <FaPhone />
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold">Call Our Experts</h6>
                                    <p className="mb-0 text-muted small">+91 __________</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-center mb-4">
                                <div className="contact-info-icon">
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold">Email Support</h6>
                                    <p className="mb-0 text-muted small">__________@kbeautymart.com</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <div className="contact-info-icon">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold">Our Headquarters</h6>
                                    <p className="mb-0 text-muted small">Kakinada, Andhra Pradesh, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Card */}
                    <div className="col-lg-7 col-md-6">
                        <div className="contact-card">
                            <h3 className="contact-title h2 mb-4"><span>Send us</span> a Message</h3>
                            <p className="text-muted mb-4 mb-lg-5 small">Drop us a line and we'll get back to you within 24 hours.</p>

                            <form onSubmit={submitHandler}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label className="form-label smaller fw-bold text-uppercase ms-2 text-coral">Full Name</label>
                                            <input
                                                name='name'
                                                value={name}
                                                placeholder='Enter your name'
                                                className='form-control contact-input shadow-none'
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label className="form-label smaller fw-bold text-uppercase ms-2 text-coral">Mobile Number</label>
                                            <input
                                                name='mobile'
                                                value={mobile}
                                                placeholder='Enter mobile number'
                                                className='form-control contact-input shadow-none'
                                                onChange={(e) => setMobile(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label smaller fw-bold text-uppercase ms-2 text-coral">Email Address</label>
                                    <input
                                        name='email'
                                        type='email'
                                        value={email}
                                        placeholder='Enter your email address'
                                        className='form-control contact-input shadow-none'
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label smaller fw-bold text-uppercase ms-2 text-coral">Your Message</label>
                                    <textarea
                                        name='message'
                                        value={message}
                                        placeholder='Tell us more about your skincare goals...'
                                        className='form-control contact-input shadow-none'
                                        style={{ minHeight: '140px' }}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="text-end mt-3">
                                    <button
                                        type='submit'
                                        className='contact-submit-btn w-100'
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
