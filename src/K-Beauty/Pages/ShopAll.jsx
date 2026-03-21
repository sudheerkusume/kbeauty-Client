import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import API_BASE_URL from "../config";
import { IoFilter } from 'react-icons/io5';
import { IoIosArrowForward } from 'react-icons/io';
import '../SinglesPage/BestSellerPage.css';

const ShopAll = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openSections, setOpenSections] = useState({});
    const navigate = useNavigate();

    // Dynamic filter options extracted from DB
    const [filters, setFilters] = useState({
        brand: [],
        category: [],
        type: [],
        skinType: [],
        skinConcern: [],
        price: ['Under 500', '500 - 999', '1000 - 1999', '2000+']
    });

    // Currently active filters
    const [selectedFilters, setSelectedFilters] = useState({
        brand: [],
        category: [],
        type: [],
        skinType: [],
        skinConcern: [],
        price: []
    });

    const [sortBy, setSortBy] = useState("Newest First");
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        window.scrollTo(0, 0);
        axios.get(`${API_BASE_URL}/products`)
            .then((res) => {
                const data = res.data || [];
                // Sort by _id descending (newest first)
                const sortedData = data.sort((a, b) => b._id.localeCompare(a._id));
                setProducts(sortedData);

                // Extract unique dynamic values
                const newFilters = {
                    brand: [...new Set(data.map(p => p.brand).filter(Boolean))],
                    category: [...new Set(data.map(p => p.category).filter(Boolean))],
                    type: [...new Set(data.map(p => p.type).filter(Boolean))],
                    skinType: [...new Set(data.flatMap(p => p.skinType || []).filter(Boolean))],
                    skinConcern: [...new Set(data.flatMap(p => p.skinConcern || []).filter(Boolean))],
                    price: ['Under 500', '500 - 999', '1000 - 1999', '2000+']
                };

                setFilters(newFilters);

                // Parse URL params for initial state if routed with specific query params
                const initialSelected = {
                    brand: [],
                    category: [],
                    type: [],
                    skinType: [],
                    skinConcern: [],
                    price: []
                };

                const catParam = searchParams.get('category');
                const typeParam = searchParams.get('type');
                const skinTypeParam = searchParams.get('skinType');
                const skinConcernParam = searchParams.get('skinConcern');

                if (catParam) initialSelected.category = [catParam];
                if (typeParam) initialSelected.type = [typeParam];
                if (skinTypeParam) initialSelected.skinType = [skinTypeParam];
                if (skinConcernParam) initialSelected.skinConcern = [skinConcernParam];

                setSelectedFilters(initialSelected);

                // Open all filter sections by default
                const defaultOpen = {};
                Object.keys(newFilters).forEach(key => { defaultOpen[key] = true; });
                setOpenSections(defaultOpen);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching products:", err);
                setLoading(false);
            });
    }, [searchParams]);

    const toggleSection = (key) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleFilterChange = (filterCategory, value) => {
        setSelectedFilters(prev => {
            const updatedCategoryArray = prev[filterCategory].includes(value)
                ? prev[filterCategory].filter(v => v !== value)
                : [...prev[filterCategory], value];

            return { ...prev, [filterCategory]: updatedCategoryArray };
        });
    };

    // Master filtering logic
    const applyFilters = (product) => {
        const priceVal = product.offerPrice || product.price || 0;

        // Check if a category matches
        const brandMatch = selectedFilters.brand.length === 0 || selectedFilters.brand.includes(product.brand);
        const catMatch = selectedFilters.category.length === 0 || selectedFilters.category.includes(product.category);
        const typeMatch = selectedFilters.type.length === 0 || selectedFilters.type.includes(product.type);

        // Arrays (Some values are string, but might be array in future JSON. Handle both)
        const prodSkinTypes = Array.isArray(product.skinType) ? product.skinType : (product.skinType ? [product.skinType] : []);
        const skinTypeMatch = selectedFilters.skinType.length === 0 || prodSkinTypes.some(v => selectedFilters.skinType.includes(v));

        const prodSkinConcerns = Array.isArray(product.skinConcern) ? product.skinConcern : (product.skinConcern ? [product.skinConcern] : []);
        const skinConcernMatch = selectedFilters.skinConcern.length === 0 || prodSkinConcerns.some(v => selectedFilters.skinConcern.includes(v));

        const priceMatch = selectedFilters.price.length === 0 || selectedFilters.price.some(range => {
            if (range === 'Under 500') return priceVal < 500;
            if (range === '500 - 999') return priceVal >= 500 && priceVal <= 999;
            if (range === '1000 - 1999') return priceVal >= 1000 && priceVal <= 1999;
            if (range === '2000+') return priceVal >= 2000;
            return false;
        });

        return brandMatch && catMatch && typeMatch && skinTypeMatch && skinConcernMatch && priceMatch;
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

    // Calculate count for dynamic brackets inside filter
    const getCountForFilterOption = (filterCategory, value) => {
        // Create an isolated fake selection simulating "what if" this was clicked on top of current filters
        const testFilters = { ...selectedFilters, [filterCategory]: [] }; // Remove the category being checked to see total possible

        return products.filter(product => {
            const priceVal = product.offerPrice || product.price || 0;
            const bMatch = testFilters.brand.length === 0 || testFilters.brand.includes(product.brand);
            const cMatch = testFilters.category.length === 0 || testFilters.category.includes(product.category);
            const tMatch = testFilters.type.length === 0 || testFilters.type.includes(product.type);
            const pTypes = Array.isArray(product.skinType) ? product.skinType : [product.skinType].filter(Boolean);
            const sMatch = testFilters.skinType.length === 0 || pTypes.some(v => testFilters.skinType.includes(v));
            const pConcerns = Array.isArray(product.skinConcern) ? product.skinConcern : [product.skinConcern].filter(Boolean);
            const scMatch = testFilters.skinConcern.length === 0 || pConcerns.some(v => testFilters.skinConcern.includes(v));
            const pMatch = testFilters.price.length === 0 || testFilters.price.some(range => {
                if (range === 'Under 500') return priceVal < 500;
                if (range === '500 - 999') return priceVal >= 500 && priceVal <= 999;
                if (range === '1000 - 1999') return priceVal >= 1000 && priceVal <= 1999;
                if (range === '2000+') return priceVal >= 2000;
                return false;
            });

            const isMatchSoFar = bMatch && cMatch && tMatch && sMatch && scMatch && pMatch;
            if (!isMatchSoFar) return false;

            // Finally, test the specific option itself
            switch (filterCategory) {
                case 'brand': return product.brand === value;
                case 'category': return product.category === value;
                case 'type': return product.type === value;
                case 'skinType': return pTypes.includes(value);
                case 'skinConcern': return pConcerns.includes(value);
                case 'price':
                    if (value === 'Under 500') return priceVal < 500;
                    if (value === '500 - 999') return priceVal >= 500 && priceVal <= 999;
                    if (value === '1000 - 1999') return priceVal >= 1000 && priceVal <= 1999;
                    if (value === '2000+') return priceVal >= 2000;
                    return false;
                default: return false;
            }
        }).length;
    };

    const formatFilterLabel = (key) => {
        const labels = {
            brand: 'Brand', category: 'Category', type: 'Product Type',
            skinType: 'Skin Type', skinConcern: 'Skin Concern', price: 'Price Range'
        };
        return labels[key] || key;
    };

    if (loading) {
        return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-dark"></div>
        </div>;
    }

    return (
        <div className="pdp-main-container" style={{ background: 'var(--bg-cream)', color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif" }}>
            <div className="shop-all-hero py-5 text-center mb-5" style={{ background: 'var(--bg-cream)', borderBottom: '1px solid var(--border-soft)' }}>
                <span className="mb-2 d-block" style={{ letterSpacing: '5px', fontSize: '0.8rem', fontWeight: 500, color: 'var(--pink-accent)' }}>CURATED SELECTION</span>
                <h1 className="fw-light mb-3" style={{ letterSpacing: '2px', color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif", fontSize: '3.5rem' }}>SHOP ALL</h1>
                <p className="mx-auto" style={{ maxWidth: '600px', color: 'var(--text-secondary)', fontWeight: 300, letterSpacing: '1px' }}>
                    Discover our complete range of high-performance K-Beauty products,
                    sourced directly from Seoul's most prestigious laboratories.
                </p>
            </div>

            <div className="container-fluid px-4 px-md-5 pb-5">
                {/* Mobile Filter Toggle */}
                <div className="d-lg-none mb-4 d-flex justify-content-between align-items-center border-bottom pb-3" style={{ borderColor: 'var(--border-soft)' }}>
                    <span className="fw-bold"><NumberCounter targetNumber={filteredProducts.length} /> Results</span>
                    <button className="btn d-flex align-items-center gap-2 rounded-1 px-4 shadow-sm" onClick={() => setMobileFilterOpen(!mobileFilterOpen)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)', color: 'var(--text-primary)' }}>
                        <IoFilter /> {mobileFilterOpen ? 'Close Filters' : 'Filters'}
                    </button>
                </div>

                <div className="row">
                    {/* ── FILTER SIDEBAR ── */}
                    <div className={`shop-filter-sidebar col-lg-3 pe-lg-5 ${mobileFilterOpen ? 'd-block mb-4' : 'd-none d-lg-block'}`}>
                        <div className="position-sticky custom-scrollbar" style={{ top: '100px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: '15px', background: '#F8F1ED', padding: '25px 20px', borderRadius: '15px' }}>
                            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4" style={{ borderColor: 'var(--border-soft)' }}>
                                <h5 className="fw-bold m-0" style={{ letterSpacing: '1px', color: 'var(--text-primary)' }}>FILTERS</h5>
                                <button className="btn btn-link p-0 text-decoration-none small" 
                                    onClick={() => {
                                        setSelectedFilters({ brand: [], category: [], type: [], skinType: [], skinConcern: [], price: [] });
                                        setSortBy("Newest First");
                                    }} 
                                    style={{ color: 'var(--pink-accent)' }}
                                >
                                    Reset All
                                </button>
                            </div>

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

                            {Object.entries(filters).map(([filterKey, values]) => {
                                if (values.length === 0) return null; // Hide empty filter categories
                                return (
                                    <div key={filterKey} className="mb-4 border-bottom pb-3">
                                        <div
                                            className="d-flex justify-content-between align-items-center pointer"
                                            onClick={() => toggleSection(filterKey)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <h6 className="text-uppercase m-0" style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '2px', color: '#B17A7E' }}>
                                                {formatFilterLabel(filterKey)}
                                            </h6>
                                            <span style={{ transform: openSections[filterKey] ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', color: 'var(--pink-accent)' }}>
                                                <IoIosArrowForward />
                                            </span>
                                        </div>

                                        <div style={{
                                            maxHeight: openSections[filterKey] ? '400px' : '0',
                                            overflowY: 'auto', overflowX: 'hidden',
                                            transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                                        }} className="mt-3 custom-scrollbar">
                                            {values.map((val, idx) => {
                                                const count = getCountForFilterOption(filterKey, val);
                                                return (
                                                    <div className="form-check custom-checkbox mb-2 d-flex align-items-center" key={idx}>
                                                        <input
                                                            className="form-check-input border-secondary shadow-none me-2"
                                                            type="checkbox"
                                                            id={`filter-${filterKey}-${idx}`}
                                                            checked={selectedFilters[filterKey].includes(val)}
                                                            onChange={() => handleFilterChange(filterKey, val)}
                                                            style={{ cursor: 'pointer', borderRadius: '4px' }}
                                                        />
                                                        <label className="form-check-label d-flex justify-content-between w-100" htmlFor={`filter-${filterKey}-${idx}`} style={{ cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.5px' }}>
    <span>{val}</span>
    <span className="small" style={{ fontSize: '10px', color: 'var(--pink-accent)', opacity: 0.8 }}>{count}</span>
</label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── PRODUCT GRID ── */}
                    <div className="col-lg-9">
                        <div className="d-none d-lg-flex justify-content-between align-items-center mb-4 p-3 rounded-3 shadow-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)', color: 'var(--text-primary)' }}>
                            <span className="fw-medium">Showing <strong style={{ color: 'var(--pink-accent)' }}><NumberCounter targetNumber={filteredProducts.length} /></strong> Premium Boutique Items</span>
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

                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-5 my-5 rounded-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                                <h4 className="fw-bold" style={{ color: 'var(--text-primary)' }}>No Products Found</h4>
                                <p className="text-muted mb-4">We couldn't find anything matching your selected filters.</p>
                                <button className="btn btn-gold rounded-1 px-4 py-2" onClick={() => setSelectedFilters({ brand: [], category: [], type: [], skinType: [], skinConcern: [], price: [] })}>
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <div className="row g-4">
                                {sortedProducts.map(product => {
                                    const discountPercent = product.price && product.offerPrice
                                        ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
                                        : 0;

                                    const weightFactor = product.brand === "COSRX" ? 2 : 1;
                                    const targetLink = `/${product.category === 'Makeup' ? 'Makeup' : 'SkinCare'}/${product._id}`;
                                    const combo = product.combo;
                                    const isCombo = (combo && (combo.isCombo === true || combo.isCombo === "true")) || (product.title && product.title.includes(' + '));
                                    const comboSavings = combo?.savings || (product.price - product.offerPrice);

                                    return (
                                        <div className={"col-6 col-md-4 mb-4"} key={product._id}>
                                            {isCombo ? (
                                                <Link to={targetLink} className="combo-ref-card">
                                                    <div className="combo-ref-badge-wrap">
                                                        <div className="combo-ref-badge">Combo Deal</div>
                                                    </div>
                                                    <div className="combo-ref-savings-bar">
                                                        Save <span className="save-text">₹{comboSavings}</span> | {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                                                    </div>
                                                    <div className="combo-ref-images">
                                                        <img src={product.images?.[0] || 'https://via.placeholder.com/150'} className="combo-ref-img" alt="" />
                                                        <span className="combo-ref-plus">+</span>
                                                        <img src={product.images?.[1] || product.images?.[0] || 'https://via.placeholder.com/150'} className="combo-ref-img" alt="" />
                                                    </div>
                                                    <div className="combo-ref-info">
                                                        <div className="combo-ref-includes">Includes: {product.title}</div>
                                                        <div className="combo-ref-price-wrap">
                                                            <span className="combo-ref-price-new">₹{product.offerPrice}</span>
                                                            <span className="combo-ref-price-old">₹{product.price}</span>
                                                        </div>
                                                        <button className="combo-ref-btn-gold" style={{ padding: '8px 20px', fontSize: '0.65rem' }} onClick={(e) => { e.preventDefault(); navigate(targetLink); }}>
                                                            Shop Combo
                                                        </button>
                                                    </div>
                                                </Link>
                                            ) : (
                                                <Link to={targetLink} className="signature-premium-card">
                                                    <div className="premium-img-container">
                                                        {discountPercent > 15 && (
                                                            <div className="premium-discount-badge" style={{ left: '15px', right: 'auto', background: 'var(--pink-accent)' }}>
                                                                <span className="discount-val-p" style={{ color: '#fff' }}>{discountPercent}<span className="animated-percent">%</span></span>
                                                                <span className="discount-label-p" style={{ color: '#fff' }}>OFF</span>
                                                            </div>
                                                        )}

                                                        <img
                                                            src={product.images?.[0] || 'https://via.placeholder.com/600x800'}
                                                            alt={product.title}
                                                            className="premium-main-img"
                                                        />
                                                        {product.images?.[1] && (
                                                            <img
                                                                src={product.images[1]}
                                                                alt={`${product.title} hover`}
                                                                className="premium-hover-img"
                                                            />
                                                        )}
                                                    </div>

                                                    <div className="card-content-p text-center">
                                                        <span className="premium-care-label">{product.brand}</span>
                                                        <h3 className="premium-product-title" style={{ fontSize: '0.9rem', minHeight: '42px', overflow: 'hidden' }}>
                                                            {product.title}
                                                        </h3>

                                                        <div className="premium-price-wrap">
                                                            {product.price > product.offerPrice && (
                                                                <span className="premium-old-price">₹{product.price}</span>
                                                            )}
                                                            <span className="premium-offer-price" style={{ fontSize: '1rem' }}>
                                                                ₹{product.offerPrice || product.price}
                                                            </span>
                                                        </div>

                                                        <button className="signature-shop-btn" style={{ padding: '8px 20px', fontSize: '0.65rem' }}>
                                                            View Product
                                                        </button>
                                                    </div>
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                     .pointer { cursor: pointer; }
                    .transition-transform { transition: transform 0.3s ease; }
                    .group:hover .transition-transform { transform: scale(1.05); }
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: var(--bg-cream); border-radius: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border-soft); border-radius: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--gold); }
                    .custom-checkbox input:checked { background-color: var(--pink-accent); border-color: var(--pink-accent); }
                    .form-check-input:checked { background-color: var(--pink-accent) !important; border-color: var(--pink-accent) !important; }

                     /* Premium Combo Card Design v2 (Gold Standard) */
                    .combo-ref-card {
                        background: var(--bg-card);
                        border: 1px solid var(--border-soft);
                        border-radius: 12px;
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                        text-decoration: none !important;
                        position: relative;
                        box-shadow: var(--shadow-soft);
                    }
                    .combo-ref-card:hover {
                        transform: translateY(-8px);
                        border-color: var(--pink-accent);
                        box-shadow: var(--shadow-hover);
                    }
                     .combo-ref-badge-wrap { text-align: center; padding-top: 15px; background: var(--bg-card); }
                    .combo-ref-badge {
                        background: var(--pink-accent);
                        color: #FFF;
                        padding: 4px 16px;
                        border-radius: 50px;
                        font-size: 13px;
                        font-weight: 700;
                        display: inline-block;
                        text-transform: none;
                        letter-spacing: 0.5px;
                    }
                     .combo-ref-savings-bar {
                        background: var(--gold-gradient);
                        padding: 8px 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        margin: 15px 0;
                        color: #FFF;
                        font-weight: 800;
                        font-size: 14px;
                    }
                    .combo-ref-savings-bar .save-text { color: var(--pink-accent); font-weight: 900; }
                     .combo-ref-images {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 15px;
                        padding: 20px 15px 30px 15px;
                        background: radial-gradient(circle at center, var(--bg-cream) 0%, var(--bg-card) 100%);
                    }
                    .combo-ref-img {
                        width: 44%;
                        height: 130px;
                        object-fit: contain;
                        filter: drop-shadow(0 8px 15px rgba(61, 44, 35, 0.1));
                        transition: transform 0.4s ease;
                    }
                    .combo-ref-card:hover .combo-ref-img { transform: scale(1.08) translateY(-5px); }
                    .combo-ref-plus { color: var(--text-primary); font-size: 24px; font-weight: 300; margin-top: -5px; }
                     .combo-ref-info { padding: 0 20px 20px 20px; text-align: center; display: flex; flex-direction: column; flex-grow: 1; }
                    .combo-ref-includes { font-size: 12px; color: var(--text-secondary); margin-bottom: 12px; font-weight: 500; }
                    .combo-ref-price-wrap { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 20px; }
                    .combo-ref-price-new { font-size: 24px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.5px; }
                    .combo-ref-price-old { font-size: 16px; color: var(--text-secondary); opacity: 0.4; text-decoration: line-through; }
                     .combo-ref-btn-gold {
                        width: 100%;
                        background: var(--gold-gradient);
                        color: #fff !important;
                        border: none;
                        padding: 14px;
                        border-radius: 8px;
                        font-weight: 800;
                        font-size: 16px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: var(--shadow-soft);
                    }
                    .combo-ref-btn-gold:hover { transform: scale(1.02); box-shadow: var(--shadow-hover); }

                    @media (max-width: 576px) {
                        .combo-ref-badge-wrap { padding-top: 8px; }
                        .combo-ref-badge { font-size: 10px; padding: 3px 10px; }
                        .combo-ref-savings-bar { 
                            font-size: 9px; 
                            padding: 5px 4px; 
                            margin: 6px 0; 
                            white-space: nowrap; 
                            gap: 4px;
                            letter-spacing: -0.2px;
                        }
                        .combo-ref-images { padding: 8px 5px 12px 5px; gap: 6px; }
                        .combo-ref-img { height: 60px; }
                        .combo-ref-info { padding: 0 10px 12px 10px; }
                        .combo-ref-includes { 
                            font-size: 10px; 
                            margin-bottom: 6px; 
                            line-height: 1.2; 
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            line-clamp: 2;
                            -webkit-box-orient: vertical;
                            min-height: 24px;
                        }
                        .combo-ref-price-wrap { gap: 6px; margin-bottom: 10px; }
                        .combo-ref-price-new { font-size: 18px; }
                        .combo-ref-btn-gold { padding: 8px 5px; font-size: 11px; border-radius: 6px; }
                    }

                    @media (max-width: 991px) {
                        .signature-premium-card { border-radius: 8px !important; }
                        .premium-product-title { 
                            font-size: 0.65rem !important; 
                            min-height: 28px !important; 
                            height: 1.8rem !important;
                            margin-bottom: 3px !important;
                        }
                        .card-content-p { padding: 6px 4px !important; }
                        .signature-shop-btn { 
                            padding: 4px 10px !important; 
                            font-size: 0.6rem !important; 
                        }
                        .premium-offer-price { font-size: 0.85rem !important; }
                    }
                `}</style>
        </div>
    );
};

export default ShopAll;