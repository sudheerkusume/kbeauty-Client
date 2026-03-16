import React, { useEffect, useState, useRef, useCallback } from "react";
import API_BASE_URL from "../config";
import axios from "axios";
import {
    FiCalendar, FiBox,
    FiCheckCircle, FiChevronLeft, FiChevronRight,
    FiActivity, FiZap, FiMessageSquare,
    FiLayers, FiPlusSquare, FiMenu
} from "react-icons/fi";

/* ─────────── CUSTOM SVG CHART COMPONENTS (NO DEPENDENCIES) ─────────── */
const SafeBarChart = ({ data }) => {
    const maxVal = Math.max(...data.map(d => Math.max(d.Sales, d.Enquiries)));
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', padding: '0 10px' }}>
            {data.map((d, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '4px' }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end' }}>
                        <div style={{
                            width: '8px', height: `${(d.Sales / maxVal) * 200}px`,
                            background: '#D4AF37', borderRadius: '4px',
                            transition: 'height 1s ease-out'
                        }} title={`Sales: ${d.Sales}`} />
                        <div style={{
                            width: '8px', height: `${(d.Enquiries / maxVal) * 200}px`,
                            background: '#444', borderRadius: '4px',
                            transition: 'height 1s ease-out'
                        }} title={`Enquiries: ${d.Enquiries}`} />
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '12px', fontWeight: 600 }}>{d.name}</span>
                </div>
            ))}
        </div>
    );
};

const SafePieChart = ({ data, colors }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = 0;
    return (
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            {data.map((d, i) => {
                const angle = (d.value / total) * 360;
                const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
                const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
                const x2 = 50 + 40 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
                const y2 = 50 + 40 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
                const largeArcFlag = angle > 180 ? 1 : 0;
                const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                currentAngle += angle;
                return <path key={i} d={pathData} fill={colors[i % colors.length]} stroke="#111" strokeWidth="2" />;
            })}
            <circle cx="50" cy="50" r="28" fill="#111" />
        </svg>
    );
};

/* ─────────── LUXURY DARK THEME TOKENS ─────────── */
const COLORS = {
    Products: {
        primary: '#D4AF37', light: 'rgba(212, 175, 55, 0.1)', dark: '#aa8c2c',
        bg: '#111',
        iconBg: 'rgba(212, 175, 55, 0.1)', iconColor: '#D4AF37',
        shadow: '0 10px 30px rgba(0,0,0,0.4)',
        glow: 'rgba(212, 175, 55, 0.15)'
    },
    Stock: {
        primary: '#ef4444', light: 'rgba(239, 68, 68, 0.1)', dark: '#991b1b',
        bg: '#111',
        iconBg: 'rgba(239, 68, 68, 0.1)', iconColor: '#ef4444',
        shadow: '0 10px 30px rgba(0,0,0,0.4)',
        glow: 'rgba(239, 68, 68, 0.1)'
    },
    Enquiries: {
        primary: '#6366f1', light: 'rgba(99, 102, 241, 0.1)', dark: '#3730a3',
        bg: '#111',
        iconBg: 'rgba(99, 102, 241, 0.1)', iconColor: '#6366f1',
        shadow: '0 10px 30px rgba(0,0,0,0.4)',
        glow: 'rgba(99, 102, 241, 0.1)'
    },
    Bestsellers: {
        primary: '#10b981', light: 'rgba(16, 185, 129, 0.1)', dark: '#065f46',
        bg: '#111',
        iconBg: 'rgba(16, 185, 129, 0.1)', iconColor: '#10b981',
        shadow: '0 10px 30px rgba(0,0,0,0.4)',
        glow: 'rgba(16, 185, 129, 0.1)'
    },
    Blogs: {
        primary: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)', dark: '#b45309',
        bg: '#111',
        iconBg: 'rgba(245, 158, 11, 0.1)', iconColor: '#f59e0b',
        shadow: '0 10px 30px rgba(0,0,0,0.4)',
        glow: 'rgba(245, 158, 11, 0.1)'
    },
    Brands: {
        primary: '#8b5cf6', light: 'rgba(139, 92, 246, 0.1)', dark: '#6d28d9',
        bg: '#111',
        iconBg: 'rgba(139, 92, 246, 0.1)', iconColor: '#8b5cf6',
        shadow: '0 10px 30px rgba(0,0,0,0.4)',
        glow: 'rgba(139, 92, 246, 0.1)'
    },
    Categories: {
        primary: '#06b6d4', light: 'rgba(6, 182, 212, 0.1)', dark: '#0891b2',
        bg: '#111',
        iconBg: 'rgba(6, 182, 212, 0.1)', iconColor: '#06b6d4',
        shadow: '0 10px 30px rgba(0,0,0,0.4)',
        glow: 'rgba(6, 182, 212, 0.1)'
    },
    Types: {
        primary: '#ec4899', light: 'rgba(236, 72, 153, 0.1)', dark: '#be185d',
        bg: '#111',
        iconBg: 'rgba(236, 72, 153, 0.1)', iconColor: '#ec4899',
        shadow: '0 10px 30px rgba(0,0,0,0.4)',
        glow: 'rgba(236, 72, 153, 0.1)'
    },
    FAQ: {
        primary: '#10b981', light: 'rgba(16, 185, 129, 0.1)', dark: '#065f46',
        bg: '#111',
        iconBg: 'rgba(16, 185, 129, 0.1)', iconColor: '#10b981',
        shadow: '0 10px 30px rgba(0,0,0,0.4)',
        glow: 'rgba(16, 185, 129, 0.1)'
    }
};

const CHART_COLORS = ['#D4AF37', '#6366f1', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

/* ─────────── DYNAMIC CALENDAR ─────────── */
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const DynamicCalendar = ({ isOpen, onRangeSelect, selectedRange }) => {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [rangeStart, setRangeStart] = useState(selectedRange?.start || null);
    const [rangeEnd, setRangeEnd] = useState(selectedRange?.end || null);
    const [hoverDate, setHoverDate] = useState(null);

    if (!isOpen) return null;

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const isToday = (day) => viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
    const dateObj = (day) => new Date(viewYear, viewMonth, day);

    const handleDayClick = (day) => {
        const clicked = dateObj(day);
        if (!rangeStart || (rangeStart && rangeEnd)) {
            setRangeStart(clicked); setRangeEnd(null);
        } else {
            if (clicked < rangeStart) {
                setRangeEnd(rangeStart); setRangeStart(clicked);
                onRangeSelect?.({ start: clicked, end: rangeStart });
            } else {
                setRangeEnd(clicked);
                onRangeSelect?.({ start: rangeStart, end: clicked });
            }
        }
    };

    const inRange = (day) => {
        const d = dateObj(day);
        const effectiveEnd = rangeEnd || hoverDate;
        if (!rangeStart || !effectiveEnd) return false;
        const lo = rangeStart < effectiveEnd ? rangeStart : effectiveEnd;
        const hi = rangeStart < effectiveEnd ? effectiveEnd : rangeStart;
        return d >= lo && d <= hi;
    };
    const isRangeEdge = (day) => {
        const d = dateObj(day).getTime();
        return (rangeStart && d === rangeStart.getTime()) || (rangeEnd && d === rangeEnd.getTime());
    };

    const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const quickSelect = (label) => {
        const now = new Date();
        let s, e;
        if (label === 'Today') { s = now; e = now; }
        else if (label === 'This Week') {
            s = new Date(now); s.setDate(now.getDate() - now.getDay());
            e = new Date(s); e.setDate(s.getDate() + 6);
        } else {
            s = new Date(now.getFullYear(), now.getMonth(), 1);
            e = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }
        setRangeStart(s); setRangeEnd(e);
        setViewMonth(now.getMonth()); setViewYear(now.getFullYear());
        onRangeSelect?.({ start: s, end: e });
    };

    return (
        <div className="position-absolute animate-fade-in user-select-none"
            style={{
                top: '100%', right: 0, zIndex: 1050,
                width: '310px', marginTop: '10px', padding: '20px',
                background: '#1a1a1a', borderRadius: '20px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                border: '1px solid #222'
            }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button onClick={prevMonth} className="wcal-nav-btn"><FiChevronLeft size={15} /></button>
                <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>
                    {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
                <button onClick={nextMonth} className="wcal-nav-btn"><FiChevronRight size={15} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', marginBottom: '4px' }}>
                {DAY_LABELS.map(d => (
                    <span key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{d}</span>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px' }}>
                {blanks.map(b => <div key={`b-${b}`} />)}
                {days.map(day => {
                    const todayFlag = isToday(day), edge = isRangeEdge(day), range = inRange(day);
                    return (
                        <div key={day}
                            onClick={() => handleDayClick(day)}
                            onMouseEnter={() => { if (rangeStart && !rangeEnd) setHoverDate(dateObj(day)); }}
                            onMouseLeave={() => setHoverDate(null)}
                            className="wcal-day"
                            style={{
                                width: '36px', height: '36px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '10px',
                                fontSize: '13px', fontWeight: todayFlag || edge ? 700 : 500,
                                cursor: 'pointer', transition: 'all 0.15s ease',
                                color: edge ? '#000' : todayFlag ? '#D4AF37' : range ? '#fff' : '#94a3b8',
                                background: edge ? '#D4AF37' : range ? 'rgba(212, 175, 55, 0.2)' : todayFlag ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                                border: todayFlag && !edge ? '2px solid #D4AF37' : '2px solid transparent'
                            }}>
                            {day}
                        </div>
                    );
                })}
            </div>

            <div className="d-flex gap-2 mt-3">
                {['Today', 'Week', 'Month'].map(label => (
                    <button key={label} onClick={() => quickSelect(label)} className="wcal-quick-btn">{label}</button>
                ))}
            </div>
        </div>
    );
};

/* ─────────── ANIMATED COUNTER ─────────── */
const AnimCounter = ({ target }) => {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (target === 0) { setVal(0); return; }
        let cur = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const iv = setInterval(() => {
            cur += step;
            if (cur >= target) { setVal(target); clearInterval(iv); }
            else setVal(cur);
        }, 30);
        return () => clearInterval(iv);
    }, [target]);
    return <>{val}</>;
};

/* ═══════════════ MAIN WELCOME COMPONENT ═══════════════ */
const Welcome = ({ setView }) => {
    const [products, setProducts] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Products');
    const [showCalendar, setShowCalendar] = useState(false);
    const [dateRange, setDateRange] = useState(null);
    const calendarRef = useRef(null);


    // Outside click to close calendar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch data
    useEffect(() => {
        const endpoints = [
            { url: `${API_BASE_URL}/products`, setter: setProducts },
            { url: `${API_BASE_URL}/enquiries`, setter: setEnquiries },
            { url: `${API_BASE_URL}/blogPosts`, setter: setBlogs },
            { url: `${API_BASE_URL}/brands`, setter: setBrands },
            { url: `${API_BASE_URL}/categories`, setter: setCategories },
            { url: `${API_BASE_URL}/types`, setter: setTypes },
            { url: `${API_BASE_URL}/faq`, setter: setFaqs }
        ];

        const fetchData = async () => {
            await Promise.all(endpoints.map(async ({ url, setter }) => {
                try {
                    const res = await axios.get(url);
                    setter(res.data || []);
                } catch (err) {
                    console.error(`Error fetching from ${url}:`, err.message);
                }
            }));
            setLoading(false);
        };
        fetchData();
    }, []);

    const getDateRangeLabel = useCallback(() => {
        if (!dateRange) {
            const now = new Date();
            const weekAgo = new Date(); weekAgo.setDate(now.getDate() - 6);
            return `${weekAgo.getDate()} – ${now.getDate()} ${now.toLocaleDateString('en-US', { month: 'long' })}`;
        }
        const { start, end } = dateRange;
        return `${start.getDate()} ${start.toLocaleDateString('en-US', { month: 'short' })} – ${end.getDate()} ${end.toLocaleDateString('en-US', { month: 'short' })}`;
    }, [dateRange]);

    const stats = {
        total: products.length,
        lowStock: products.filter(p => (p.stockQuantity || 0) < 5).length,
        enquiries: enquiries.length,
        bestsellers: products.filter(p => p.bestseller).length,
        blogs: blogs.length,
        brands: brands.length,
        categories: categories.length,
        types: types.length,
        faqs: faqs.length
    };

    const getChartData = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => ({
            name: day,
            Sales: Math.floor(Math.random() * 50) + 10,
            Enquiries: Math.floor(Math.random() * 20) + 5
        }));
    };

    const getCategoryData = () => {
        const counts = {};
        products.forEach(p => {
            counts[p.category] = (counts[p.category] || 0) + 1;
        });
        return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
    };


    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
                <div className="luxury-spinner"></div>
            </div>
        );
    }

    const cards = [
        { label: "Products", value: stats.total, icon: <FiBox size={22} />, trend: "Catalog", action: () => setView && setView("viewproduct") },
        { label: "Blogs", value: stats.blogs, icon: <FiLayers size={22} />, trend: "Content", action: () => setView && setView("viewblog") },
        { label: "Enquiries", value: stats.enquiries, icon: <FiMessageSquare size={22} />, trend: "Inbox", action: () => setView && setView("viewenquiries") },
        { label: "Architecture", value: "MAP", icon: <FiMenu size={22} />, trend: "System", action: () => setView && setView("viewmegamenu") },
        { label: "Brands", value: stats.brands, icon: <FiActivity size={22} />, trend: "Partners", action: () => setView && setView("viewbrands") },
        { label: "Categories", value: stats.categories, icon: <FiPlusSquare size={22} />, trend: "Tree", action: () => setView && setView("viewtaxonomies") },
        { label: "Types", value: stats.types, icon: <FiZap size={22} />, trend: "Variants", action: () => setView && setView("viewtaxonomies") },
        { label: "FAQ", value: stats.faqs, icon: <FiCheckCircle size={22} />, trend: "Support", action: () => setView && setView("viewtaxonomies") },
    ];

    const chartData = getChartData();
    const categoryData = getCategoryData();

    return (
        <div className="wdash-root" style={{ backgroundColor: '#000', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

            {/* ── STAT CARDS ── */}
            <div className="row g-4 mb-5">
                {cards.map((card, idx) => {
                    const isActive = activeTab === card.label;
                    const cardTheme = COLORS[card.label] || COLORS.Products;
                    return (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-2" key={idx}>
                            <div className="wdash-stat-card h-100 rounded-4 p-3"
                                onClick={() => card.action ? card.action() : setActiveTab(card.label)}
                                style={{
                                    background: '#111',
                                    borderRadius: '20px', cursor: 'pointer',
                                    boxShadow: isActive ? '0 20px 40px rgba(0,0,0,0.4)' : 'none',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    border: isActive ? `2px solid ${cardTheme.primary}` : '1px solid #222',
                                    position: 'relative', overflow: 'hidden'
                                }}>
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '10px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: cardTheme.iconBg,
                                        color: cardTheme.iconColor,
                                    }}>
                                        {card.icon}
                                    </div>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '8px',
                                        background: cardTheme.light,
                                        fontSize: '9px', fontWeight: 800, color: cardTheme.primary,
                                        letterSpacing: '0.5px', textTransform: 'uppercase'
                                    }}>
                                        {card.trend}
                                    </span>
                                </div>
                                <div>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>
                                        {card.label}
                                    </span>
                                    <h2 style={{ margin: 0, fontSize: card.label === 'Architecture' ? '1.4rem' : '1.8rem', fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>
                                        {card.label === 'Architecture' ? "MAP" : <AnimCounter target={card.value} />}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── CHARTS SECTION ── */}
            <div className="row g-4 mb-5">
                <div className="col-12 col-xl-8">
                    <div className="wdash-inner-card h-100 p-3 p-md-4">
                        <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-2">
                            <div>
                                <h5 className="fw-bold mb-1" style={{ fontSize: '20px', color: '#fff' }}>Performance Narrative</h5>
                                <p className="mb-0 text-muted" style={{ fontSize: '13px', fontWeight: 500 }}>Daily interaction & commerce baseline</p>
                            </div>
                            <div className="position-relative" ref={calendarRef}>
                                <button onClick={() => setShowCalendar(!showCalendar)} className="wdash-cal-btn border-0" style={{ background: '#222', color: '#fff' }}>
                                    <FiCalendar size={14} className="text-gold" />
                                    <span>{getDateRangeLabel()}</span>
                                </button>
                                <DynamicCalendar
                                    isOpen={showCalendar}
                                    selectedRange={dateRange}
                                    onRangeSelect={(range) => { setDateRange(range); setShowCalendar(false); }}
                                />
                            </div>
                        </div>
                        <div style={{ height: '320px', padding: '20px 0' }}>
                            <SafeBarChart data={chartData} />
                            <div className="d-flex justify-content-center gap-4 mt-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div style={{ width: 10, height: 10, background: '#D4AF37', borderRadius: '50%' }}></div>
                                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Orders</span>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <div style={{ width: 10, height: 10, background: '#444', borderRadius: '50%' }}></div>
                                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Leads</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-4">
                    <div className="wdash-inner-card h-100 p-3 p-md-4">
                        <h6 className="fw-bold mb-4" style={{ fontSize: '18px', color: '#fff' }}>Category Distribution</h6>
                        <div style={{ height: '240px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <SafePieChart data={categoryData} colors={CHART_COLORS} />
                        </div>
                        <div className="mt-5 d-flex flex-column gap-3">
                            {categoryData.slice(0, 4).map((cat, i) => (
                                <div key={i} className="d-flex align-items-center justify-content-between p-2 rounded-3 hover-bg-charcoal transition-all">
                                    <div className="d-flex align-items-center gap-3">
                                        <span className="rounded-circle" style={{ width: 8, height: 8, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}></span>
                                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}>{cat.name}</span>
                                    </div>
                                    <span style={{ fontWeight: 800, fontSize: '14px', color: '#fff' }}>{cat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RECENT ACTIVITY ── */}
            <div className="row g-4">
                <div className="col-12">
                    <div className="wdash-inner-card p-3 p-md-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0" style={{ color: '#fff' }}>Critical Enquiries</h5>
                            <button className="btn btn-sm px-3 py-2 rounded-3" style={{ background: '#D4AF37', color: '#111', fontWeight: 700, fontSize: '12px' }}>
                                VIEW ALL ASSETS
                            </button>
                        </div>
                        <div className="table-responsive">
                            <table className="table align-middle border-0 mb-0 text-white">
                                <thead style={{ background: '#222' }}>
                                    <tr style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        <th className="border-0 px-4 py-3">Stakeholder</th>
                                        <th className="border-0 px-4 py-3">Contact Access</th>
                                        <th className="border-0 px-4 py-3">Submission Preview</th>
                                        <th className="border-0 px-4 py-3 text-end">Timeline</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enquiries.slice(0, 5).map((enq, idx) => (
                                        <tr key={idx} className="hover-row transition-all border-bottom border-dark">
                                            <td className="px-4 py-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, fontWeight: 700, fontSize: '13px', background: '#222', color: '#fff' }}>
                                                        {enq.name?.charAt(0)}
                                                    </div>
                                                    <span style={{ fontWeight: 700, color: '#fff' }}>{enq.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-muted fw-medium" style={{ fontSize: '13px', color: '#94a3b8 !important' }}>{enq.email}</td>
                                            <td className="px-4 py-3 text-muted small fw-medium" style={{ color: '#94a3b8 !important' }}>Luxury Skincare Inquiry...</td>
                                            <td className="px-4 py-3 text-muted text-end fw-bold" style={{ fontSize: '11px', color: '#94a3b8 !important' }}>TODAY</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .wdash-inner-card {
                    background: #111;
                    border-radius: 32px;
                    border: 1px solid #222;
                }
                .wdash-stat-card:hover {
                    transform: translateY(-5px);
                }
                .wdash-cal-btn {
                    display: flex; align-items: center; gap: 10px;
                    padding: 10px 20px; border-radius: 16px;
                    font-size: 13px; fontWeight: 700;
                    transition: all 0.3s;
                }
                .wdash-cal-btn:hover { background: #333 !important; }
                .wcal-nav-btn {
                    width: 32px; height: 32px; border-radius: 12px;
                    border: 1px solid #333; background: #222; color: #fff;
                    display: flex; align-items: center; justify-content: center;
                }
                .wcal-quick-btn {
                    padding: 8px 16px; border-radius: 12px;
                    border: 1px solid #333; background: #222;
                    font-size: 11px; fontWeight: 700; color: #94a3b8;
                }
                .hover-row:hover { background-color: #1a1a1a; }
                .hover-bg-charcoal:hover { background-color: #1a1a1a; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .luxury-spinner {
                    width: 40px; height: 40px; border: 3px solid #222; border-top-color: #D4AF37; border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .text-gold { color: #D4AF37 !important; }
            `}</style>
        </div>
    );
};

export default Welcome;
