import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { FiChevronRight, FiBox, FiCheckCircle } from 'react-icons/fi';
import FeaturesRow from '../FeaturesRow';
import ShippingReturns from '../ShippingReturns';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import API_BASE_URL from "../config";
import WishlistButton from '../WishlistButton';
import { loginStatus } from '../../App';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductSingle.css';

const ProductSingle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    const { addToCart } = useCart();
    const { addToWishlist } = useWishlist();
    const { token } = useContext(loginStatus);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProduct = async () => {
            try {
                // Try fetching by exact ID
                let res = await axios.get(`${API_BASE_URL}/products/${id}`);
                let prodData = res.data;

                // Fallback: If the API returns an array (some json-server versions do this for ?id= query)
                if (Array.isArray(prodData)) {
                    prodData = prodData[0];
                }

                if (prodData) {
                    setProduct(prodData);
                    setSelectedImage(prodData.images?.[0]);

                    // Fetch related products (same category, excluding current)
                    axios.get(`${API_BASE_URL}/products?category=${prodData.category}&_limit=5`)
                        .then(relRes => setRelatedProducts(relRes.data.filter(p => p._id !== prodData._id)));
                } else {
                    toast.error("Product not found");
                }
            } catch (err) {
                // Secondary fallback using query param search
                try {
                    const fallbackRes = await axios.get(`${API_BASE_URL}/products?slug=${id}`); // Or search by slug if using slugs in URL
                    if (fallbackRes.data && fallbackRes.data.length > 0) {
                        setProduct(fallbackRes.data[0]);
                        setSelectedImage(fallbackRes.data[0].images?.[0]);
                    } else {
                        // Let's try ID one more time as a query param
                        const finalRes = await axios.get(`${API_BASE_URL}/products?id=${id}`);
                        if (finalRes.data && finalRes.data.length > 0) {
                            setProduct(finalRes.data[0]);
                            setSelectedImage(finalRes.data[0].images?.[0]);
                        } else {
                            toast.error("Product not found");
                        }
                    }
                } catch (e) {
                    console.error('Error fetching product:', e);
                }
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product.size && product.size.trim() !== "" && !selectedSize) {
            toast.error('Please select a size first!');
            return;
        }

        const cartItem = {
            id: product._id,
            title: product.title,
            image: selectedImage,
            price: product.offerPrice || product.price,
            size: selectedSize || "Standard",
            quantity: 1,
        };

        addToCart(cartItem);
        toast.success('Added to cart!');
    };

    // Helper to render star ratings dynamically
    const renderStars = (ratingNum) => {
        const stars = [];
        const fullStars = Math.floor(ratingNum);
        const hasHalf = ratingNum % 1 >= 0.5;
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) stars.push(<FaStar key={i} className="text-warning" />);
            else if (i === fullStars && hasHalf) stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
            else stars.push(<FaRegStar key={i} className="text-muted opacity-50" />);
        }
        return stars;
    };

    if (!product) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <div className="spinner-border text-dark" style={{ width: '3rem', height: '3rem' }} />
            </div>
        );
    }

    const discountPercentage = product.price > product.offerPrice
        ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
        : 0;

    return (
        <div className="pdp-main-container" style={{ background: 'var(--bg-cream)', color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif" }}>
            {/* Breadcrumb Navigation */}
            <div className="container pt-lg-2 pt-1 pb-2">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0 px-0" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                        <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted opacity-50 hover-opacity-100 transition-all">Home</Link></li>
                        <li className="breadcrumb-item"><Link to={`/${product.category.replace(/\s+/g, '')}`} className="text-decoration-none text-muted opacity-50 hover-opacity-100 transition-all">{product.category}</Link></li>
                        <li className="breadcrumb-item active fw-bold" style={{ color: 'var(--pink-accent)' }} aria-current="page">{product.title}</li>
                    </ol>
                </nav>
            </div>

            <div className="container pb-5">
                <div className="row gx-lg-5 gy-5">
                    {/* ── LEFT COLUMN: IMAGES ── */}
                    <div className="col-lg-6">
                        <div className="position-sticky" style={{ top: '100px' }}>
                            <div className="product-gallery-wrapper d-flex flex-column flex-md-row gap-3">
                                {/* Thumbnails (Vertical on desktop, Horizontal on mobile) */}
                                <div className="product-thumbnails-wrap d-flex flex-md-column flex-row gap-2 order-2 order-md-1 overflow-auto hide-scrollbar" style={{ maxHeight: '600px' }}>
                                    {product.images?.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`btn p-0 border-0 rounded-3 overflow-hidden transition-all thumbnail-btn ${selectedImage === img ? 'thumbnail-active shadow-sm border border-2' : 'thumbnail-inactive'}`}
                                            style={{ flexShrink: 0 }}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${idx}`}
                                                className="w-100 h-100"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </button>
                                    ))}
                                </div>

                                {/* Main Feature Image */}
                                <div className="main-feature-img-box flex-grow-1 order-1 order-md-2 position-relative rounded-4 overflow-hidden d-flex justify-content-center align-items-center p-4 shadow-sm" style={{ height: '100%', maxHeight: '600px', background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                                    {discountPercentage > 0 && (
                                        <div className="position-absolute top-0 start-0 m-4 badge bg-danger text-white px-3 py-2 rounded-pill fw-bold" style={{ zIndex: 10, letterSpacing: '1px' }}>
                                            SAVE {discountPercentage}%
                                        </div>
                                    )}
                                    <div className="position-absolute top-0 end-0 m-4">
                                        <WishlistButton product={product} />
                                    </div>
                                    <img
                                        src={selectedImage}
                                        alt={product.title}
                                        style={{ maxHeight: '500px', objectFit: 'contain' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN: DETAILS ── */}
                    <div className="col-lg-6">
                        <div className="pe-xl-5">
                            {/* Brand & Title */}
                             <div className="mb-4">
                                <Link to={`/brand/${product.brand}`} className="text-decoration-none">
                                    <span className="text-uppercase fw-bold mb-2 d-block" style={{ letterSpacing: '4px', fontSize: '11px', color: 'var(--pink-accent)' }}>{product.brand}</span>
                                </Link>
                                <h1 className="product-title-main fw-light mb-2" style={{ fontFamily: "'Playfair Display', serif", lineHeight: '1.2', color: 'var(--text-primary)' }}>
                                    {product.title}
                                </h1>
                                <div className="premium-line mb-4" style={{ width: '60px', height: '2px', background: 'var(--pink-accent)' }}></div>
                            </div>

                            {/* Rating */}
                            <div className="d-flex align-items-center gap-2 mb-4">
                                <div className="d-flex gap-1">
                                    {renderStars(product.rating || 5)}
                                </div>
                                <span className="text-muted opacity-50 fw-bold small">({product.rating || 5} Rating)</span>
                            </div>

                            {/* Brief Description */}
                            {product.description && (
                                <p className="text-muted lh-lg mb-4 pb-3 border-bottom" style={{ fontSize: '15px', borderColor: 'var(--border-soft)' }}>
                                    {product.description}
                                </p>
                            )}

                            {/* Price Block */}
                            <div className="d-flex align-items-center gap-3 mb-5">
                                <span className="product-price-main fw-light" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>₹{product.offerPrice || product.price}</span>
                                {product.price > product.offerPrice && (
                                    <span className="text-muted opacity-50 text-decoration-line-through fw-light" style={{ fontSize: '1.2rem' }}>₹{product.price}</span>
                                )}
                            </div>

                            {/* Stock Indicator */}
                            <div className="d-flex align-items-center gap-2 mb-4">
                                {product.stockQuantity > 0 ? (
                                    <div className="d-flex align-items-center gap-2 text-success fw-bold small bg-success-subtle px-3 py-1 rounded-pill">
                                        <FiCheckCircle /> <span style={{ letterSpacing: '1px' }}>IN STOCK ({product.stockQuantity})</span>
                                    </div>
                                ) : (
                                    <div className="badge bg-danger text-white px-3 py-2 rounded-pill fw-bold" style={{ letterSpacing: '1px' }}>
                                        OUT OF STOCK
                                    </div>
                                )}
                            </div>

                            {/* Size Selection */}
                            {product.size && product.size.trim() !== "" && (
                                <div className="mb-5">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="fw-bold m-0 text-uppercase text-muted opacity-75" style={{ fontSize: '12px', letterSpacing: '1px' }}>Select Variant</h6>
                                        <span className="text-muted opacity-50 small fw-medium text-decoration-underline pointer">Size Guide</span>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        {product.size.split(',').map((sizeStr) => (
                                            <button
                                                key={sizeStr}
                                                className={`btn btn-md border transition-all rounded-1 ${selectedSize === sizeStr.trim() ? 'bg-gold text-white border-gold px-4 fw-bold' : 'btn-outline-secondary border-secondary border-opacity-25 px-4 fw-medium text-muted'}`}
                                                style={{ fontSize: '13px' }}
                                                onClick={() => setSelectedSize(sizeStr.trim())}
                                            >
                                                {sizeStr.trim()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="product-actions-container d-flex flex-column flex-lg-row gap-3 mb-5">
                                <button
                                    className="btn rounded-1 fw-bold flex-grow-1 transition-all"
                                    style={{
                                        background: 'var(--gold-gradient)',
                                        color: '#FFF',
                                        height: '50px',
                                        fontSize: '14px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1.5px',
                                        border: 'none',
                                        boxShadow: 'var(--shadow-soft)'
                                    }}
                                    onClick={handleAddToCart}
                                    disabled={product.stockQuantity <= 0}
                                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-soft)'; }}
                                >
                                    {product.stockQuantity > 0 ? 'Add to Bag' : 'Out of Stock'}
                                </button>
                                <button
                                    className="btn rounded-1 fw-bold flex-grow-1 transition-all"
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: 'var(--pink-accent)',
                                        border: '1px solid var(--pink-accent)',
                                        height: '50px',
                                        fontSize: '14px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1.5px'
                                    }}
                                    disabled={product.stockQuantity <= 0}
                                    onClick={() => {
                                        handleAddToCart();
                                        setTimeout(() => { navigate('/cart'); }, 500);
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--pink-accent)'; e.currentTarget.style.color = '#FFF'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--pink-accent)'; }}
                                >
                                    Buy it Now
                                </button>
                            </div>

                            {/* Features Banner */}
                            <div className="p-4 rounded-4 mb-5 shadow-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                                <FeaturesRow />
                            </div>

                            {/* ── INFO TABS (ACCORDION) ── */}
                            <div className="accordion accordion-flush" id="productDetailsAccordion">
                                {/* Benefits */}
                                {product.benefits && product.benefits.length > 0 && (
                                    <div className="accordion-item border-bottom bg-transparent" style={{ borderColor: 'var(--border-soft)' }}>
                                        <h2 className="accordion-header">
                                            <button className="accordion-button collapsed bg-transparent px-0 py-4 fw-bold text-uppercase shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBenefits" style={{ letterSpacing: '1.5px', fontSize: '13px', color: 'var(--text-primary)' }}>
                                                Primary Benefits
                                            </button>
                                        </h2>
                                        <div id="collapseBenefits" className="accordion-collapse collapse" data-bs-parent="#productDetailsAccordion">
                                            <div className="accordion-body px-0 pt-0 pb-4">
                                                <ul className="lh-lg text-muted mb-0" style={{ fontSize: '14px' }}>
                                                    {product.benefits.map((benefit, idx) => (
                                                        <li key={idx} className="mb-2">{benefit}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Ingredients */}
                                {product.keyIngredients && product.keyIngredients.length > 0 && (
                                    <div className="accordion-item border-bottom bg-transparent" style={{ borderColor: 'var(--border-soft)' }}>
                                        <h2 className="accordion-header">
                                            <button className="accordion-button collapsed bg-transparent px-0 py-4 fw-bold text-uppercase shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseIngredients" style={{ letterSpacing: '1.5px', fontSize: '13px', color: 'var(--text-primary)' }}>
                                                Key Ingredients
                                            </button>
                                        </h2>
                                        <div id="collapseIngredients" className="accordion-collapse collapse" data-bs-parent="#productDetailsAccordion">
                                            <div className="accordion-body px-0 pt-0 pb-4">
                                                <div className="d-flex flex-wrap gap-2">
                                                    {product.keyIngredients.map((ing, idx) => (
                                                        <span key={idx} className="badge px-3 py-2 rounded-1 fw-bold" style={{ fontSize: '11px', letterSpacing: '0.5px', background: 'var(--bg-cream)', color: 'var(--pink-accent)', border: '1px solid var(--border-soft)' }}>{ing}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* How to Use */}
                                {product.howToUse && product.howToUse.length > 0 && (
                                    <div className="accordion-item border-bottom bg-transparent" style={{ borderColor: 'var(--border-soft)' }}>
                                        <h2 className="accordion-header">
                                            <button className="accordion-button collapsed bg-transparent px-0 py-4 fw-bold text-uppercase shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseUsage" style={{ letterSpacing: '1.5px', fontSize: '13px', color: 'var(--text-primary)' }}>
                                                How To Application
                                            </button>
                                        </h2>
                                        <div id="collapseUsage" className="accordion-collapse collapse" data-bs-parent="#productDetailsAccordion">
                                            <div className="accordion-body px-0 pt-0 pb-4">
                                                <ol className="lh-lg text-muted mb-0" style={{ fontSize: '14px' }}>
                                                    {product.howToUse.map((step, idx) => (
                                                        <li key={idx} className="mb-3">{step}</li>
                                                    ))}
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Shipping */}
                                <div className="accordion-item border-bottom bg-transparent" style={{ borderColor: 'var(--border-soft)' }}>
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed bg-transparent px-0 py-4 fw-bold text-uppercase shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseShipping" style={{ letterSpacing: '1.5px', fontSize: '13px', color: 'var(--text-primary)' }}>
                                            Shipping & Delivery
                                        </button>
                                    </h2>
                                    <div id="collapseShipping" className="accordion-collapse collapse" data-bs-parent="#productDetailsAccordion">
                                        <div className="accordion-body px-0 pt-0 pb-4">
                                            {/* Shipping Note Box - Forcing Contrast */}
                                            <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-3 shadow-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                                                <FiBox size={22} className="flex-shrink-0" style={{ color: 'var(--pink-accent)' }} />
                                                <p className="m-0 fw-bold small" style={{ letterSpacing: '0.5px', color: 'var(--text-primary)' }}>
                                                    {product.shippingInfo || "Free standard shipping on orders over ₹999."}
                                                </p>
                                            </div>
                                            <ShippingReturns />
                                        </div>
                                    </div>
                                </div>

                                {/* FAQs */}
                                {product.faqs && product.faqs.length > 0 && (
                                    <div className="accordion-item border-bottom bg-transparent" style={{ borderColor: 'var(--border-soft)' }}>
                                        <h2 className="accordion-header">
                                            <button className="accordion-button collapsed bg-transparent px-0 py-4 fw-bold text-uppercase shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFaq" style={{ letterSpacing: '1.5px', fontSize: '13px', color: 'var(--text-primary)' }}>
                                                Frequently Asked Questions
                                            </button>
                                        </h2>
                                        <div id="collapseFaq" className="accordion-collapse collapse" data-bs-parent="#productDetailsAccordion">
                                            <div className="accordion-body px-0 pt-0 pb-4">
                                                <ul className="lh-lg mb-0 list-unstyled" style={{ fontSize: '14px' }}>
                                                    {product.faqs.map((faq, idx) => (
                                                        <li key={idx} className="mb-3 p-3 rounded-3 fw-medium" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)', color: 'var(--text-primary)' }}>
                                                            <span className="fw-bold me-2" style={{ color: 'var(--pink-accent)' }}>Q:</span> {faq}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RELATED PRODUCTS ── */}
            {relatedProducts.length > 0 && (
                <div className="py-5 mt-5" style={{ background: 'var(--bg-cream)', borderTop: '1px solid var(--border-soft)' }}>
                    <div className="container py-4">
                        <div className="d-flex justify-content-between align-items-end mb-5">
                            <div>
                                <h6 className="text-uppercase text-muted fw-bold mb-2" style={{ letterSpacing: '2px', fontSize: '12px' }}>Complete Your Routine</h6>
                                <h2 className="fw-bolder m-0" style={{ fontSize: '2rem', letterSpacing: '-1px', color: 'var(--text-primary)' }}>Related from {product.category}</h2>
                            </div>
                            <Link to={`/${product.category.replace(/\s+/g, '')}`} className="btn btn-link fw-bold text-decoration-none d-none d-md-flex align-items-center gap-2" style={{ color: 'var(--pink-accent)' }}>
                                View Collection <FiChevronRight />
                            </Link>
                        </div>

                        <div className="row g-4 mobile-scroll-row pb-3 flex-nowrap overflow-auto hide-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
                            {relatedProducts.map(rp => (
                                <div key={rp._id} className="col-8 col-sm-6 col-md-4 col-lg-3" style={{ scrollSnapAlign: 'start' }}>
                                    <Link to={`/product/${rp._id}`} className="signature-premium-card">
                                        <div className="premium-img-container">
                                            <img src={rp.images?.[0]} className="premium-main-img" alt={rp.title} loading="lazy" />
                                        </div>
                                        <div className="card-content-p text-center">
                                            <span className="premium-care-label">{rp.brand || 'K-BEAUTY'}</span>
                                            <h3 className="premium-product-title">{rp.title}</h3>
                                            <div className="premium-price-wrap">
                                                {rp.price > rp.offerPrice && <span className="premium-old-price">₹{rp.price}</span>}
                                                <span className="premium-offer-price">₹{rp.offerPrice || rp.price}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductSingle;
