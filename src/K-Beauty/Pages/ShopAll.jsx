import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API_BASE_URL from "../config";
import { IoFilter } from 'react-icons/io5';
import { IoIosArrowForward } from 'react-icons/io';
import '../SinglesPage/BestSellerPage.css';

const ShopAll = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openSections, setOpenSections] = useState({});

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
        <div className="bg-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <div className="shop-all-hero bg-black py-5 text-center mb-5" style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.15)', background: 'linear-gradient(to bottom, #050505, #000)' }}>
                <span className="text-gold mb-2 d-block" style={{ letterSpacing: '5px', fontSize: '0.8rem', fontWeight: 500 }}>CURATED SELECTION</span>
                <h1 className="fw-light mb-3" style={{ letterSpacing: '2px', color: '#fff', fontFamily: "'Playfair Display', serif", fontSize: '3.5rem' }}>SHOP ALL</h1>
                <p className="mx-auto" style={{ maxWidth: '600px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 300, letterSpacing: '1px' }}>
                    Discover our complete range of high-performance K-Beauty products,
                    sourced directly from Seoul's most prestigious laboratories.
                </p>
            </div>

            <div className="container-fluid px-4 px-md-5 pb-5">
                {/* Mobile Filter Toggle */}
                <div className="d-lg-none mb-4 d-flex justify-content-between align-items-center border-bottom pb-3">
                    <span className="fw-bold"><NumberCounter targetNumber={filteredProducts.length} /> Results</span>
                    <button className="btn btn-dark d-flex align-items-center gap-2 rounded-1 px-4" onClick={() => setMobileFilterOpen(!mobileFilterOpen)}>
                        <IoFilter /> {mobileFilterOpen ? 'Close Filters' : 'Filters'}
                    </button>
                </div>

                <div className="row">
                    {/* ── FILTER SIDEBAR ── */}
                    <div className={`shop-filter-sidebar col-lg-3 pe-lg-5 ${mobileFilterOpen ? 'd-block mb-4' : 'd-none d-lg-block'}`}>
                        <div className="position-sticky custom-scrollbar" style={{ top: '100px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: '15px' }}>
                            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                                <h5 className="fw-bold m-0 text-white" style={{ letterSpacing: '1px' }}>FILTERS</h5>
                                <button className="btn btn-link text-gold p-0 text-decoration-none small" onClick={() => setSelectedFilters({ brand: [], category: [], type: [], skinType: [], skinConcern: [], price: [] })}>
                                    Reset All
                                </button>
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
                                            <h6 className="text-uppercase m-0" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: 'var(--gold-light)' }}>
                                                {formatFilterLabel(filterKey)}
                                            </h6>
                                            <span style={{ transform: openSections[filterKey] ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', color: 'var(--gold)' }}>
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
                                                            className="form-check-input bg-black border-secondary shadow-none me-2"
                                                            type="checkbox"
                                                            id={`filter-${filterKey}-${idx}`}
                                                            checked={selectedFilters[filterKey].includes(val)}
                                                            onChange={() => handleFilterChange(filterKey, val)}
                                                            style={{ cursor: 'pointer', borderRadius: '4px' }}
                                                        />
                                                        <label className="form-check-label d-flex justify-content-between w-100" htmlFor={`filter-${filterKey}-${idx}`} style={{ cursor: 'pointer', fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', letterSpacing: '0.5px' }}>
                                                            <span>{val}</span>
                                                            <span className="small opacity-50" style={{ fontSize: '10px' }}>{count}</span>
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
                        <div className="d-none d-lg-flex justify-content-between align-items-center mb-4">
                            <span className="text-white fw-bold">Showing <NumberCounter targetNumber={filteredProducts.length} /> Products</span>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-5 my-5 bg-dark rounded-4" style={{ border: '1px solid var(--border-gold)' }}>
                                <h4 className="fw-bold text-white">No Products Found</h4>
                                <p className="text-muted mb-4">We couldn't find anything matching your selected filters.</p>
                                <button className="btn btn-gold rounded-1 px-4 py-2" onClick={() => setSelectedFilters({ brand: [], category: [], type: [], skinType: [], skinConcern: [], price: [] })}>
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <div className="row g-4">
                                {filteredProducts.map(product => {
                                    const discountPercent = product.price && product.offerPrice
                                        ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
                                        : 0;

                                    const targetLink = `/${product.category === 'Makeup' ? 'Makeup' : 'SkinCare'}/${product._id}`;

                                    return (
                                        <div className="col-6 col-md-4 mb-4" key={product._id}>
                                            <Link to={targetLink} className="signature-premium-card">
                                                <div className="premium-img-container">
                                                    {discountPercent > 15 && (
                                                        <div className="premium-discount-badge" style={{ left: '10px', right: 'auto' }}>
                                                            <span className="discount-val-p">{discountPercent}<span className="animated-percent">%</span></span>
                                                            <span className="discount-label-p">OFF</span>
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
                                                    <h3 className="premium-product-title" style={{ fontSize: '0.9rem' }}>
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
                .custom-scrollbar::-webkit-scrollbar-track { background: #111; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
                .custom-checkbox input:checked { background-color: #D4AF37; border-color: #D4AF37; }
            `}</style>
        </div>
    );
};

export default ShopAll;