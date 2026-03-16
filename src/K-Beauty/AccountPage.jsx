import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { loginStatus } from '../App';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from './config';
import toast, { Toaster } from 'react-hot-toast';
import {
    FiPackage, FiUser, FiMapPin, FiMail, FiLogOut,
    FiEdit3, FiCheckCircle, FiTruck, FiClock, FiAlertCircle,
    FiChevronRight, FiShoppingBag, FiTrash2
} from 'react-icons/fi';

const AccountPage = () => {
    const [fuser, setFuser] = useState(null);
    const { token, setToken, setLogin } = useContext(loginStatus);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        address: ""
    });

    const handleEditClick = () => {
        setEditForm({
            name: fuser.name || "",
            email: fuser.email || "",
            address: fuser.address || ""
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${API_BASE_URL}/api/auth/update-profile`, editForm, {
                headers: { 'x-token': token }
            });
            if (res.data.success) {
                setFuser(res.data.user);
                toast.success("Profile updated successfully!");
                setIsEditing(false);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update profile");
        }
    };

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/order`, {
                headers: { 'x-token': token }
            });
            setOrders(res.data || []);
            setLoadingOrders(false);
        } catch (err) {
            console.error('Fetch orders error:', err);
            setLoadingOrders(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/Login');
        } else {
            axios.get(`${API_BASE_URL}/api/auth/Account`, {
                headers: { 'x-token': token }
            })
                .then(res => setFuser(res.data))
                .catch(err => {
                    console.error('Fetch user error:', err);
                    if (err.response?.status === 401 || err.response?.status === 400) {
                        setToken('');
                        setLogin(false);
                    }
                });

            fetchOrders();
        }
    }, [token, navigate, setToken, setLogin]);

    const handleLogout = () => {
        setToken('');
        setLogin(false);
        localStorage.removeItem("usertoken");
        navigate('/Login');
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order from your history?")) return;

        try {
            const res = await axios.delete(`${API_BASE_URL}/order/${orderId}`, {
                headers: { 'x-token': token }
            });
            if (res.status === 200) {
                toast.success("Order deleted successfully");
                setOrders(orders.filter(o => o._id !== orderId));
            }
        } catch (err) {
            console.error("Delete order error:", err);
            toast.error("Failed to delete order");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return '#10b981';
            case 'Shipped': return '#f59e0b';
            case 'Processing': return '#3b82f6';
            case 'Confirmed': return '#6366f1';
            case 'Pending': return '#D4AF37';
            case 'Cancelled': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    const OrderTracker = ({ currentStatus }) => {
        const stages = [
            { id: "Confirmed", icon: <FiCheckCircle /> },
            { id: "Processing", icon: <FiClock /> },
            { id: "Shipped", icon: <FiTruck /> },
            { id: "Out for Delivery", icon: <FiTruck /> },
            { id: "Delivered", icon: <FiPackage /> }
        ];

        const currentIndex = stages.findIndex(s => s.id === currentStatus);

        if (currentStatus === "Cancelled") {
            return (
                <div className="d-flex align-items-center gap-2 text-danger mt-3 small fw-bold">
                    <FiAlertCircle /> Order has been cancelled.
                </div>
            );
        }

        return (
            <div className="order-tracker-premium mt-4">
                <div className="tracker-line">
                    <div className="tracker-progress" style={{
                        width: `${currentIndex === -1 ? 0 : (currentIndex / (stages.length - 1)) * 100}%`
                    }}></div>
                </div>
                <div className="tracker-nodes">
                    {stages.map((stage, index) => {
                        const isCompleted = stages.findIndex(s => s.id === currentStatus) >= index;
                        const isCurrent = stage.id === currentStatus;
                        return (
                            <div key={stage.id} className={`tracker-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}>
                                <div className="node-icon">{stage.icon}</div>
                                <span className="node-label">{stage.id}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="account-page-root" style={{
            background: 'radial-gradient(circle at top, #111 0%, #000 100%)',
            minHeight: '100vh',
            color: '#fff',
            fontFamily: "'Inter', sans-serif",
            paddingTop: '100px'
        }}>
            <Toaster position="top-right" />

            {/* ── LUXURY HEADER ── */}
            <div className="account-header py-5 mb-5" style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
                backdropFilter: 'blur(10px)'
            }}>
                <div className="container">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                        <div>
                            <nav aria-label="breadcrumb" className="mb-2">
                                <ol className="breadcrumb small m-0">
                                    <li className="breadcrumb-item"><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
                                    <li className="breadcrumb-item active text-gold" aria-current="page">My Account</li>
                                </ol>
                            </nav>
                            <h1 className="display-5 fw-bold mb-0">Welcome Back, <span className="text-gold">{fuser?.name?.split(" ")[0] || 'User'}</span></h1>
                            <p className="text-light-50 mb-0 mt-2" style={{ color: '#aaa' }}>Manage your luxury skincare journey and orders.</p>
                        </div>
                        <div className="d-flex gap-3">
                            <button className="btn-luxury-outline" onClick={handleLogout}>
                                <FiLogOut className="me-2" /> Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container pb-5">
                <div className="row g-4">
                    {/* ── SIDEBAR: ACCOUNT DETAILS ── */}
                    <div className="col-lg-4 order-lg-2">
                        <div className="premium-glass-card p-4 h-100" style={{ position: 'sticky', top: '120px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="fw-bold m-0 fs-5 text-white">Account Details</h4>
                                {!isEditing && fuser && (
                                    <button className="edit-icon-btn" onClick={handleEditClick} title="Edit Profile">
                                        <FiEdit3 size={18} />
                                    </button>
                                )}
                            </div>

                            {fuser ? (
                                isEditing ? (
                                    <form onSubmit={handleProfileUpdate} className="animate-fade-in">
                                        <div className="mb-3">
                                            <label className="label-luxury">Full Name</label>
                                            <input type="text" className="input-luxury" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="label-luxury">Email Address</label>
                                            <input type="email" className="input-luxury" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
                                        </div>
                                        <div className="mb-4">
                                            <label className="label-luxury">Delivery Address</label>
                                            <textarea className="input-luxury" rows="3" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}></textarea>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button type="submit" className="btn-luxury w-100">Save</button>
                                            <button type="button" className="btn-luxury-outline w-100" onClick={handleCancel}>Cancel</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="profile-display text-center text-md-start">
                                        <div className="avatar-circle mb-4 mx-auto mx-md-0">
                                            {fuser.name?.charAt(0) || <FiUser />}
                                        </div>
                                        <div className="info-group mb-4">
                                            <div className="label-luxury"><FiUser className="me-2" /> Name</div>
                                            <div className="value-luxury fs-5 text-white">{fuser.name}</div>
                                        </div>
                                        <div className="info-group mb-4">
                                            <div className="label-luxury"><FiMail className="me-2" /> Email</div>
                                            <div className="value-luxury text-white">{fuser.email}</div>
                                        </div>
                                        <div className="info-group">
                                            <div className="label-luxury"><FiMapPin className="me-2" /> Default Address</div>
                                            <div className="value-luxury text-light-50 small" style={{ color: '#aaa' }}>{fuser.address || 'No address provided yet.'}</div>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="text-center py-5">
                                    <div className="luxury-spinner mx-auto"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── MAIN: ORDER HISTORY ── */}
                    <div className="col-lg-8 order-lg-1">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="title-icon"><FiPackage size={24} /></div>
                            <h3 className="fw-bold mb-0 text-white">Order History</h3>
                            <span className="badge-luxury ms-2">{orders.length}</span>
                        </div>

                        {loadingOrders ? (
                            <div className="text-center py-5">
                                <div className="luxury-spinner mx-auto"></div>
                                <p className="mt-3 text-secondary">Checking your order warehouse...</p>
                            </div>
                        ) : orders.length > 0 ? (
                            <div className="d-flex flex-column gap-4">
                                {orders.map((order) => (
                                    <div key={order._id} className="order-card-premium">
                                        <div className="card-top p-4 d-flex justify-content-between align-items-start">
                                            <div className="order-meta">
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <span className="label-luxury m-0">Order ID:</span>
                                                    <span className="fw-bold text-white fs-5">#{order.customOrderId || order._id.substring(order._id.length - 8).toUpperCase()}</span>
                                                </div>
                                                <div className="text-secondary small">Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                            </div>
                                            <div className="order-status-price text-end">
                                                <div className="fs-4 fw-bold text-gold">₹{order.totalAmount?.toLocaleString()}</div>
                                                <div className="status-tag mt-2" style={{ backgroundColor: `${getStatusColor(order.orderStatus)}20`, color: getStatusColor(order.orderStatus), border: `1px solid ${getStatusColor(order.orderStatus)}40` }}>
                                                    {order.orderStatus}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-middle p-4 border-top border-bottom border-dark" style={{ backgroundColor: 'rgba(255,255,255,0.01)' }}>
                                            <div className="row g-4">
                                                <div className="col-md-7">
                                                    <div className="label-luxury mb-3"><FiTruck className="me-2" /> Shipping Status</div>
                                                    <OrderTracker currentStatus={order.orderStatus} />
                                                </div>
                                                <div className="col-md-5">
                                                    <div className="label-luxury mb-2">Items Snapshot</div>
                                                    <div className="item-previews d-flex -space-x-3">
                                                        {order.items?.slice(0, 4).map((item, i) => (
                                                            <div key={i} className="item-thumb-wrapper" style={{ zIndex: 5 - i }}>
                                                                <img src={item.image} alt={item.name} />
                                                            </div>
                                                        ))}
                                                        {order.items?.length > 4 && (
                                                            <div className="item-thumb-more" style={{ zIndex: 1 }}>
                                                                +{order.items.length - 4}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-secondary small mt-2 mb-0" style={{ fontSize: '11px' }}>
                                                        {order.items?.length ?? 0} {order.items?.length === 1 ? 'item' : 'items'} in this package
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-bottom p-3 px-4 d-flex justify-content-between align-items-center">
                                            <div className="text-secondary small d-none d-md-block">
                                                {order.orderStatus === 'Delivered' ? 'Delivered on time' : 'Expected delivery within 5-7 business days'}
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button className="btn-delete-luxury" onClick={() => handleDeleteOrder(order._id)} title="Delete from History">
                                                    <FiTrash2 size={16} />
                                                </button>
                                                <button className="btn-luxury-sm">
                                                    Track Order <FiChevronRight className="ms-1" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="premium-glass-card text-center py-5">
                                <FiShoppingBag size={48} className="text-secondary mb-3 opacity-25" />
                                <h5 className="fw-bold text-white">No orders found</h5>
                                <p className="text-secondary">Your luxury catalog awaits. Start your K-Beauty journey today.</p>
                                <Link to="/shop" className="btn-luxury mt-3 d-inline-block text-decoration-none">
                                    Start Shopping
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .text-gold { color: #D4AF37 !important; }
                .text-secondary { color: #94a3b8 !important; }
                .text-light-50 { color: rgba(255, 255, 255, 0.6) !important; }
                
                /* ── CARDS ── */
                .premium-glass-card {
                    background: rgba(15, 15, 15, 0.8);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(212, 175, 55, 0.15);
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                }
                
                .order-card-premium {
                    background: #0d0d0d;
                    border: 1px solid #1a1a1a;
                    border-radius: 20px;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .order-card-premium:hover {
                    border-color: #D4AF37;
                    transform: translateY(-4px);
                    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
                }

                /* ── INPUTS & LABELS ── */
                .label-luxury {
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: #d1d1d1;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    opacity: 0.8;
                }
                .input-luxury {
                    width: 100%;
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 10px;
                    padding: 12px 16px;
                    color: #fff;
                    font-size: 14px;
                    transition: all 0.3s;
                }
                .input-luxury:focus {
                    outline: none;
                    border-color: #D4AF37;
                    background: #151515;
                }

                /* ── BUTTONS ── */
                .btn-luxury {
                    background: #D4AF37;
                    color: #000;
                    font-weight: 700;
                    border: none;
                    padding: 14px 28px;
                    border-radius: 10px;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .btn-luxury:hover {
                    background: #f1c40f;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3);
                }
                .btn-luxury-outline {
                    background: transparent;
                    color: #fff;
                    border: 1px solid #333;
                    padding: 12px 24px;
                    border-radius: 10px;
                    font-weight: 600;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-luxury-outline:hover {
                    background: #111;
                    border-color: #555;
                    color: #D4AF37;
                }
                .btn-luxury-sm {
                    background: #111;
                    color: #fff;
                    border: 1px solid #222;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 700;
                    transition: all 0.3s;
                }
                .btn-luxury-sm:hover { 
                    background: #D4AF37; 
                    color: #000;
                    border-color: #D4AF37;
                }

                .btn-delete-luxury {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    padding: 8px;
                    border-radius: 8px;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-delete-luxury:hover {
                    background: #ef4444;
                    color: #fff;
                    border-color: #ef4444;
                }

                .edit-icon-btn {
                    background: none; border: none; color: #777; cursor: pointer; transition: all 0.2s;
                    width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
                }
                .edit-icon-btn:hover { color: #D4AF37; background: rgba(212, 175, 55, 0.1); }

                /* ── AVATAR ── */
                .avatar-circle {
                    width: 100px; height: 100px; border-radius: 50%;
                    background: linear-gradient(135deg, #D4AF37 0%, #aa8c2c 100%);
                    color: #000; font-size: 40px; font-weight: 900;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 15px 35px rgba(212, 175, 55, 0.2);
                    border: 4px solid #000;
                }

                /* ── ORDER STATUSES ── */
                .status-tag {
                    display: inline-block;
                    padding: 5px 14px;
                    border-radius: 8px;
                    font-size: 9px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                /* ── TRACKER ── */
                .order-tracker-premium {
                    position: relative;
                    padding: 15px 0;
                }
                .tracker-line {
                    position: absolute; top: 23px; left: 0; right: 0;
                    height: 2px; background: #222; border-radius: 1px;
                    z-index: 1;
                }
                .tracker-progress {
                    position: absolute; top: 0; left: 0; height: 100%;
                    background: #10b981; border-radius: 1px;
                    transition: width 1.5s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
                .tracker-nodes {
                    display: flex; justify-content: space-between;
                    position: relative; z-index: 2;
                }
                .tracker-node {
                    display: flex; flex-direction: column; align-items: center; gap: 10px;
                    width: 50px;
                }
                .node-icon {
                    width: 28px; height: 28px; border-radius: 50%;
                    background: #000; border: 2px solid #222;
                    display: flex; align-items: center; justify-content: center;
                    color: #333; font-size: 12px; transition: all 0.4s;
                }
                .node-label {
                    font-size: 8px; font-weight: 800; color: #444;
                    text-transform: uppercase; transition: all 0.4s;
                    letter-spacing: 0.5px;
                }
                .tracker-node.completed .node-icon { background: #10b981; border-color: #10b981; color: #fff; }
                .tracker-node.completed .node-label { color: #10b981; }
                .tracker-node.active .node-icon { background: #10b981; border-color: #10b981; box-shadow: 0 0 20px rgba(16, 185, 129, 0.5); }
                .tracker-node.active .node-label { color: #fff; font-weight: 900; }

                /* ── ITEM THUMBS ── */
                .item-previews { display: flex; align-items: center; }
                .item-thumb-wrapper {
                    width: 46px; height: 46px; border-radius: 12px; border: 2px solid #000;
                    overflow: hidden; background: #111; transition: transform 0.2s;
                }
                .item-thumb-wrapper:hover { transform: scale(1.1); z-index: 10 !important; }
                .item-thumb-wrapper img { width: 100%; height: 100%; object-fit: cover; }
                .item-thumb-more {
                    width: 46px; height: 46px; border-radius: 12px; border: 2px solid #000;
                    background: #111; color: #fff; font-size: 11px; font-weight: 800;
                    display: flex; align-items: center; justify-content: center;
                }

                .badge-luxury {
                    background: rgba(212, 175, 55, 0.15); color: #D4AF37; font-size: 11px; font-weight: 900;
                    padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.3);
                }
                .title-icon {
                    width: 54px; height: 54px; background: rgba(212, 175, 55, 0.1);
                    color: #D4AF37; border-radius: 16px; display: flex;
                    align-items: center; justify-content: center;
                }

                .luxury-spinner {
                    width: 40px; height: 40px; border: 3px solid #111; border-top-color: #D4AF37; border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
            `}</style>
        </div>
    );
};

export default AccountPage;
