import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { toast } from 'react-toastify';
import { FiMessageSquare, FiInfo, FiTrash2, FiUser, FiMail, FiPhone } from 'react-icons/fi';

const ViewEnquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEnquiries = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/enquiries`);
            setEnquiries(res.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Fetch enquiries error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const deleteEnquiry = async (id) => {
        if (window.confirm("Delete this enquiry?")) {
            try {
                await axios.delete(`${API_BASE_URL}/enquiries/${id}`);
                fetchEnquiries();
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    return (
        <div className="animate-in">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold m-0" style={{ letterSpacing: '-1.5px', color: '#fff', fontSize: '2.5rem' }}>Customer Enquiries</h2>
                    <p className="text-secondary mt-2 fw-medium">Monitor and respond to customer queries from the ecosystem.</p>
                </div>
                <div className="p-3 bg-dark rounded-circle text-gold border border-secondary shadow-sm">
                    <FiMessageSquare size={24} />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="luxury-spinner mx-auto mb-3"></div>
                    <span className="text-muted small fw-bold text-uppercase">Fetching Communications...</span>
                </div>
            ) : enquiries.length > 0 ? (
                <div className="bg-black rounded-4 border border-secondary overflow-hidden shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0 text-white">
                            <thead className="bg-dark">
                                <tr style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8' }}>
                                    <th className="ps-4 py-4 border-0">Client Details</th>
                                    <th className="py-4 border-0">Inquiry Content</th>
                                    <th className="py-4 border-0">Access & Date</th>
                                    <th className="py-4 border-0 text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enquiries.map((enq) => (
                                    <tr key={enq.id} className="transition-all">
                                        <td className="ps-4 py-4" style={{ width: '250px' }}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-dark p-2 rounded-3 text-gold">
                                                    <FiUser size={18} />
                                                </div>
                                                <div>
                                                    <h6 className="m-0 fw-bold">{enq.user || 'Anonymous'}</h6>
                                                    <span className="small text-muted">ID: {enq.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div style={{ maxWidth: '400px' }}>
                                                <div className="fw-bold text-gold small text-uppercase mb-1" style={{ letterSpacing: '0.5px' }}>
                                                    {enq.subject || 'No Subject'}
                                                </div>
                                                <p className="small text-white opacity-75 mb-0" style={{ lineHeight: '1.4' }}>
                                                    {enq.message || 'No message content provided.'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="d-flex flex-column gap-1">
                                                <div className="d-flex align-items-center gap-2 small">
                                                    <FiMail className="text-muted" size={12} />
                                                    <span>{enq.email || 'N/A'}</span>
                                                </div>
                                                <div className="d-flex align-items-center gap-2 small">
                                                    <FiPhone className="text-muted" size={12} />
                                                    <span>{enq.mobile || 'N/A'}</span>
                                                </div>
                                                {enq.date && (
                                                    <div className="mt-1 badge bg-dark text-secondary border border-secondary fw-normal">
                                                        {enq.date}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="pe-4 py-4 text-end">
                                            <button
                                                className="btn btn-dark border-secondary rounded-3 p-2"
                                                onClick={() => deleteEnquiry(enq.id)}
                                            >
                                                <FiTrash2 size={14} className="text-danger" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-black rounded-4 border border-secondary p-5 text-center shadow-lg" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="mb-4 p-4 bg-dark rounded-circle text-secondary border border-secondary opacity-50">
                        <FiInfo size={48} />
                    </div>
                    <h4 className="fw-bold text-white mb-2">No Enquiries Yet</h4>
                    <p className="text-secondary mb-0 mx-auto" style={{ maxWidth: '400px' }}>
                        When customers reach out via your contact forms, their messages will be securely transmitted and displayed here for your review.
                    </p>
                </div>
            )}
            <style>{`
                .luxury-spinner {
                    width: 40px; height: 40px; border: 3px solid #222; border-top-color: #D4AF37; border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .transition-all { transition: all 0.3s ease; }
                tr:hover { background-color: rgba(255,255,255,0.02) !important; }
            `}</style>
        </div>
    );
};

export default ViewEnquiries;