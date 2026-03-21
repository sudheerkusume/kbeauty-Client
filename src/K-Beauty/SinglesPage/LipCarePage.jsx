import axios from "axios";
import API_BASE_URL from "../config";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import { IoFilter } from 'react-icons/io5';
import './BestSellerPage.css';

const LipCarePage = () => {
    const [products, setProducts] = useState([]);
    const [openSections, setOpenSections] = useState({});
    const [filters, setFilters] = useState({
        Product: [],
        Availbaility: [],
        category: [],
        Product_Type: [],
        skinType: [],
        skinConcern: [],
        Size: [],
        Price: [],
    });

    const [selectedFilters, setSelectedFilters] = useState({
        Product: [],
        Availbaility: [],
        category: [],
        Product_Type: [],
        skinType: [],
        skinConcern: [],
        Size: [],
        Price: [],
    });

    const [sortBy, setSortBy] = useState("Newest First");
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const toggleSection = (key) => {
        setOpenSections((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    useEffect(() => {
        axios.get(`${API_BASE_URL}/products?category=LipCare`)
            .then((res) => {
                // Sorting by _id descending (Newest First)
                const sortedData = (res.data || []).sort((a, b) => b._id.localeCompare(a._id));
                setProducts(sortedData);

                const newFilters = {
                    Product: [...new Set(res.data.map(item => item.brand).filter(Boolean))],
                    Availbaility: ["In Stock", "Only few left"],
                    category: [...new Set(res.data.map(item => item.category).filter(Boolean))],
                    Product_Type: [...new Set(res.data.map(item => item.type).filter(Boolean))],
                    skinType: [...new Set(res.data.map(item => item.skinType).filter(Boolean))],
                    skinConcern: [...new Set(res.data.map(item => item.skinConcern).filter(Boolean))],
                    Size: [...new Set(res.data.map(item => item.size).filter(Boolean))],
                    Price: ['Under 500', '500 - 999', '1000+'],
                };

                setFilters(newFilters);

                const defaultOpen = {};
                Object.keys(newFilters).forEach(key => {
                    defaultOpen[key] = true;
                });
                setOpenSections(defaultOpen);
            })
            .catch((err) => console.log(err));
    }, []);

    const handleFilterChange = (type, value) => {
        setSelectedFilters((prev) => {
            const updated = prev[type].includes(value)
                ? prev[type].filter((v) => v !== value)
                : [...prev[type], value];

            // Auto-close mobile filter after selection for better UX
            if (window.innerWidth < 768) {
                // setMobileFilterOpen(false) 
            }
            return { ...prev, [type]: updated };
        });
    };

    const applyFilters = (product) => {
        const price = product.offerPrice || 0;
        const stockStatus = product.stockQuantity > 5 ? "In Stock" : (product.stockQuantity > 0 ? "Only few left" : "Out of Stock");

        return (
            (selectedFilters.Product.length === 0 || selectedFilters.Product.includes(product.brand)) &&
            (selectedFilters.Availbaility.length === 0 || selectedFilters.Availbaility.includes(stockStatus)) &&
            (selectedFilters.category.length === 0 || selectedFilters.category.includes(product.category)) &&
            (selectedFilters.Product_Type.length === 0 || selectedFilters.Product_Type.includes(product.type)) &&
            (selectedFilters.skinType.length === 0 || selectedFilters.skinType.includes(product.skinType)) &&
            (selectedFilters.skinConcern.length === 0 || selectedFilters.skinConcern.includes(product.skinConcern)) &&
            (selectedFilters.Size.length === 0 || selectedFilters.Size.includes(product.size)) &&
            (selectedFilters.Price.length === 0 ||
                selectedFilters.Price.some((range) => {
                    if (range === 'Under 500') return price < 500;
                    if (range === '500 - 999') return price >= 500 && price <= 999;
                    if (range === '1000+') return price >= 1000;
                    return false;
                }))
        );
    };

    const filteredProducts = products.filter(applyFilters);

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "Price: Low to High") return (a.offerPrice || a.price) - (b.offerPrice || b.price);
        if (sortBy === "Price: High to Low") return (b.offerPrice || b.price) - (a.offerPrice || a.price);
        if (sortBy === "Newest First") return b._id.localeCompare(a._id);
        return 0;
    });

    // Number Counter Animation Component
    const NumberCounter = ({ targetNumber }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            let start = 0;
            const duration = 800; // ms
            const incrementTime = 20;
            const steps = duration / incrementTime;
            const increment = targetNumber / steps;

            const timer = setInterval(() => {
                start += increment;
                if (start >= targetNumber) {
                    setCount(targetNumber);
                    clearInterval(timer);
                } else {
                    setCount(Math.ceil(start));
                }
            }, incrementTime);

            return () => clearInterval(timer);
        }, [targetNumber]);

        return <span>{count}</span>;
    };

    const getFilteredCount = (type, value) => {
        const tempFilters = { ...selectedFilters };
        tempFilters[type] = [];

        return products.filter((product) => {
            const price = product.offerPrice || 0;
            const stockStatus = product.stockQuantity > 5 ? "In Stock" : (product.stockQuantity > 0 ? "Only few left" : "Out of Stock");

            const match =
                (tempFilters.Product.length === 0 || tempFilters.Product.includes(product.brand)) &&
                (tempFilters.Availbaility.length === 0 || tempFilters.Availbaility.includes(stockStatus)) &&
                (tempFilters.category.length === 0 || tempFilters.category.includes(product.category)) &&
                (tempFilters.Product_Type.length === 0 || tempFilters.Product_Type.includes(product.type)) &&
                (tempFilters.skinType.length === 0 || tempFilters.skinType.includes(product.skinType)) &&
                (tempFilters.skinConcern.length === 0 || tempFilters.skinConcern.includes(product.skinConcern)) &&
                (tempFilters.Size.length === 0 || tempFilters.Size.includes(product.size)) &&
                (tempFilters.Price.length === 0 ||
                    tempFilters.Price.some((range) => {
                        if (range === 'Under 500') return price < 500;
                        if (range === '500 - 999') return price >= 500 && price <= 999;
                        if (range === '1000+') return price >= 1000;
                        return false;
                    }));

            if (!match) return false;

            switch (type) {
                case 'Product': return product.brand === value;
                case 'Availbaility': return stockStatus === value;
                case 'category': return product.category === value;
                case 'Product_Type': return product.type === value;
                case 'skinType': return product.skinType === value;
                case 'skinConcern': return product.skinConcern === value;
                case 'Size': return product.size === value;
                case 'Price':
                    if (value === 'Under 500') return price < 500;
                    if (value === '500 - 999') return price >= 500 && price <= 999;
                    if (value === '1000+') return price >= 1000;
                    return false;
                default:
                    return false;
            }
        }).length;
    };

    return (
        <div className="pdp-main-container" style={{ background: 'var(--bg-cream)', color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif" }}>

            <div className="container-fluid px-2 px-md-4 py-0">
                {/* 1. MOBILE FILTER TOGGLE (Nykaa Style) */}
                <div className="d-lg-none mt-4 mb-4 d-flex justify-content-between align-items-center py-3 px-3 rounded-2 shadow-sm mobile-filter-sticky" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                    <div className="d-flex flex-column">
                        <span className="small text-muted" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Showing</span>
                        <span className="fw-bold"><NumberCounter targetNumber={filteredProducts.length} /> Products</span>
                    </div>
                    <button className="btn btn-outline-gold d-flex align-items-center gap-2 rounded-pill px-4" onClick={() => setMobileFilterOpen(!mobileFilterOpen)}>
                        <IoFilter /> {mobileFilterOpen ? 'Close' : 'Filter & Sort'}
                    </button>
                </div>

                <div className="row g-0">
                    {/* 2. FIXED FILTER SIDEBAR (Desktop) */}
                    <div className={`shop-filter-sidebar col-lg-3 ${mobileFilterOpen ? 'mobile-drawer-open' : 'd-none d-lg-block'}`}>
                        {mobileFilterOpen && <div className="mobile-drawer-overlay" onClick={() => setMobileFilterOpen(false)}></div>}
                        <div className="filter-inner-content custom-scrollbar" style={{ background: '#F8F1ED', padding: '25px 20px', borderRadius: '15px' }}>
                            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4" style={{ borderColor: 'var(--border-soft)' }}>
                                <h5 className="fw-bold m-0" style={{ letterSpacing: '2px', color: 'var(--text-primary)' }}>FILTERS</h5>
                                {mobileFilterOpen && <button className="btn-close" onClick={() => setMobileFilterOpen(false)}></button>}
                            </div>

                            <button className="btn btn-link text-gold p-0 text-decoration-none small mb-4 d-block w-100 text-start"
                                onClick={() => {
                                    setSelectedFilters({
                                        Product: [], Availbaility: [], category: [], Product_Type: [], skinType: [], skinConcern: [], Size: [], Price: [],
                                    });
                                    setSortBy("Newest First");
                                }}>
                                Reset All Filters
                            </button>

                            {/* Mobile Only Sort Section */}
                            <div className="d-lg-none mb-4 border-bottom pb-4" style={{ borderColor: 'var(--border-soft)' }}>
                                <h6 className="text-uppercase mb-3" style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '2px', color: '#B17A7E' }}>Sort By</h6>
                                <select 
                                    className="form-select border-0 shadow-none bg-light rounded-pill px-4" 
                                    style={{ fontSize: '14px', height: '45px' }}
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option>Newest First</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                </select>
                            </div>

                            <div className="filter-accordion">
                                {Object.entries(filters).map(([filterType, values]) => (
                                    <div key={filterType} className="mb-4 filter-section">
                                        <div
                                            className="d-flex justify-content-between align-items-center py-2"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => toggleSection(filterType)}
                                        >
                                            <h6 className="text-uppercase m-0" style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '2px', color: '#B17A7E' }}>
                                                {filterType === 'Product_Type' ? 'Product Type' :
                                                    filterType === 'skinType' ? 'Skin Type' :
                                                        filterType === 'skinConcern' ? 'Skin Concern' :
                                                            filterType.replace(/_/g, " ")}
                                            </h6>
                                            <span style={{
                                                transform: openSections[filterType] ? 'rotate(90deg)' : 'rotate(0deg)',
                                                transition: '0.3s ease',
                                                color: 'var(--gold)'
                                            }}>
                                                <IoIosArrowForward />
                                            </span>
                                        </div>

                                        <div className={`filter-options-wrap ${openSections[filterType] ? 'open' : ''}`}>
                                            <div className="pt-3">
                                                {values.map((value, index) => (
                                                    <div className="form-check mb-2 custom-check" key={index}>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            id={`${filterType}-${index}`}
                                                            checked={selectedFilters[filterType]?.includes(value)}
                                                            onChange={() => handleFilterChange(filterType, value)}
                                                        />
                                                        <label className="form-check-label d-flex justify-content-between w-100 ps-2" htmlFor={`${filterType}-${index}`}>
                                                            <span>{value}</span>
                                                            <span className="opacity-50" style={{ fontSize: "10px" }}>{getFilteredCount(filterType, value)}</span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. SCROLLING CONTENT AREA */}
                    <div className="col-lg-9 scrolling-content-area">

                        {/* 4. SLIM CATEGORY HEADER (Now part of scrolling area) */}
                        <div className="slim-category-header pt-5 pb-4 text-center" style={{ background: 'var(--bg-cream)' }}>
                            <span className="mb-1 d-block" style={{ letterSpacing: '5px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--pink-accent)' }}>PREMIUM SELECTION</span>
                            <h1 className="fw-bold m-0" style={{ letterSpacing: '4px', color: 'var(--text-primary)', fontSize: '2.5rem', textTransform: 'uppercase' }}>LIPCARE</h1>
                        </div>

                        <div className="px-3 px-md-4">
                            <div className="d-none d-lg-flex justify-content-between align-items-center mb-5 p-3 rounded-3 shadow-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)', color: 'var(--text-primary)' }}>
                                <span className="fw-medium">Showing <strong style={{ color: 'var(--pink-accent)' }}><NumberCounter targetNumber={filteredProducts.length} /></strong> Premium Lipcare Items</span>
                                <div className="sort-box d-flex align-items-center gap-3">
                                    <span className="small text-muted">Sort By:</span>
                                    <select 
                                        className="bg-transparent border-0 small outline-none" 
                                        style={{ cursor: 'pointer', color: 'var(--text-primary)' }}
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option className="bg-white">Newest First</option>
                                        <option className="bg-white">Price: Low to High</option>
                                        <option className="bg-white">Price: High to Low</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row g-3 g-md-4">
                                {sortedProducts.map((product) => {
                                    const discountPercent = product.price && product.offerPrice
                                        ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
                                        : 0;

                                    return (
                                        <div className="col-6 col-md-4" key={product._id}>
                                            <Link to={`/LipCare/${product._id}`} className="signature-premium-card h-100 border border-secondary shadow-hover">
                                                <div className="premium-img-container">
                                                    {discountPercent > 15 && (
                                                        <div className="premium-discount-badge" style={{ backgroundColor: 'var(--pink-accent)', color: '#fff' }}>
                                                            <span className="discount-val-p">{discountPercent}<span className="animated-percent">%</span></span>
                                                            <span className="discount-label-p">OFF</span>
                                                        </div>
                                                    )}

                                                    <img
                                                        src={product.images?.[0] || 'https://via.placeholder.com/600x800'}
                                                        alt={product.title}
                                                        className="premium-main-img"
                                                        loading="lazy"
                                                    />
                                                    {product.images?.[1] && (
                                                        <img
                                                            src={product.images[1]}
                                                            alt={`${product.title} hover`}
                                                            className="premium-hover-img"
                                                            loading="lazy"
                                                        />
                                                    )}
                                                </div>

                                                <div className="card-content-p text-center p-3">
                                                    <span className="premium-care-label text-gold d-block mb-1" style={{ fontSize: '10px' }}>{product.brand}</span>
                                                    <h3 className="premium-product-title text-truncate-2" style={{ fontSize: '0.85rem', height: '2.5rem' }}>
                                                        {product.title}
                                                    </h3>

                                                    <div className="premium-price-wrap my-2">
                                                        {product.price > product.offerPrice && (
                                                            <span className="premium-old-price small text-muted text-decoration-line-through me-2">₹{product.price}</span>
                                                        )}
                                                        <span className="premium-offer-price fw-bold" style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                                                            ₹{product.offerPrice || product.price}
                                                        </span>
                                                    </div>

                                                    <button className="btn btn-gold-outline w-100 rounded-pill mt-2 py-2" style={{ fontSize: '0.7rem', fontWeight: 600 }}>
                                                        VIEW DETAILS
                                                    </button>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>

                            {filteredProducts.length === 0 && (
                                <div className="text-center py-5 my-5 rounded-4 w-100" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                                    <div className="display-4 text-muted mb-3"><IoFilter /></div>
                                    <h4 className="fw-bold" style={{ color: 'var(--text-primary)' }}>No Results Found</h4>
                                    <p className="text-muted mb-4 px-3">Try adjusting your filters to find your perfect Korean ritual.</p>
                                    <button className="btn btn-gold rounded-pill px-5 py-2" onClick={() => setSelectedFilters({
                                        Product: [], Availbaility: [], category: [], Product_Type: [], skinType: [], skinConcern: [], Size: [], Price: [],
                                    })}>
                                        Reset All
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. STORY HERO (Bottom / SEO Section) */}
            <div className="category-hero py-5 text-center mt-5" style={{ borderTop: '1px solid var(--border-soft)', background: 'var(--bg-cream)' }}>
                <div className="container">
                    <span className="mb-2 d-block" style={{ letterSpacing: '5px', fontSize: '0.8rem', fontWeight: 500, color: 'var(--pink-accent)' }}>THE K-BEAUTY STORY</span>
                    <h2 className="mb-3" style={{ letterSpacing: '2px', fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: 'var(--text-primary)' }}>LIPCARE RITUALS</h2>
                    <p className="mx-auto" style={{ maxWidth: '850px', lineHeight: '1.9', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                        Celebrate your unique beauty with our collection of high-performance Korean lipcare.
                        Nourish and protect your lips with our premium selection of balms, tints, and masks.
                    </p>
                </div>
            </div>

            <style>{`
                .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .shadow-hover { transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
                .shadow-hover:hover { transform: translateY(-8px); border-color: var(--pink-accent) !important; box-shadow: 0 15px 35px rgba(232, 180, 184, 0.15); }
                
                @media (min-width: 992px) {
                    .shop-filter-sidebar {
                        position: sticky;
                        top: 50px; /* Stay pinned under sticky navbar */
                        height: calc(100vh - 190px); /* Height constrained to viewport */
                        z-index: 10;
                        overflow-y: auto;
                        padding-right: 20px;
                        border-right: 1px solid rgba(255, 255, 255, 0.1);
                    }
                    .scrolling-content-area {
                        padding-left: 20px;
                        border-left: 1px solid rgba(212, 175, 55, 0.1);
                    }
                    .filter-inner-content {
                        height: 100%;
                        padding-top: 20px;
                        padding-bottom: 50px;
                    }
                }

                .filter-options-wrap { max-height: 0; overflow: hidden; transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
                .filter-options-wrap.open { max-height: 800px; }

                .custom-scrollbar::-webkit-scrollbar { width: 2px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.3); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--gold); }

                /* Hover Image Styles */
                .premium-img-container { position: relative; overflow: hidden; }
                .premium-hover-img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }
                .signature-premium-card:hover .premium-hover-img { opacity: 1; }
                .premium-main-img { transition: transform 0.8s cubic-bezier(0, 0, 0.2, 1); }
                .signature-premium-card:hover .premium-main-img { transform: scale(1.05); }

                .btn-gold-outline { border: 1px solid var(--gold); color: var(--gold); background: transparent; transition: 0.3s; }
                .btn-gold-outline:hover { background: var(--gold); color: #000; }

                @media (max-width: 991px) {
                    .slim-category-header {
                        padding-top: 2rem !important;
                        padding-bottom: 1rem !important;
                    }
                    .slim-category-header h1 {
                        font-size: 1.5rem !important;
                        letter-spacing: 2px !important;
                    }
                    .mobile-filter-sticky {
                        margin-top: 1rem !important;
                        margin-bottom: 2rem !important;
                        border-radius: 8px !important;
                    }
                    .pdp-main-container {
                        padding-bottom: 100px; /* Space for mobile bottom nav */
                    }
                    .premium-product-title {
                        font-size: 0.65rem !important;
                        height: 1.8rem !important;
                        margin-bottom: 3px !important;
                    }
                    .premium-offer-price {
                        font-size: 0.85rem !important;
                    }
                    .card-content-p {
                        padding: 6px 4px !important;
                    }
                    .signature-premium-card {
                        border-radius: 8px !important;
                    }
                    .btn-gold-outline {
                        padding: 3px 0 !important;
                        font-size: 0.6rem !important;
                    }
                    /* Compact & Aligned Mobile Checkboxes */
                    .custom-check {
                        display: flex !important;
                        align-items: center !important;
                        padding-left: 0 !important;
                        margin-bottom: 12px !important;
                    }
                    .form-check-input {
                        width: 18px !important;
                        height: 18px !important;
                        min-width: 18px !important;
                        min-height: 18px !important;
                        margin: 0 12px 0 0 !important;
                        flex-shrink: 0 !important;
                        border: 1px solid rgba(255,255,255,0.4) !important;
                        background-color: transparent !important;
                        cursor: pointer !important;
                        border-radius: 4px !important;
                    }
                    .form-check-label {
                        padding-left: 0 !important;
                        cursor: pointer;
                        display: flex !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                        font-size: 14px !important;
                        color: rgba(255,255,255,0.9) !important;
                        flex-grow: 1;
                    }
                }

                .mobile-drawer-open {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 2100;
                        display: block !important;
                    }
                    .filter-inner-content {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 70vh;
                        background: var(--bg-cream);
                        padding: 25px 15px;
                        border-radius: 20px 20px 0 0;
                        overflow-y: auto;
                        box-shadow: 0 -10px 40px rgba(0,0,0,0.1);
                        z-index: 2200;
                    }
                    .mobile-drawer-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.3);
                        backdrop-filter: blur(5px);
                        z-index: 2150;
                    }
                }

                .form-check-input:checked { background-color: var(--pink-accent); border-color: var(--pink-accent); }
                .custom-check label { color: var(--text-secondary); cursor: pointer; transition: 0.3s; font-size: 13px; }
                .custom-check:hover label { color: var(--pink-accent); }
            `}</style>
        </div>
    );
};

export default LipCarePage;