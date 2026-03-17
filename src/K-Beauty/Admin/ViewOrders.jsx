import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiShoppingBag, FiPackage, FiInfo, FiUser, FiMapPin, FiCreditCard, FiClock, FiFilter } from 'react-icons/fi';

const ViewOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        orderStatus: "all",
        paymentStatus: "all",
        search: ""
    });

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("usertoken");
            if (!token) {
                setLoading(false);
                return;
            }
            const res = await axios.get(`${API_BASE_URL}/order/all`, {
                headers: { "x-token": token }
            });
            const data = Array.isArray(res.data) ? res.data : [];
            setOrders(data);
            setFilteredOrders(data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        let result = [...orders];
        if (filters.orderStatus !== "all") {
            result = result.filter(o => o.orderStatus === filters.orderStatus);
        }
        if (filters.paymentStatus !== "all") {
            result = result.filter(o => o.paymentStatus === filters.paymentStatus);
        }
        if (filters.search) {
            const s = filters.search.toLowerCase();
            result = result.filter(o => 
                (o.customOrderId || "").toLowerCase().includes(s) || 
                (o.userId?.name || "").toLowerCase().includes(s) ||
                (o.shippingAddress?.email || "").toLowerCase().includes(s)
            );
        }
        setFilteredOrders(result);
    }, [filters, orders]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("usertoken");
            await axios.patch(`${API_BASE_URL}/order/${id}/status`, 
                { orderStatus: newStatus },
                { headers: { "x-token": token } }
            );
            toast.success(`Status updated to ${newStatus}`);
            fetchOrders();
            // Refresh the selected order in modal if it's the one we just updated
            if (selectedOrder && selectedOrder._id === id) {
                const refreshedOrder = orders.find(o => o._id === id);
                if (refreshedOrder) {
                    setSelectedOrder({...refreshedOrder, orderStatus: newStatus});
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-warning text-dark';
            case 'Confirmed': return 'bg-info text-dark';
            case 'Processing': return 'bg-info text-dark';
            case 'Shipped': return 'bg-primary text-white';
            case 'Out for Delivery': return 'bg-primary text-white';
            case 'Delivered': return 'bg-success text-white';
            case 'Cancelled': return 'bg-danger text-white';
            default: return 'bg-secondary text-white';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString(undefined, {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const OrderDetailsModal = ({ order, onClose }) => {
        if (!order) return null;

        const transitionMap = {
            "Pending": ["Confirmed", "Cancelled"],
            "Confirmed": ["Processing", "Cancelled"],
            "Processing": ["Shipped", "Cancelled"],
            "Shipped": ["Out for Delivery", "Cancelled"],
            "Out for Delivery": ["Delivered", "Cancelled"],
            "Delivered": [],
            "Cancelled": []
        };

        return (
            <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.8)', zIndex: 1050 }}>
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                    <div className="modal-content bg-dark text-white border-secondary">
                        <div className="modal-header border-secondary p-4">
                            <h5 className="modal-title fw-bold">Order Details: {order.customOrderId || order._id}</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>
                        <div className="modal-body p-4">
                            <div className="row g-4">
                                {/* Section 1: User */}
                                <div className="col-md-6">
                                    <div className="p-3 bg-black rounded-3 border border-secondary h-100">
                                        <h6 className="text-gold mb-3 d-flex align-items-center gap-2" style={{color: '#D4AF37'}}><FiUser /> User Details</h6>
                                        <p className="mb-1 fw-bold">{order.userId?.name || "Guest Checkout"}</p>
                                        <p className="mb-1 small text-muted">Email: {order.userId?.email || order.shippingAddress?.email || "N/A"}</p>
                                        <p className="mb-0 small text-muted">Phone: {order.userId?.phone || order.shippingAddress?.phone || "N/A"}</p>
                                    </div>
                                </div>

                                {/* Section 2: Address */}
                                <div className="col-md-6">
                                    <div className="p-3 bg-black rounded-3 border border-secondary h-100">
                                        <h6 className="text-gold mb-3 d-flex align-items-center gap-2" style={{color: '#D4AF37'}}><FiMapPin /> Shipping Address</h6>
                                        {order.shippingAddress && typeof order.shippingAddress === 'object' ? (
                                            <div className="small">
                                                <p className="mb-1 fw-bold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                                <p className="mb-1">{order.shippingAddress.address}</p>
                                                {order.shippingAddress.apartment && <p className="mb-1">{order.shippingAddress.apartment}</p>}
                                                <p className="mb-0">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                                            </div>
                                        ) : <p className="small text-muted">{order.shippingAddress || "N/A"}</p>}
                                    </div>
                                </div>

                                {/* Section 3: Financials & Status */}
                                <div className="col-md-12">
                                    <div className="p-3 bg-black rounded-3 border border-secondary">
                                        <div className="row g-3">
                                            <div className="col-md-4 border-end border-secondary">
                                                <h6 className="text-gold mb-3 d-flex align-items-center gap-2" style={{color: '#D4AF37'}}><FiCreditCard /> Transaction</h6>
                                                <p className="mb-1 small">Mode: <strong>{order.paymentMode}</strong></p>
                                                <p className="mb-1 small">Payment: <span className={`badge ${order.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning'}`}>{order.paymentStatus}</span></p>
                                                <p className="mb-0 small">Status: <span className={`badge ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span></p>
                                            </div>
                                            <div className="col-md-4 border-end border-secondary">
                                                <h6 className="text-gold mb-3" style={{color: '#D4AF37'}}>Financials</h6>
                                                <div className="small">
                                                    <div className="d-flex justify-content-between mb-1"><span>Subtotal:</span> <span>₹{order.subtotal?.toLocaleString() || 0}</span></div>
                                                    <div className="d-flex justify-content-between mb-1"><span>Tax:</span> <span>₹{order.tax?.toLocaleString() || 0}</span></div>
                                                    <div className="d-flex justify-content-between mb-1"><span>Shipping:</span> <span>₹{order.shippingFee?.toLocaleString() || 0}</span></div>
                                                    <div className="d-flex justify-content-between border-top border-secondary pt-1 fw-bold"><span>Total:</span> <span style={{color: '#D4AF37'}}>₹{order.totalAmount?.toLocaleString()}</span></div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <h6 className="text-gold mb-3 d-flex align-items-center gap-2" style={{color: '#D4AF37'}}><FiClock /> History</h6>
                                                <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                                    {order.statusHistory?.map((h, i) => (
                                                        <div key={i} className="small mb-1 text-muted border-start border-secondary ps-2">
                                                            <div>{h.status}</div>
                                                            <div style={{ fontSize: '9px' }}>{formatDate(h.updatedAt)}</div>
                                                        </div>
                                                    ))}
                                                    {(!order.statusHistory || order.statusHistory.length === 0) && <span className="small text-muted">No history available</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 4: Items */}
                                <div className="col-md-12">
                                    <div className="p-3 bg-black rounded-3 border border-secondary">
                                        <h6 className="text-gold mb-3 d-flex align-items-center gap-2" style={{color: '#D4AF37'}}><FiPackage /> Order Items ({order.items?.length})</h6>
                                        <div className="table-responsive">
                                            <table className="table table-dark table-sm mb-0">
                                                <thead>
                                                    <tr className="small text-muted">
                                                        <th>Product</th>
                                                        <th>Qty</th>
                                                        <th>Price</th>
                                                        <th className="text-end">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.items?.map((item, i) => (
                                                        <tr key={i} className="small align-middle">
                                                            <td className="py-2">
                                                                <img src={item.image} width="30" height="30" className="rounded me-2 object-fit-cover" alt="" />
                                                                {item.name}
                                                            </td>
                                                            <td className="py-2">{item.qty}</td>
                                                            <td className="py-2">₹{item.price.toLocaleString()}</td>
                                                            <td className="py-2 text-end">₹{(item.price * item.qty).toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-secondary p-4 d-flex justify-content-between align-items-center">
                            <div className="d-flex gap-2">
                                {transitionMap[order.orderStatus]?.map(status => (
                                    <button 
                                        key={status} 
                                        className={`btn btn-sm ${status === 'Cancelled' ? 'btn-outline-danger' : 'btn-gold'}`}
                                        onClick={() => handleStatusUpdate(order._id, status)}
                                    >
                                        Move to {status}
                                    </button>
                                ))}
                            </div>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Close Panel</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-container fade-in py-4">
            <ToastContainer theme="dark" position="top-right" />
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-4">
                <div style={{ minWidth: '250px' }}>
                    <h2 className="fw-bold m-0 text-white" style={{ letterSpacing: '-1px' }}>Order Analytics Hub</h2>
                    <p className="text-muted small mt-1">Manage processing, metrics, and fulfillment auditing.</p>
                </div>
                <div className="d-flex gap-3 align-items-center flex-grow-1 flex-wrap">
                     <div className="input-group input-group-sm bg-dark border border-secondary rounded-3 overflow-hidden flex-grow-1" style={{ minWidth: '200px', height: '44px' }}>
                        <span className="input-group-text bg-transparent border-0 text-muted"><FiFilter /></span>
                        <input 
                            type="text" 
                            className="form-control bg-transparent border-0 text-white" 
                            placeholder="KB-ID or Customer..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                    </div>
                    <select 
                        className="form-select form-select-sm bg-dark text-white border-secondary rounded-3"
                        style={{ width: 'auto', minWidth: '150px', height: '44px' }}
                        value={filters.orderStatus}
                        onChange={(e) => setFilters(prev => ({ ...prev, orderStatus: e.target.value }))}
                    >
                        <option value="all">Fulfillment Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-gold" style={{color: '#D4AF37'}} role="status"></div>
                </div>
            ) : filteredOrders.length > 0 ? (
                <div className="bg-black rounded-4 border border-secondary overflow-hidden shadow-lg">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0 text-white">
                            <thead className="bg-dark text-uppercase small" style={{ fontSize: '10px', color: '#888' }}>
                                <tr>
                                    <th className="ps-4 py-4">Order Unit</th>
                                    <th className="py-4">Stakeholder</th>
                                    <th className="py-4">Financials</th>
                                    <th className="py-4">Status & Payment</th>
                                    <th className="py-4 text-end pe-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="border-bottom border-secondary transition-all">
                                        <td className="ps-4 py-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-dark p-2 rounded-3 text-gold border border-secondary">
                                                    <FiPackage size={18} style={{color: '#D4AF37'}} />
                                                </div>
                                                <div>
                                                    <div className="fw-bold small">{order.customOrderId || order._id.slice(-8).toUpperCase()}</div>
                                                    <div className="text-muted" style={{ fontSize: '10px' }}>{formatDate(order.createdAt)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="d-flex flex-column">
                                                <span className="fw-bold small">{order.userId?.name || "Guest User"}</span>
                                                <span className="text-muted" style={{ fontSize: '11px' }}>{order.userId?.email || order.shippingAddress?.email || "N/A"}</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="d-flex flex-column">
                                                <span className="fw-bold" style={{color: '#D4AF37'}}>₹{order.totalAmount?.toLocaleString() || order.total?.toLocaleString()}</span>
                                                <span className="text-muted" style={{ fontSize: '11px' }}>{order.items.length} Products</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="d-flex gap-2 align-items-center">
                                                <span className={`badge rounded-pill px-3 py-2 text-uppercase ${getStatusColor(order.orderStatus)}`} style={{ fontSize: '9px' }}>
                                                    {order.orderStatus}
                                                </span>
                                                <span className={`badge border ${order.paymentStatus === 'Paid' ? 'border-success text-success' : 'border-warning text-warning'} bg-transparent`} style={{ fontSize: '9px' }}>
                                                    {order.paymentStatus || (order.paymentMode === 'Cash on Delivery' ? 'Pending' : 'N/A')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="pe-4 py-4 text-end">
                                            <button 
                                                className="btn btn-dark border-secondary rounded-3 p-2 hvr-gold"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <FiInfo size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-5 border border-secondary rounded-4 bg-dark">
                    <FiShoppingBag size={48} className="text-muted mb-3 opacity-25" />
                    <h5 className="text-white">No Matching Orders Found</h5>
                    <p className="text-muted small">Adjust your filters to see more results.</p>
                </div>
            )}

            {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}

            <style>{`
                .admin-container { font-family: 'Outfit', sans-serif; background-color: #000; min-height: 80vh; }
                .text-gold { color: #D4AF37 !important; }
                .btn-gold { background-color: #D4AF37 !important; color: #000 !important; border: none !important; font-weight: 600 !important; }
                .btn-gold:hover { background-color: #B8962E !important; color: #000 !important; }
                .hvr-gold:hover { color: #D4AF37 !important; border-color: #D4AF37 !important; transform: translateY(-1px); }
                .transition-all { transition: all 0.2s ease; }
                .form-select-sm, .form-control-sm { background-color: #111 !important; border-color: #333 !important; color: #fff !important; }
                .form-select-sm:focus, .form-control-sm:focus { border-color: #D4AF37 !important; box-shadow: none !important; }
                .modal-content { background-color: #0a0a0a !important; border: 1px solid #333 !important; }
                .bg-black { background-color: #000 !important; }
                @media (max-width: 768px) {
                    .modal-dialog {
                        max-width: 100% !important;
                        margin: 0 !important;
                    }
                    .modal-content {
                        min-height: 100vh;
                        border-radius: 0 !important;
                    }
                    .col-md-4.border-end {
                        border-end: none !important;
                        border-bottom: 1px solid #333 !important;
                        padding-bottom: 15px;
                    }
                    table {
                        font-size: 12px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ViewOrders;