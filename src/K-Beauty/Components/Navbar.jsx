import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiSearch, FiUser, FiHeart, FiShoppingBag, FiChevronRight, FiChevronDown, FiStar, FiClock, FiShield } from 'react-icons/fi';
import { FaChevronDown, FaRegHeart } from 'react-icons/fa';
import { BsSearch, BsBasket } from 'react-icons/bs';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import API_BASE_URL from "../config";
import axios from 'axios';
import MainCart from '../MainCart';
import SearchDrawer from '../SearchDrawer';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Collapse from 'bootstrap/js/dist/collapse';
import '../Header.css';
import logo from '../assets/Mainlogo.png';

const MegaMenu = ({ category, data, onClose, onMouseEnter, onMouseLeave }) => {
    if (!data) return null;
    return (
        <div
            className="mega-menu-container"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="container px-4">
                <div className="row g-4 text-start justify-content-between">
                    {/* Columns Wrapper */}
                    <div className="col-lg-8 d-flex flex-wrap gap-4">
                        {data.columns.map((col, idx) => (
                            <div className="menu-column flex-fill" key={idx} style={{ minWidth: "150px" }}>
                                <h6 className="column-title fw-bold text-uppercase mb-3" style={{ fontSize: "12px", letterSpacing: "1px", color: "var(--gold)" }}>{col.title}</h6>
                                <ul className="list-unstyled">
                                    {col.links.map((link, lIdx) => {
                                        // Generate semantic query parameters based on column title
                                        let param = "type";
                                        const title = col.title.toLowerCase();
                                        if (title.includes("type")) param = "skinType";
                                        else if (title.includes("concern")) param = "skinConcern";

                                        return (
                                            <li key={lIdx} className="mb-2">
                                                <NavLink
                                                    to={`/shop?category=${category}&${param}=${encodeURIComponent(link)}`}
                                                    onClick={onClose}
                                                    className="mega-menu-link text-decoration-none text-secondary"
                                                    style={{ fontSize: "14px", transition: "all 0.2s", color: "var(--text-secondary)" }}
                                                >
                                                    {link}
                                                </NavLink>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                    {/* Promo Section */}
                    <div className="col-lg-3 menu-promo">
                        <div className="promo-card bg-dark overflow-hidden position-relative group" style={{ borderRadius: "10px", height: "100%", border: "1px solid var(--border-gold)" }}>
                            <img src={data.promo.image} alt={data.promo.title} className="img-fluid w-100 h-100 object-fit-cover promo-img" style={{ minHeight: "220px", transition: "transform 0.5s", opacity: "0.8" }} />
                            <div className="position-absolute bottom-0 start-0 w-100 p-4 bg-gradient-dark text-white text-center promo-overlay">
                                <h6 className="promo-title mb-1 fw-bold text-white text-uppercase" style={{ letterSpacing: "1px", fontSize: "13px" }}>{data.promo.title}</h6>
                                <p className="small mb-3 text-white-50" style={{ fontSize: "11px", lineHeight: "1.2" }}>{data.promo.subtitle}</p>
                                <NavLink to={`/shop?category=${category}`} onClick={onClose} className="btn btn-outline-gold btn-sm rounded-pill px-4" style={{ fontSize: "10px", fontWeight: "600", letterSpacing: "1px" }}>
                                    SHOP NOW
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Navbar = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState(null);
    const [megaMenuConfig, setMegaMenuConfig] = useState({});
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [cartAnimate, setCartAnimate] = useState(false);
    const hoverTimeoutRef = useRef(null);

    const { wishlist } = useWishlist();
    const { cartItems } = useCart();

    const isMobile = windowWidth < 992;

    // Cart Badge Animation Trigger
    useEffect(() => {
        if (cartItems.length > 0) {
            setCartAnimate(true);
            const timer = setTimeout(() => setCartAnimate(false), 300);
            return () => clearTimeout(timer);
        }
    }, [cartItems.length]);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        const handleScroll = () => setIsSticky(window.scrollY > 50);

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
        fetchMegaMenu();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const fetchMegaMenu = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/megamenu`);
            setMegaMenuConfig(res.data);
        } catch (err) {
            console.error("Error fetching Mega Menu data:", err);
        }
    };

    const closeNavbar = () => {
        const navbar = document.getElementById("navbarNavDropdown");
        if (navbar?.classList.contains("show")) {
            const collapse = new Collapse(navbar);
            collapse.hide();
        }
        setActiveMegaMenu(null);
    };

    const handleMenuInteraction = (menu, type) => {
        if (isMobile) {
            if (type === 'click') {
                setActiveMegaMenu(activeMegaMenu === menu ? null : menu);
            }
        } else {
            if (type === 'enter') {
                if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current);
                    hoverTimeoutRef.current = null;
                }
                setActiveMegaMenu(menu);
            }
            if (type === 'leave') {
                // Add a small delay (500ms) before closing to allow user to reach the menu
                hoverTimeoutRef.current = setTimeout(() => {
                    setActiveMegaMenu(null);
                    hoverTimeoutRef.current = null;
                }, 500);
            }
        }
    };

    const navItems = [
        { name: "New Arrivals", path: "/" },
        { name: "Shop All", path: "/shop" },
        { name: "Skincare", path: "/SkinCare", hasMega: true },
        { name: "Makeup", path: "/Makeup", hasMega: true },
        { name: "Haircare", path: "/HairCare" },
        { name: "Lipcare", path: "/LipCare" },
        { name: "Best Sellers", path: "/BestSellers", isHot: true }
    ];

    return (
        <>
            <div className="announcement-bar bg-black py-2 border-bottom border-secondary">
                <div className="announcement-track">
                    <div className="scroll-text fw-medium text-gold-light" style={{ letterSpacing: '0.5px' }}>
                        <span>Discover your radiant skin with genuine K-Beauty shop now & enjoy doorstep delivery of your favorite Korean skincare. &nbsp;|&nbsp;  &nbsp;|&nbsp; Free Shipping on All Orders &nbsp;|&nbsp; No Coupon Needed &nbsp;|&nbsp; Shop Now & Save Big</span>
                        <span>Discover your radiant skin with genuine K-Beauty shop now & enjoy doorstep delivery of your favorite Korean skincare. &nbsp;|&nbsp;  &nbsp;|&nbsp; Free Shipping on All Orders &nbsp;|&nbsp; No Coupon Needed &nbsp;|&nbsp; Shop Now & Save Big</span>
                    </div>
                </div>
            </div>
            <header className={`navbar-main-wrapper ${isSticky ? 'sticky-active' : ''}`}>
                <nav className="navbar navbar-expand-lg navbar-dark bg-black">
                    <div className="container d-flex flex-wrap flex-lg-nowrap align-items-center justify-content-between position-relative">

                        {/* Mobile: Hamburger + Search (Left) - Tightened */}
                        <div className="order-1 d-flex align-items-center d-lg-none gap-1" style={{ zIndex: 10, flex: 1, paddingLeft: '0' }}>
                            <button className="navbar-toggler border-0 p-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-label="Toggle navigation" style={{ minWidth: 'unset', width: 'auto' }}>
                                <FiMenu size={22} color="var(--gold, #D4AF37)" />
                            </button>
                            <div className="nav-icon-item p-0" onClick={() => setIsSearchOpen(true)} style={{ cursor: 'pointer', paddingLeft: '5px' }}>
                                <BsSearch size={18} />
                            </div>
                        </div>

                        {/* Brand (Centered on Mobile) */}
                        <NavLink className="navbar-brand order-2 order-lg-1 mx-auto d-flex justify-content-center" to="/" onClick={closeNavbar} style={{ zIndex: 5, flex: 1.5, padding: 0 }}>
                            <img src={logo} alt="KBeautyMart Logo" className="navbar-logo" />
                        </NavLink>

                        {/* Navigation Links (Center on PC, Collapsed on Mobile) */}
                        <div className="collapse navbar-collapse order-4 order-lg-2 flex-grow-1" id="navbarNavDropdown">
                            <ul className="navbar-nav mx-auto">
                                {navItems.map((item) => (
                                    <li
                                        key={item.name}
                                        className={`nav-item ${item.hasMega ? 'has-mega-menu' : ''} ${activeMegaMenu === item.name ? 'active-mobile-drop' : ''}`}
                                        onMouseEnter={() => handleMenuInteraction(item.name, 'enter')}
                                        onMouseLeave={() => handleMenuInteraction(item.name, 'leave')}
                                    >
                                        <div className="nav-link-wrapper d-flex align-items-center">
                                            <NavLink
                                                className={`nav-link ${item.isHot ? 'nav-hot' : ''}`}
                                                to={item.path}
                                                onClick={closeNavbar}
                                            >
                                                {item.name}
                                                {item.isHot && <span className="hot-badge">HOT!</span>}
                                            </NavLink>
                                            {item.hasMega && (
                                                <FaChevronDown
                                                    className={`ms-1 small toggle-icon ${activeMegaMenu === item.name ? 'rotate' : ''}`}
                                                    onClick={(e) => {
                                                        if (isMobile) {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleMenuInteraction(item.name, 'click');
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {item.hasMega && activeMegaMenu === item.name && (
                                            <MegaMenu
                                                category={item.name}
                                                data={megaMenuConfig[item.name]}
                                                onClose={closeNavbar}
                                                onMouseEnter={() => handleMenuInteraction(item.name, 'enter')}
                                                onMouseLeave={() => handleMenuInteraction(item.name, 'leave')}
                                            />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Desktop & Mobile Icons (Right) */}
                        <div className="navbar-icons order-3 order-lg-3 d-flex align-items-center justify-content-end gap-1 gap-sm-3" style={{ zIndex: 10, flex: 1 }}>
                            {/* Desktop Search */}
                            <div className="nav-icon-item d-none d-lg-flex" onClick={() => setIsSearchOpen(true)}>
                                <BsSearch size={22} />
                            </div>

                            {/* Wishlist - Hidden on Mobile to follow reference image */}
                            <NavLink className="nav-icon-item position-relative d-none d-lg-flex" to="/Wishlist">
                                <FaRegHeart size={22} />
                                {wishlist?.length > 0 && <span className="badge-dot">{wishlist.length}</span>}
                            </NavLink>

                            {/* User Icon (Account) - Visible on both */}
                            <NavLink className="nav-icon-item" to="/Login">
                                <i className="bi bi-person" style={{ fontSize: isMobile ? '20px' : '24px' }}></i>
                            </NavLink>

                            <div className={`nav-icon-item position-relative ${cartAnimate ? 'badge-pop' : ''}`} onClick={() => setIsCartOpen(true)}>
                                <BsBasket size={isMobile ? '18' : '22'} />
                                {cartItems?.length > 0 && <span className="badge-dot dark">{cartItems.length}</span>}
                            </div>
                        </div>

                        {/* Persistent Mobile Search Bar Removed as per user request */}
                    </div>
                </nav>
            </header>

            <MainCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            {isSearchOpen && <div className="search-backdrop" onClick={() => setIsSearchOpen(false)} />}
            <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Mobile Bottom Navigation Bar */}
            <div className="mobile-bottom-nav d-lg-none">
                <NavLink to="/" className="bottom-nav-item" onClick={closeNavbar}>
                    <div className="nav-icon-box pink">
                        <i className="bi bi-house-door"></i>
                    </div>
                    <span>Stores</span>
                </NavLink>
                <div className="bottom-nav-item" onClick={() => {
                    const navbar = document.getElementById("navbarNavDropdown");
                    if (navbar) {
                        const collapse = new Collapse(navbar);
                        collapse.toggle();
                    }
                }}>
                    <div className="nav-icon-box">
                        <i className="bi bi-grid"></i>
                    </div>
                    <span>Categories</span>
                </div>
                <NavLink to="/shop?offers=true" className="bottom-nav-item" onClick={closeNavbar}>
                    <div className="nav-icon-box">
                        <i className="bi bi-percent"></i>
                    </div>
                    <span>Offers</span>
                </NavLink>
                <NavLink to="/Login" className="bottom-nav-item" onClick={closeNavbar}>
                    <div className="nav-icon-box">
                        <i className="bi bi-person"></i>
                    </div>
                    <span>Account</span>
                </NavLink>
            </div>
        </>
    );
};

export default Navbar;

