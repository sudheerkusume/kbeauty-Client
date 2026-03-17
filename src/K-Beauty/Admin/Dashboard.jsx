import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginStatus } from '../../App';
import {
    FiHome,
    FiPlusSquare,
    FiBox,
    FiMessageSquare,
    FiShoppingBag,
    FiLogOut,
    FiUser,
    FiMenu,
    FiX,
    FiActivity,
    FiCalendar,
    FiLayers,
    FiUsers
} from 'react-icons/fi';
import Welcome from './Welcome';
import ViewEnquiries from './ViewEnquiries';
import ViewProduct from './ViewProduct';
import ViewOrders from './ViewOrders';
import ViewBlogPosts from './ViewBlogPosts';
import ViewBrands from './ViewBrands';
import ViewTaxonomies from './ViewTaxonomies';
import ViewMegaMenu from './ViewMegaMenu';
import ViewUsers from './ViewUsers';

const Dashboard = () => {
    const [view, setView] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();
    const { setToken, setLogin, setUser } = useContext(loginStatus);

    // Live clock
    useEffect(() => {
        const t = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(t);
    }, []);

    const greeting = () => {
        const h = currentTime.getHours();
        return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            // Clear Context
            setToken("");
            setLogin(false);
            setUser(null);

            // Clear Storage
            localStorage.removeItem("usertoken");
            localStorage.removeItem("userrole");

            // Redirect to Login/Landing
            navigate("/checkin");
        }
    };

    const dashboardView = () => {
        switch (view) {
            case "viewproduct": return <ViewProduct />;
            case "viewenquiries": return <ViewEnquiries />;
            case "vieworders": return <ViewOrders />;
            case "viewblog": return <ViewBlogPosts />;
            case "viewbrands": return <ViewBrands />;
            case "viewtaxonomies": return <ViewTaxonomies />;
            case "viewmegamenu": return <ViewMegaMenu />;
            case "viewusers": return <ViewUsers />;
            default: return <Welcome setView={setView} />;
        }
    };

    const menuItems = [
        { id: "", label: "Overview", icon: <FiHome /> },
        { id: "viewproduct", label: "Products", icon: <FiBox /> },
        { id: "vieworders", label: "Orders", icon: <FiShoppingBag /> },
        { id: "viewblog", label: "Blogs", icon: <FiLayers /> },
        { id: "viewbrands", label: "Brands", icon: <FiActivity /> },
        { id: "viewtaxonomies", label: "Taxonomy", icon: <FiPlusSquare /> },
        { id: "viewenquiries", label: "Enquiries", icon: <FiMessageSquare /> },
        { id: "viewusers", label: "Users", icon: <FiUsers /> },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebarOnMobile = (id) => {
        setView(id);
        if (window.innerWidth < 992) setIsSidebarOpen(false);
    };

    return (
        <div className='container-fluid p-0 overflow-hidden' style={{ minHeight: '100vh', backgroundColor: '#000' }}>
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay d-lg-none"
                    onClick={toggleSidebar}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1040,
                        transition: 'opacity 0.3s'
                    }}
                />
            )}

            <div className='row g-0'>
                {/* Sidebar */}
                <aside className={`col-lg-2 admin-sidebar d-flex flex-column p-4 text-white ${isSidebarOpen ? 'show-sidebar' : ''}`} style={{
                    backgroundColor: '#1a1a1a',
                    minHeight: '100vh',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 1050,
                    transition: 'all 0.3s ease'
                }}>
                    <div className="brand-header mb-5 px-3 d-flex justify-content-between align-items-center">
                        <h5 className="m-0 fw-bold" style={{ letterSpacing: '1px', color: '#D4AF37' }}>
                            K-BEAUTY <span style={{ color: '#fff' }}>ADMIN</span>
                        </h5>
                        <button className="btn text-white d-lg-none p-0" onClick={toggleSidebar}>
                            <FiX size={24} />
                        </button>
                    </div>

                    <div className="nav flex-column gap-2 mb-auto">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => closeSidebarOnMobile(item.id)}
                                className={`btn border-0 text-start d-flex align-items-center gap-3 px-3 py-3 rounded-3 transition-all ${view === item.id ? 'active-admin-nav' : 'text-secondary'
                                    }`}
                                style={{
                                    backgroundColor: view === item.id ? '#D4AF37' : 'transparent',
                                    color: view === item.id ? '#000' : 'inherit',
                                    fontWeight: view === item.id ? 700 : 500
                                }}
                            >
                                <span className="fs-6">{item.icon}</span>
                                <span style={{ fontSize: '0.85rem' }}>{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Sidebar footer removed as logout moved to header */}
                </aside>

                {/* Main Content Area */}
                <div className='col-lg-10 offset-lg-2'>
                    {/* Premium Top Bar (Greeting integrated) */}
                    <header className="px-4 py-3 sticky-top" style={{
                        zIndex: 1030,
                        background: '#000',
                        borderBottom: '1px solid #1a1a1a'
                    }}>
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div className="d-flex align-items-center gap-4">
                                <button className="btn p-0 d-lg-none text-white" onClick={toggleSidebar}>
                                    <FiMenu size={24} />
                                </button>
                                <div>
                                    <h5 className="fw-bold m-0 text-white" style={{ letterSpacing: '-0.5px' }}>
                                        {greeting()}, Admin <span style={{ fontSize: '1rem' }}>✨</span>
                                    </h5>
                                    <p className="mb-0 d-flex align-items-center gap-2" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
                                        <FiActivity size={12} className="text-luxury-gold" />
                                        Your K-Beauty ecosystem is flourishing.
                                    </p>
                                </div>
                            </div>

                            <div className="d-flex align-items-center gap-3">
                                <div className="d-none d-md-flex align-items-center gap-3 px-3 py-2 rounded-3 bg-dark border border-secondary">
                                    <FiCalendar size={14} className="text-luxury-gold" />
                                    <span className="fw-bold text-white" style={{ fontSize: '12px' }}>
                                        {currentTime.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                    </span>
                                    <span className="fw-bold" style={{ fontSize: '12px', color: '#D4AF37' }}>
                                        {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                <div className="admin-profile d-flex align-items-center gap-3 ps-3 border-start border-light-subtle">
                                    <button
                                        className="btn btn-link text-secondary text-decoration-none d-flex align-items-center p-0"
                                        onClick={handleLogout}
                                        title="Sign Out"
                                    >
                                        <FiLogOut size={20} className="text-secondary hover-gold" />
                                    </button>
                                    <div className="text-end d-none d-sm-block">
                                        <p className="m-0 fw-bold text-white" style={{ fontSize: '0.8rem' }}>Admin</p>
                                        <p className="m-0 text-secondary small fw-bold" style={{ fontSize: '0.7rem' }}>Master Access</p>
                                    </div>
                                    <div className="profile-img p-2 rounded-circle bg-dark border border-secondary text-luxury-gold">
                                        <FiUser size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>


                    {/* View Container */}
                    <main className="p-2 p-md-4 p-lg-5">
                        <div className="bg-black p-3 p-md-4 p-lg-5 rounded-4 rounded-md-5 border border-secondary" style={{ minHeight: '80vh' }}>
                            {dashboardView()}
                        </div>
                    </main>
                </div>
            </div>

            <style>
                {`
                    .transition-all { transition: all 0.3s ease; }
                    .active-admin-nav:hover { background-color: #D4AF37 !important; color: #000 !important; }
                    .text-luxury-gold { color: #D4AF37 !important; }

                    .hover-gold:hover { color: #D4AF37 !important; }
                    .admin-sidebar {
                        width: 220px !important;
                        transition: transform 0.3s ease;
                    }

                    @media (max-width: 991.98px) {
                        .admin-sidebar {
                            width: 280px !important;
                            position: fixed;
                            top: 0;
                            left: 0;
                            height: 100vh;
                            transform: translateX(-100%);
                            z-index: 1060;
                        }
                        .admin-sidebar.show-sidebar {
                            transform: translateX(0);
                        }
                        .offset-lg-2 {
                            margin-left: 0 !important;
                            width: 100% !important;
                        }
                    }

                    @media (min-width: 992px) {
                        .offset-lg-2 {
                            margin-left: 220px !important;
                            width: calc(100% - 220px) !important;
                        }
                    }

                    aside button:hover:not(.active-admin-nav) {
                        background-color: rgba(255, 255, 255, 0.05) !important;
                        color: #fff !important;
                    }
                    
                    .admin-sidebar button {
                        padding: 10px 15px !important;
                    }
                `}
            </style>
        </div>
    );
};
export default Dashboard;
