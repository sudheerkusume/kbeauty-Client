import React from 'react';
import { useWishlist } from './context/WishlistContext';
import { useCart } from './context/CartContext';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiArrowLeft, FiPlus } from 'react-icons/fi';
import Empty from './assets/Wishlist.png';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    return (
        <div className="wishlist-v2-container">
            {/* Header Section - Editorial Style */}
            <div className="editorial-header">
                <div className="header-top">
                    <Link to="/" className="back-btn-minimal">
                        <FiArrowLeft /> Shop
                    </Link>
                    <span className="count-badge">{wishlist.length} Items</span>
                </div>
                <div className="title-stack">
                    <span className="title-decorative">Curated</span>
                    <h1 className="main-title">Collection</h1>
                </div>
                <p className="description-minimal">
                    A private selection of your most desired K-Beauty essentials.
                </p>
            </div>

            {wishlist.length === 0 ? (
                <div className="empty-state-v2 animate-reveal">
                    <div className="artwork-wrapper">
                        <img src={Empty} alt="Empty collection" />
                        <div className="blob-gradient"></div>
                    </div>
                    <div className="empty-content">
                        <h2 className="empty-heading">Silence is not Golden</h2>
                        <p className="empty-sub">Your curation is currently empty. Start building your perfect ritual today.</p>
                        <Link to="/" className="luxury-cta">Explore New Arrivals</Link>
                    </div>
                </div>
            ) : (
                <div className="luxury-grid animate-grid">
                    {wishlist.map((item) => (
                        <div key={item._id} className="luxury-card iridescent-glass">
                            <div className="image-stage">
                                <Link to={`/product/${item._id}`}>
                                    <img src={item.image || item.images?.[0]} alt={item.title} className="product-hero" />
                                </Link>
                                <button
                                    className="quick-remove-btn"
                                    onClick={() => removeFromWishlist(item._id)}
                                    title="Remove"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                                {item.brand && (
                                    <div className="brand-overlay">
                                        <span className="brand-tag">{item.brand}</span>
                                    </div>
                                )}
                            </div>

                            <div className="details-stage">
                                <div className="text-group">
                                    <span className="item-category">SKINCARE</span>
                                    <h3 className="item-title">{item.title}</h3>
                                </div>
                                <div className="action-row">
                                    <span className="item-price">₹{item.Offer}</span>
                                    <button
                                        className="add-ritual-btn"
                                        onClick={() => addToCart(item)}
                                    >
                                        <FiPlus /> Ritual
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Inter:wght@300;400;600;700&display=swap');

                .wishlist-v2-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 40px 5% 100px;
                    background: var(--bg-cream);
                    min-height: 100vh;
                    font-family: 'Outfit', sans-serif;
                    color: var(--text-primary);
                }

                /* Editorial Header */
                .editorial-header {
                    margin-bottom: 80px;
                    position: relative;
                }

                .header-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }

                 .back-btn-minimal {
                    color: var(--text-primary);
                    text-decoration: none;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-size: 11px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    opacity: 0.5;
                    transition: all 0.3s;
                }

                .back-btn-minimal:hover { opacity: 1; color: #D4AF37; }

                 .count-badge {
                    font-size: 10px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    color: var(--pink-accent);
                    border: 1px solid var(--border-soft);
                    background: var(--bg-card);
                    padding: 4px 12px;
                    border-radius: 100px;
                }

                .title-stack {
                    display: flex;
                    flex-direction: column;
                    line-height: 0.9;
                }

                 .title-decorative {
                    font-family: 'Playfair Display', serif;
                    font-style: italic;
                    font-weight: 400;
                    font-size: clamp(1.5rem, 4vw, 2.5rem);
                    color: var(--pink-accent);
                    margin-left: 15px;
                    margin-bottom: -5px;
                    opacity: 0.8;
                }

                 .main-title {
                    font-family: 'Outfit', sans-serif;
                    font-weight: 900;
                    font-size: clamp(3rem, 10vw, 7rem);
                    text-transform: uppercase;
                    letter-spacing: -3px;
                    margin: 0;
                    background: linear-gradient(180deg, var(--text-primary) 0%, var(--text-secondary) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                 .description-minimal {
                    max-width: 350px;
                    margin-top: 30px;
                    color: var(--text-secondary);
                    font-size: 1rem;
                    line-height: 1.5;
                    font-weight: 300;
                }

                /* Luxury Grid */
                .luxury-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 30px;
                }

                 .iridescent-glass {
                    background: var(--bg-card);
                    border: 1px solid var(--border-soft);
                    border-radius: 24px;
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    position: relative;
                    overflow: hidden;
                    box-shadow: var(--shadow-soft);
                }

                .iridescent-glass::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 24px;
                    padding: 1px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(212, 175, 55, 0.15), rgba(255,255,255,0.05));
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    opacity: 0.4;
                }

                 .luxury-card:hover {
                    transform: translateY(-10px);
                    border-color: var(--pink-accent);
                    box-shadow: var(--shadow-hover);
                }

                 .image-stage {
                    position: relative;
                    height: 380px;
                    overflow: hidden;
                    background: #fff;
                }

                .product-hero {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    padding: 30px;
                    transition: transform 1.2s cubic-bezier(0.23, 1, 0.32, 1);
                }

                .luxury-card:hover .product-hero {
                    transform: scale(1.1);
                }

                .quick-remove-btn {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 10;
                    transition: all 0.3s;
                    opacity: 0.8;
                }

                .quick-remove-btn:hover {
                    background: #ff4d4d;
                    border-color: #ff4d4d;
                    transform: scale(1.1) rotate(90deg);
                }

                .brand-overlay {
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    z-index: 5;
                }

                .brand-tag {
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    color: #fff;
                    background: rgba(0,0,0,0.4);
                    padding: 6px 14px;
                    border-radius: 4px;
                    backdrop-filter: blur(5px);
                }

                .details-stage {
                    padding: 24px;
                }

                .item-category {
                    font-size: 9px;
                    letter-spacing: 2px;
                    color: #D4AF37;
                    font-weight: 700;
                    display: block;
                    margin-bottom: 6px;
                    opacity: 0.8;
                }

                 .item-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    line-height: 1.3;
                    margin-bottom: 20px;
                    color: var(--text-primary);
                    height: 2.8rem;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }

                .action-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 15px;
                    border-top: 1px solid var(--border-soft);
                }

                 .item-price {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                 .add-ritual-btn {
                    background: var(--gold-gradient);
                    color: #fff;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 100px;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 10px;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    box-shadow: 0 4px 15px rgba(209, 176, 123, 0.2);
                }

                 .add-ritual-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(209, 176, 123, 0.3);
                }

                /* Empty State V2 */
                .empty-state-v2 {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 0;
                    text-align: center;
                }

                .artwork-wrapper {
                    position: relative;
                    margin-bottom: 50px;
                }

                .artwork-wrapper img {
                    max-width: 220px;
                    position: relative;
                    z-index: 2;
                }

                .blob-gradient {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
                    z-index: 1;
                    filter: blur(40px);
                }

                .empty-heading {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                }

                 .empty-sub {
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                    max-width: 400px;
                    margin-bottom: 40px;
                    font-weight: 300;
                }

                 .luxury-cta {
                    background: var(--gold-gradient);
                    color: #fff;
                    padding: 18px 40px;
                    border-radius: 100px;
                    text-decoration: none;
                    text-transform: uppercase;
                    font-weight: 800;
                    letter-spacing: 2px;
                    font-size: 12px;
                    transition: all 0.4s;
                    box-shadow: 0 4px 15px rgba(209, 176, 123, 0.2);
                }

                .luxury-cta:hover {
                    background: #D4AF37;
                    box-shadow: 0 0 40px rgba(212, 175, 55, 0.3);
                    transform: scale(1.05);
                }

                /* Animations */
                .animate-reveal {
                    animation: reveal 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                }

                @keyframes reveal {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 1024px) {
                    .luxury-grid { grid-template-columns: repeat(2, 1fr); }
                    .main-title { letter-spacing: -2px; }
                }

                @media (max-width: 768px) {
                    .luxury-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 15px; }
                    .wishlist-v2-container { padding: 30px 15px 60px; }
                    .editorial-header { margin-bottom: 40px; }
                    .main-title { font-size: 4rem; }
                    .image-stage { height: 240px; }
                    .details-stage { padding: 15px; }
                    .item-title { font-size: 0.9rem; height: 2.4rem; }
                    .item-price { font-size: 1.1rem; }
                    .add-ritual-btn { padding: 8px 12px; font-size: 9px; }
                    .brand-tag { font-size: 7px; padding: 4px 8px; }
                }
            `}</style>
        </div>
    );
};

export default Wishlist;
