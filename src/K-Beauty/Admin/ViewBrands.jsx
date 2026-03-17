import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { toast } from 'react-toastify';
import { FiActivity, FiPlus, FiEdit2, FiTrash2, FiImage, FiExternalLink, FiCheck } from 'react-icons/fi';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import brand assets
import brand1 from '../assets/Brand1.avif';
import brand2 from '../assets/Brand2.webp';
import brand3 from '../assets/Brand3.avif';
import brand4 from '../assets/Brand4.webp';
import brand5 from '../assets/Brand5.avif';
import brand6 from '../assets/Brand6.avif';
import brand7 from '../assets/Brand7.avif';
import brand8 from '../assets/Brand8.avif';

const brandImageMap = {
    "Brand1.avif": brand1,
    "Brand2.webp": brand2,
    "Brand3.avif": brand3,
    "Brand4.webp": brand4,
    "Brand5.avif": brand5,
    "Brand6.avif": brand6,
    "Brand7.avif": brand7,
    "Brand8.avif": brand8
};

const ViewBrands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeBrand, setActiveBrand] = useState({ name: "", slug: "", img: "Brand1.avif" });
    const [logoFile, setLogoFile] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/brands`);
            setBrands(res.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Fetch brands error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const deleteBrand = async (id) => {
        if (window.confirm("Delete this brand?")) {
            try {
                await axios.delete(`${API_BASE_URL}/brands/${id}`);
                fetchBrands();
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    const handleOpenModal = (brand = null) => {
        if (brand) {
            setActiveBrand(brand);
            setIsEdit(true);
        } else {
            setActiveBrand({ name: "", slug: "", img: "Brand1.avif" });
            setIsEdit(false);
        }
        setLogoFile(null);
        new bootstrap.Modal(document.getElementById('brandModal')).show();
    };

    const resolveImg = (img) => {
        if (!img) return null;
        if (img.startsWith('http') || img.startsWith('/') || img.startsWith('data:')) return img;
        return brandImageMap[img] || img;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", activeBrand.name);
            formData.append("slug", activeBrand.slug);
            if (logoFile) {
                formData.append("img", logoFile);
            } else {
                formData.append("img", activeBrand.img);
            }

            if (isEdit) {
                await axios.put(`${API_BASE_URL}/brands/${activeBrand._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } else {
                await axios.post(`${API_BASE_URL}/brands`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }
            bootstrap.Modal.getInstance(document.getElementById('brandModal')).hide();
            fetchBrands();
            toast.success(isEdit ? "Brand refined!" : "Brand initialized!");
        } catch (err) {
            console.error("Save error:", err);
            toast.error("Save failed");
        }
    };

    return (
        <div className="animate-in">
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-4">
                <div style={{ minWidth: '280px' }}>
                    <h2 className="fw-bold m-0" style={{ letterSpacing: '-1.5px', color: '#fff', fontSize: '2.5rem' }}>Partner Brands</h2>
                    <p className="text-secondary mt-2 fw-medium">Manage the luxury brands in your K-Beauty portfolio.</p>
                </div>
                <button
                    className="btn btn-luxury-primary px-4 py-3 rounded-pill d-flex align-items-center gap-2"
                    onClick={() => handleOpenModal()}
                >
                    <FiPlus size={20} />
                    <span className="fw-bold text-uppercase" style={{ fontSize: '12px' }}>Add Brand</span>
                </button>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="luxury-spinner mx-auto mb-3"></div>
                </div>
            ) : (
                <div className="row g-4">
                    {brands.map((brand) => (
                        <div className="col-12 col-md-4 col-lg-3" key={brand.id}>
                            <div className="bg-dark rounded-4 p-4 text-center border border-secondary transition-all hover-up-gold h-100 d-flex flex-column">
                                <div className="brand-logo-container mx-auto mb-4 bg-black rounded-circle d-flex align-items-center justify-content-center border border-secondary overflow-hidden shadow-sm" style={{ width: '100px', height: '100px' }}>
                                    {resolveImg(brand.img) ? (
                                        <img src={resolveImg(brand.img)} alt={brand.name} className="w-100 h-100 object-fit-contain" />
                                    ) : (
                                        <FiImage size={32} className="text-muted opacity-25" />
                                    )}
                                </div>
                                <h5 className="fw-bold text-white mb-2">{brand.name}</h5>
                                <div className="d-flex align-items-center justify-content-center gap-2 text-muted small mb-4 flex-grow-1">
                                    <FiExternalLink size={14} />
                                    <span>/{brand.slug}</span>
                                </div>
                                <div className="d-flex justify-content-center gap-2">
                                    <button
                                        className="btn btn-black btn-sm rounded-3 p-2 border-secondary hvr-gold"
                                        onClick={() => handleOpenModal(brand)}
                                    >
                                        <FiEdit2 size={14} />
                                    </button>
                                    <button
                                        className="btn btn-black btn-sm rounded-3 p-2 border-secondary hvr-danger"
                                        onClick={() => deleteBrand(brand._id)}
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <div className="modal fade" id="brandModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content bg-charcoal border border-secondary rounded-4 shadow-lg">
                        <div className="modal-header border-bottom border-secondary p-4 bg-black">
                            <h5 className="modal-title fw-bold text-white d-flex align-items-center gap-2" style={{ color: '#fff !important' }}>
                                <FiActivity className="text-gold" />
                                {isEdit ? "Refine Brand Profile" : "Initialize New Brand"}
                            </h5>
                            <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="modal"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body p-4">
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-uppercase text-gold mb-2" style={{ letterSpacing: '1px' }}>Brand Identity</label>
                                    <input
                                        type="text"
                                        className="form-control luxury-input"
                                        value={activeBrand.name}
                                        onChange={(e) => setActiveBrand({ ...activeBrand, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                        placeholder="e.g. Skin1004"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-uppercase text-gold mb-2" style={{ letterSpacing: '1px' }}>Brand Logo</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-black border-secondary text-gold">
                                            <FiImage size={14} />
                                        </span>
                                        <input
                                            type="file"
                                            className="form-control luxury-input"
                                            onChange={(e) => setLogoFile(e.target.files[0])}
                                            accept="image/*"
                                        />
                                    </div>
                                    <div className="form-text text-white-50 smaller mt-2">
                                        Select a high-quality brand logo file (JPEG, PNG, WEBP).
                                    </div>
                                </div>
                                <div className="mb-0">
                                    <label className="form-label small fw-bold text-uppercase text-gold mb-2" style={{ letterSpacing: '1px' }}>Route Slug</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-black border-secondary text-muted">/</span>
                                        <input
                                            type="text"
                                            className="form-control luxury-input"
                                            value={activeBrand.slug}
                                            onChange={(e) => setActiveBrand({ ...activeBrand, slug: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-top border-secondary p-4 bg-black">
                                <button type="button" className="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Discard</button>
                                <button type="submit" className="btn btn-luxury-primary rounded-pill px-5 d-flex align-items-center gap-2">
                                    <FiCheck /> {isEdit ? "Apply Changes" : "Confirm Addition"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .bg-charcoal { background-color: #0d0d0d; }
                .btn-luxury-primary { background: #D4AF37; color: #000; border: none; transition: all 0.3s; font-weight: bold; }
                .btn-luxury-primary:hover { background: #b8962d; transform: scale(1.02); }
                .luxury-input { 
                    background: #111; border: 1px solid #222; color: #fff; padding: 12px 18px; border-radius: 12px;
                    transition: all 0.3s ease;
                }
                .luxury-input:focus { 
                    background: #151515; border-color: #D4AF37; box-shadow: 0 0 15px rgba(212, 175, 55, 0.1); color: #fff;
                }
                .btn-black { background: #000; color: #fff; }
                @media (max-width: 576px) {
                    .modal-dialog {
                        max-width: 100% !important;
                        margin: 0 !important;
                    }
                    .modal-content {
                        min-height: 100vh;
                        border-radius: 0 !important;
                    }
                    h2 {
                        font-size: 1.8rem !important;
                    }
                    .luxury-input {
                        height: 44px;
                        padding: 10px 15px;
                    }
                }
                .hvr-gold:hover { color: #D4AF37 !important; border-color: #D4AF37 !important; }
                .hvr-danger:hover { color: #ff4d4d !important; border-color: #ff4d4d !important; }
                .text-gold { color: #D4AF37; }
                .hover-up-gold:hover { transform: translateY(-8px); border-color: #D4AF37 !important; box-shadow: 0 10px 30px rgba(212, 175, 55, 0.1); }
                .luxury-spinner {
                    width: 40px; height: 40px; border: 3px solid #222; border-top-color: #D4AF37; border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .object-fit-contain { object-fit: contain; }
            `}</style>
        </div>
    );
};

export default ViewBrands;
