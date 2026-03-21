import React, { useState, useEffect, useRef } from 'react';
import './BlogSection.css';
import { IoCloseOutline } from 'react-icons/io5';
import axios from 'axios';
import API_BASE_URL from "../config";

const BlogSection = () => {
    const [selectedPost, setSelectedPost] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const headerRef = useRef(null);


    useEffect(() => {
        axios.get(`${API_BASE_URL}/blogPosts`)
            .then(res => setBlogs(res.data))
            .catch(err => console.log(err));
    }, []);

    const resolveImg = (img) => {
        if (!img) return null;
        if (img.startsWith('http') || img.startsWith('/') || img.startsWith('data:')) return img;
        return `/assets/${img}`;
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.10 }
        );

        if (headerRef.current) {
            observer.observe(headerRef.current);
        }

        return () => {
            if (headerRef.current) {
                observer.unobserve(headerRef.current);
            }
        };
    }, []);

    return (
        <section className="video-gallery-section py-5" style={{ background: 'var(--bg-cream)' }}>
            <div className="container">
                <div className="text-center mb-5">
                    <span className="blog-subtitle">The K-Edit</span>
                    {/* Premium Animated Title */}
                    <h4
                        ref={headerRef}
                        className={`special-title animated-marker ${isVisible ? 'in-view' : ''}`}
                        style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-primary)', '--pink-accent': '#E1949E' }}
                    >
                        FROM OUR <span style={{ color: 'var(--pink-accent)' }}>BLOG</span>
                        <svg className='svg-marker' viewBox='0 0 201 14' preserveAspectRatio='none'>
                            <path d="M3 10.5732c55.565 6.61382 168.107 -0.117058 197.753 4.63415"></path>
                        </svg>
                    </h4>

                </div>
                <div className="row g-4">
                    {blogs.map((post) => (
                        <div className="col-6 col-md-4 col-lg-3" key={post.id}>
                            <div className="blog-card border-0">
                                <div className="blog-img-box">
                                    <img src={resolveImg(post.img)} alt={post.title} className="img-fluid" loading="lazy" />
                                </div>
                                <div className="blog-card-body p-4">
                                    <span className="blog-cat text-uppercase text-muted" style={{ fontSize: '10px', letterSpacing: '2px' }}>{post.category}</span>
                                    <h4 className="blog-post-title mt-2 mb-3" style={{ fontSize: '1.2rem', fontWeight: '600' }}>{post.title}</h4>
                                    <button
                                        className="blog-read-more-btn mt-2"
                                        onClick={() => setSelectedPost(post)}
                                    >
                                        READ MORE
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Premium Blog Modal */}
            {selectedPost && (
                <div className="blog-modal-overlay" onClick={() => setSelectedPost(null)}>
                    <div className="blog-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="blog-modal-close" onClick={() => setSelectedPost(null)}>
                            <IoCloseOutline size={30} />
                        </button>
                        <div className="row g-0">
                            <div className="col-md-5">
                                <div className="blog-modal-img-box">
                                    <img src={resolveImg(selectedPost.img)} alt={selectedPost.title} />
                                </div>
                            </div>
                            <div className="col-md-7">
                                <div className="blog-modal-details p-4 p-md-5">
                                    <span className="blog-cat text-uppercase">{selectedPost.category}</span>
                                    <h2 className="modal-post-title mt-2 mb-4">{selectedPost.title}</h2>

                                    <div className="modal-qa-section">
                                        <h5 className="qa-question">{selectedPost.Question}</h5>
                                        <p className="qa-answer mt-3">{selectedPost.Answer}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default BlogSection;
