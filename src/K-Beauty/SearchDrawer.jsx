import React, { useState, useEffect } from 'react';
import { FiSearch, FiX, FiArrowRight, FiClock, FiShoppingBag } from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';
import API_BASE_URL from "./config";
import { useSearch } from './SearchContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchDrawer = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const { setSearchTerm } = useSearch();
    const [placeholder, setPlaceholder] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);
    const [showCursor, setShowCursor] = useState(true);

    const phrases = ["Cleansers", "Serums", "Moisturizers", "Sunscreen", "Face Masks"];

    useEffect(() => {
        const handleTyping = () => {
            const i = loopNum % phrases.length;
            const fullText = phrases[i];

            setPlaceholder(
                isDeleting
                    ? fullText.substring(0, placeholder.length - 1)
                    : fullText.substring(0, placeholder.length + 1)
            );

            setTypingSpeed(isDeleting ? 80 : 150);

            if (!isDeleting && placeholder === fullText) {
                setTimeout(() => setIsDeleting(true), 1500);
            } else if (isDeleting && placeholder === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [placeholder, isDeleting, loopNum, typingSpeed]);

    // Blinking Cursor Effect
    useEffect(() => {
        const cursorTimer = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(cursorTimer);
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            fetchProducts();
        }
    }, [isOpen]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/products`);
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching products for search:", err);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim().length > 1) {
            const filtered = products.filter(p =>
                p.title.toLowerCase().includes(value.toLowerCase()) ||
                p.category?.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 6); // Top 6 results
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            setSearchTerm(query);
            onClose();
            navigate('/SkinCare'); // Fallback to Skincare results or a dedicated search page
        }
    };

    const goToProduct = (id) => {
        onClose();
        navigate(`/ProductSingle/${id}`);
    };

    return (
        <div className={`search-drawer ${isOpen ? 'open' : ''}`}>
            <div className="search-header d-flex justify-content-between align-items-center p-3">
                <IoIosArrowBack size={24} style={{ cursor: 'pointer', color: 'var(--gold-light)' }} onClick={onClose} />
                <h6 className="mb-0 fw-bold text-white" style={{ letterSpacing: '2px' }}>SEARCH PRODUCTS</h6>
                <span style={{ width: '24px' }}></span>
            </div>

            <div className="px-4 mt-3">
                <form onSubmit={handleSearch}>
                    <div className="search-input-wrapper position-relative">
                        <input
                            type="text"
                            className="form-control search-input border-0 border-bottom rounded-0 px-0 shadow-none"
                            placeholder={query ? "" : `Search for ${placeholder}${showCursor ? '|' : ''}`}
                            value={query}
                            onChange={handleInputChange}
                            autoFocus
                        />
                        {query && (
                            <button
                                type="button"
                                className="btn-close position-absolute end-0 top-50 translate-middle-y"
                                onClick={() => { setQuery(''); setSuggestions([]); }}
                            ></button>
                        )}
                    </div>
                    {/* Suggestions Dropdown */}
                    {suggestions.length > 0 && (
                        <div className="search-suggestions-container mt-3">
                            <p className="small text-muted mb-2 text-uppercase fw-bold letter-spacing-1">Suggestions</p>
                            <div className="suggestions-list">
                                {suggestions.map(product => (
                                    <div
                                        key={product._id}
                                        className="suggestion-item d-flex align-items-center gap-3 p-2 rounded-3"
                                        onClick={() => goToProduct(product._id)}
                                    >
                                        <div className="suggestion-img">
                                            <img src={product.image} alt={product.title} />
                                        </div>
                                        <div className="suggestion-info">
                                            <h6 className="mb-0 text-truncate text-white">{product.title}</h6>
                                            <span className="text-gold fw-bold small">₹{product.offerPrice || product.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button className="btn btn-dark w-100 rounded-pill mt-4 py-2 fw-bold" type="submit">
                        VIEW ALL RESULTS
                    </button>
                </form>

                {/* Quick Links / Popular Searches */}
                {!query && (
                    <div className="popular-searches mt-5">
                        <p className="small text-muted mb-3 text-uppercase fw-bold">Popular Searches</p>
                        <div className="d-flex flex-wrap gap-2">
                            {['Cleansers', 'Serums', 'Moisturizers', 'Sunscreen', 'Face Masks'].map(tag => (
                                <span
                                    key={tag}
                                    className="badge bg-light text-dark border rounded-pill px-3 py-2 cursor-pointer transition-all hover-bg-dark"
                                    onClick={() => { setQuery(tag); handleInputChange({ target: { value: tag } }); }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchDrawer;
