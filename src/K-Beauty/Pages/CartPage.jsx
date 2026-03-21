import React, { useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { FiTrash2, FiShoppingBag, FiChevronRight, FiMinus, FiPlus, FiArrowLeft } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import video from "../assets/CartPage_VIdeo.mp4";
import toast, { Toaster } from 'react-hot-toast';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();

    // Calculate total price
    const total = useMemo(() => {
        let calculatedTotal = 0;
        cartItems.forEach((item) => {
            const rawPrice = item.price || 0;
            const quantity = item.quantity || 1;
            const numericPrice = typeof rawPrice === 'string'
                ? parseFloat(rawPrice.replace(/[₹,]/g, ""))
                : rawPrice;
            if (!isNaN(numericPrice)) {
                calculatedTotal += numericPrice * quantity;
            }
        });
        return calculatedTotal;
    }, [cartItems]);

    return (
        <div className="cart-page-root" style={{
            background: 'var(--bg-cream)',
            minHeight: '100vh',
            color: 'var(--text-primary)',
            fontFamily: "'Outfit', sans-serif",
            paddingTop: '100px',
            paddingBottom: '50px'
        }}>
            <Toaster position="top-right" />

            <div className="container px-3 px-md-4">
                {cartItems.length === 0 ? (
                    /* ── EMPTY STATE ── */
                    <div className="empty-cart-container animate-fade-in">
                        <div className="row align-items-center min-vh-75 g-5">
                            <div className="col-lg-6 text-center text-lg-start">
                                <div className="badge-luxury mb-3 d-inline-block">YOUR COLLECTION</div>
                                <h1 className="cart-display-title fw-900 mb-4 lh-1">
                                    YOUR <span className="text-gold">PALETTE</span> <br />
                                    IS EMPTY
                                </h1>
                                <p className="text-secondary fs-5 mb-5 max-w-lg mx-auto mx-lg-0">
                                    Your luxury skincare journey awaits. Discover our curated collection of K-Beauty essentials.
                                </p>
                                <button onClick={() => navigate('/')} className="btn-luxury px-5 py-3 shadow-sm">
                                    START YOUR RITUAL <FiChevronRight className="ms-2" />
                                </button>

                                <div className="mt-5 d-flex gap-4 justify-content-center justify-content-lg-start opacity-50 small fw-bold letter-spacing-2">
                                    <span>SECURE</span>
                                    <span>PREMIUM</span>
                                    <span>AUTHENTIC</span>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="video-glass-container p-2 p-md-3 animate-float">
                                    <video src={video} muted autoPlay loop playsInline className="rounded-4 w-100 shadow-2xl"
                                        style={{ aspectRatio: '4/5', objectFit: 'cover' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── ACTIVE CART ── */
                    <div className="animate-fade-in">
                        {/* Header Section */}
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center align-items-md-end mb-4 mb-md-5 gap-3">
                            <div className="text-center text-md-start">
                                <Link to="/" className="text-decoration-none small fw-bold d-inline-flex align-items-center gap-2 mb-3 hover-gold" style={{ color: 'var(--pink-accent)' }}>
                                    <FiArrowLeft /> CONTINUE SHOPPING
                                </Link>
                                <h1 className="cart-active-title fw-bold m-0 lh-1" style={{ color: 'var(--text-primary)' }}>YOUR SELECTION</h1>
                            </div>
                            <div>
                                <span className="badge-luxury">{cartItems.length} {cartItems.length === 1 ? 'Product' : 'Products'}</span>
                            </div>
                        </div>

                        <div className="row g-4 g-lg-5">
                            {/* Items List */}
                            <div className="col-lg-8">
                                <div className="d-flex flex-column gap-3 gap-md-4">
                                    {cartItems.map((item, index) => (
                                        <div key={`${item._id}-${index}`} className="cart-item-card-premium p-3 p-md-4">
                                            <div className="d-flex gap-3 gap-md-4 align-items-start">
                                                {/* Image */}
                                                <div className="item-image-wrapper">
                                                    <img src={item.image} alt={item.title} />
                                                </div>

                                                {/* Details */}
                                                <div className="flex-grow-1">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <div>
                                                            <h5 className="item-title-luxury fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</h5>
                                                            <span className="text-secondary smaller fw-medium">Size: {item.size || "Standard"}</span>
                                                        </div>
                                                        <button onClick={() => removeFromCart(item)} className="btn-delete-luxury" title="Remove item">
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>

                                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-3">
                                                        {/* Quantity Controls */}
                                                        <div className="qty-controls-luxury">
                                                            <button
                                                                onClick={() => updateQuantity(item, (item.quantity || 1) - 1)}
                                                                className="qty-btn" disabled={(item.quantity || 1) <= 1}
                                                            >
                                                                <FiMinus />
                                                            </button>
                                                            <span className="qty-value">{item.quantity || 1}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item, (item.quantity || 1) + 1)}
                                                                className="qty-btn"
                                                            >
                                                                <FiPlus />
                                                            </button>
                                                        </div>

                                                        {/* Price Tag */}
                                                        <div className="item-price-tag text-end">
                                                            <span className="fs-5 fw-bold" style={{ color: 'var(--text-primary)' }}>₹{(Number(item.price) * (item.quantity || 1)).toLocaleString()}</span>
                                                            <div className="text-secondary smaller mt-1">₹{Number(item.price).toLocaleString()} / u</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary Sidebar */}
                            <div className="col-lg-4">
                                <div className="summary-glass-card p-4 p-md-5 sticky-top shadow-sm" style={{ top: '120px', background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                                    <h4 className="fw-bold mb-4 border-bottom pb-3 fs-5" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-soft)' }}>Order Summary</h4>

                                    <div className="summary-row mb-3 smaller-md">
                                        <span className="text-secondary">Subtotal ({cartItems.length} items)</span>
                                        <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>₹{total.toLocaleString()}</span>
                                    </div>
                                    <div className="summary-row mb-4 smaller-md">
                                        <span className="text-secondary">Luxury Shipping</span>
                                        <span className="text-success fw-bold">FREE</span>
                                    </div>

                                    <div className="total-box pt-4 border-top mb-4 mb-md-5" style={{ borderColor: 'var(--border-soft)' }}>
                                        <div className="d-flex justify-content-between align-items-end">
                                            <span className="label-luxury m-0">Grand Total</span>
                                            <span className="fs-3 fw-bold" style={{ color: 'var(--pink-accent)' }}>₹{total.toLocaleString()}</span>
                                        </div>
                                        <div className="text-secondary smaller text-end mt-1">Inclusive of all taxes</div>
                                    </div>

                                    <button onClick={() => navigate("/order")} className="btn-luxury w-100 py-3 d-flex align-items-center justify-content-center gap-2">
                                        CHECKOUT <FiChevronRight />
                                    </button>

                                    <div className="mt-4 pt-4 border-top d-flex justify-content-center gap-4 opacity-30 small fw-bold letter-spacing-2" style={{ borderColor: 'var(--border-soft)' }}>
                                        <span>SECURE</span>
                                        <span>ENCRYPTED</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .text-gold { color: var(--pink-accent) !important; }
                .text-secondary { color: var(--text-secondary) !important; }
                .smaller { font-size: 11px; }
                .letter-spacing-2 { letter-spacing: 2px; }
                .fw-900 { font-weight: 900; }
                .min-vh-75 { min-height: 75vh; }
                
                /* ── CARDS ── */
                .cart-item-card-premium {
                    background: var(--bg-card);
                    border: 1px solid var(--border-soft);
                    border-radius: 20px;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: var(--shadow-soft);
                }
                .cart-item-card-premium:hover {
                    border-color: var(--pink-accent);
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-hover);
                }

                .summary-glass-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border-soft);
                    border-radius: 20px;
                }

                /* ── IMAGES ── */
                .item-image-wrapper {
                    width: 80px;
                    height: 80px;
                    flex-shrink: 0;
                    background: var(--bg-cream);
                    border-radius: 14px;
                    padding: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }
                @media (min-width: 768px) {
                    .item-image-wrapper { width: 120px; height: 120px; border-radius: 18px; }
                }
                .item-image-wrapper img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    transition: transform 0.5s ease;
                }
                .cart-item-card-premium:hover .item-image-wrapper img {
                    transform: scale(1.1);
                }

                /* ── TYPOGRAPHY ── */
                .cart-display-title { font-size: clamp(2.5rem, 8vw, 4.5rem); }
                .cart-active-title { font-size: clamp(1.8rem, 5vw, 3.5rem); }
                .item-title-luxury { font-size: 14px; line-height: 1.4; }
                @media (min-width: 768px) {
                    .item-title-luxury { font-size: 18px; }
                }

                /* ── QUANTITY CONTROLS ── */
                .qty-controls-luxury {
                    display: flex;
                    align-items: center;
                    background: var(--bg-cream);
                    padding: 4px;
                    border-radius: 10px;
                    border: 1px solid var(--border-soft);
                    width: fit-content;
                }
                .qty-btn {
                    background: none; border: none; color: var(--text-primary);
                    width: 28px; height: 28px; border-radius: 6px;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s;
                    font-size: 12px;
                }
                @media (min-width: 768px) {
                    .qty-btn { width: 34px; height: 34px; font-size: 14px; }
                }
                .qty-btn:hover:not(:disabled) { background: var(--bg-card); color: var(--pink-accent); }
                .qty-btn:disabled { opacity: 0.2; cursor: not-allowed; }
                .qty-value { width: 30px; text-align: center; font-weight: 700; font-size: 13px; }
                @media (min-width: 768px) {
                    .qty-value { width: 40px; font-size: 14px; }
                }

                /* ── BUTTONS ── */
                .btn-luxury {
                    background: var(--gold-gradient);
                    color: #FFF;
                    font-weight: 800;
                    letter-spacing: 1.2px;
                    border: none;
                    padding: 14px 30px;
                    border-radius: 12px;
                    transition: all 0.3s;
                    text-transform: uppercase;
                    font-size: 12px;
                }
                @media (min-width: 768px) {
                    .btn-luxury { padding: 18px 40px; font-size: 13px; letter-spacing: 1.5px; }
                }
                .btn-luxury:hover {
                    background: #f1c40f;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3);
                }
                .btn-delete-luxury {
                    background: rgba(239, 68, 68, 0.08);
                    color: #ef4444;
                    border: none;
                    width: 32px; height: 32px;
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.3s;
                    font-size: 14px;
                    flex-shrink: 0;
                }
                @media (min-width: 768px) {
                    .btn-delete-luxury { width: 38px; height: 38px; font-size: 18px; }
                }
                .btn-delete-luxury:hover {
                    background: #ef4444; color: #fff; transform: scale(1.05);
                }

                .badge-luxury {
                    background: var(--bg-cream);
                    color: var(--pink-accent);
                    padding: 5px 12px;
                    border-radius: 8px;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 1px;
                    border: 1px solid var(--border-soft);
                    text-transform: uppercase;
                }
                @media (min-width: 768px) {
                    .badge-luxury { padding: 6px 16px; font-size: 12px; }
                }

                .label-luxury {
                    font-size: 9px; font-weight: 800; text-transform: uppercase;
                    letter-spacing: 1.2px; color: #aaa; margin-bottom: 5px; opacity: 0.7;
                }

                .summary-row {
                    display: flex; justify-content: space-between; align-items: center;
                    font-size: 13px;
                }
                @media (min-width: 768px) {
                    .summary-row { font-size: 15px; }
                }

                .hover-gold:hover { color: #fff !important; transform: translateX(-5px); transition: all 0.3s; }

                /* ── VIDEO ── */
                .video-glass-container {
                    background: var(--bg-card);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--border-soft);
                    border-radius: 30px;
                    max-width: 400px;
                    margin: 0 auto;
                }

                /* ── ANIMATIONS ── */
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.23, 1, 0.32, 1); }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }

                .sticky-top { transition: all 0.3s ease; }

                /* ── RESPONSIVE ── */
                @media (max-width: 768px) {
                    .summary-glass-card { margin-top: 10px; border-radius: 20px; padding: 25px !important; }
                }
            `}</style>
        </div>
    );
};

export default CartPage;
