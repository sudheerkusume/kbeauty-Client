import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { FiUsers, FiActivity, FiClock, FiMail, FiUser } from 'react-icons/fi';

const ViewUsers = () => {
    const [onlineData, setOnlineData] = useState({ count: 0, users: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOnlineUsers = async () => {
        try {
            const token = localStorage.getItem("usertoken");
            const res = await axios.get(`${API_BASE_URL}/api/auth/online-users`, {
                headers: { "x-token": token }
            });
            setOnlineData(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching online users:", err);
            setError(err.response?.data?.message || "Failed to load online users");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOnlineUsers();
        // Refresh every 30 seconds
        const interval = setInterval(fetchOnlineUsers, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text- luxury-gold" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-0 animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="text-white fw-bold mb-1">Online Users</h2>
                    <p className="text-secondary small mb-0">Real-time activity tracking (5-minute window)</p>
                </div>
                <div className="bg-dark px-4 py-2 rounded-3 border border-secondary d-flex align-items-center gap-3">
                    <div className="position-relative">
                        <FiUsers className="text-luxury-gold" size={24} />
                        <span className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-white rounded-circle">
                            <span className="visually-hidden">Online</span>
                        </span>
                    </div>
                    <div>
                        <h4 className="text-white m-0 fw-bold">{onlineData.count}</h4>
                        <p className="text-secondary mb-0" style={{ fontSize: '10px', fontWeight: 700 }}>ACTIVE NOW</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger bg-dark text-danger border-danger mb-4">
                    {error}
                </div>
            )}

            <div className="table-responsive rounded-4 border border-secondary overflow-hidden">
                <table className="table table-dark table-hover m-0" style={{ backgroundColor: '#000' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                            <th className="py-3 px-4 text-secondary small fw-bold" style={{ letterSpacing: '1px' }}>USER</th>
                            <th className="py-3 px-4 text-secondary small fw-bold" style={{ letterSpacing: '1px' }}>EMAIL</th>
                            <th className="py-3 px-4 text-secondary small fw-bold" style={{ letterSpacing: '1px' }}>ROLE</th>
                            <th className="py-3 px-4 text-secondary small fw-bold" style={{ letterSpacing: '1px' }}>LAST ACTIVE</th>
                            <th className="py-3 px-4 text-secondary small fw-bold" style={{ letterSpacing: '1px' }}>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {onlineData.users.length > 0 ? (
                            onlineData.users.map((user) => (
                                <tr key={user._id} style={{ borderBottom: '1px solid #1a1a1a' }} className="align-middle">
                                    <td className="py-3 px-4">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="p-2 rounded-circle bg-dark border border-secondary text-luxury-gold">
                                                <FiUser size={16} />
                                            </div>
                                            <span className="text-white fw-bold">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="d-flex align-items-center gap-2 text-secondary">
                                            <FiMail size={14} />
                                            <span style={{ fontSize: '0.85rem' }}>{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-uppercase">
                                        <span className={`badge rounded-pill px-3 py-2 ${user.role === 'admin' ? 'bg-luxury-gold text-black' : 'bg-dark border border-secondary text-secondary'}`} style={{ fontSize: '10px', fontWeight: 700 }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="d-flex align-items-center gap-2 text-secondary">
                                            <FiClock size={14} />
                                            <span style={{ fontSize: '0.85rem' }}>{formatTime(user.lastActiveAt)}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="spinner-grow text-success" style={{ width: '8px', height: '8px' }} role="status"></div>
                                            <span className="text-success small fw-bold">Active</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-5 text-center text-secondary italic">
                                    No users currently online.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style>
                {`
                    .bg-luxury-gold { background-color: #D4AF37 !important; }
                    .text-luxury-gold { color: #D4AF37 !important; }
                    .border-luxury-gold { border-color: #D4AF37 !important; }
                    .table-hover tbody tr:hover {
                        background-color: rgba(255, 255, 255, 0.02) !important;
                    }
                    .transition-all { transition: all 0.3s ease; }
                `}
            </style>
        </div>
    );
};

export default ViewUsers;
