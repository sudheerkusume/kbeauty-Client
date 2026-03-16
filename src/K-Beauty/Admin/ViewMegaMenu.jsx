import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { toast } from 'react-toastify';
import { FiMenu, FiLayers, FiInfo, FiExternalLink } from 'react-icons/fi';

const ViewMegaMenu = () => {
    const [megaMenu, setMegaMenu] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchMegaMenu = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/megaMenu`);
            setMegaMenu(res.data || {});
            setLoading(false);
        } catch (err) {
            console.error("Fetch megaMenu error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMegaMenu();
    }, []);

    return (
        <div className="animate-in">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold m-0" style={{ letterSpacing: '-1.5px', color: '#fff', fontSize: '2.5rem' }}>Navigation Architecture</h2>
                    <p className="text-secondary mt-2 fw-medium">Preview and structure your storefront's mega-menu hierarchy.</p>
                </div>
                <div className="p-3 bg-dark rounded-circle text-gold border border-secondary shadow-sm">
                    <FiMenu size={24} />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="luxury-spinner mx-auto mb-3"></div>
                </div>
            ) : (
                <div className="row g-4">
                    {Object.keys(megaMenu).map((key) => (
                        <div className="col-12 col-lg-6" key={key}>
                            <div className="bg-dark rounded-4 p-4 border border-secondary h-100">
                                <div className="d-flex align-items-center gap-3 mb-4 border-bottom border-secondary pb-3">
                                    <div className="bg-black p-2 rounded-3 text-gold">
                                        <FiLayers size={20} />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold text-white m-0">{key}</h5>
                                        <span className="small text-muted">{megaMenu[key].link || "Main Category"}</span>
                                    </div>
                                </div>

                                <div className="ps-3 border-start border-secondary py-2">
                                    {megaMenu[key].columns ? megaMenu[key].columns.map((col, idx) => (
                                        <div key={idx} className="mb-4 last-child-mb-0">
                                            <h6 className="fw-bold text-gold small text-uppercase mb-3" style={{ letterSpacing: '1px' }}>{col.title}</h6>
                                            <div className="row g-2">
                                                {col.items?.map((item, i) => (
                                                    <div className="col-12 col-md-6" key={i}>
                                                        <div className="bg-black p-3 rounded-3 border border-secondary-subtle d-flex align-items-center justify-content-between">
                                                            <span className="small text-white opacity-75">{item.name}</span>
                                                            <FiExternalLink size={12} className="text-muted" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-3 bg-black rounded-3 text-center text-muted small border border-secondary border-dashed">
                                            No sub-columns defined for this navigation node.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .text-gold { color: #D4AF37; }
                .luxury-spinner {
                    width: 40px; height: 40px; border: 3px solid #222; border-top-color: #D4AF37; border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .border-secondary-subtle { border-color: rgba(255,255,255,0.05) !important; }
                .border-dashed { border-style: dashed !important; }
                .last-child-mb-0:last-child { margin-bottom: 0 !important; }
            `}</style>
        </div>
    );
};

export default ViewMegaMenu;
