import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiTag, FiList, FiHelpCircle, FiX, FiCheck, FiPlusSquare } from 'react-icons/fi';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import API_BASE_URL from "../config";

const ViewTaxonomies = () => {
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState("categories");

    // Modal States
    const [activeItem, setActiveItem] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [catRes, typeRes, faqRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/categories`),
                axios.get(`${API_BASE_URL}/types`),
                axios.get(`${API_BASE_URL}/faq`)
            ]);
            setCategories(catRes.data || []);
            setTypes(typeRes.data || []);
            setFaqs(faqRes.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Fetch taxonomies error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteItem = async (endpoint, id) => {
        if (window.confirm("Delete this item?")) {
            try {
                await axios.delete(`${API_BASE_URL}/${endpoint}/${id}`);
                fetchData();
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    const handleOpenModal = (section, item = null) => {
        setActiveSection(section);
        if (item) {
            setActiveItem(item);
            setIsEdit(true);
        } else {
            const emptyItem = section === 'categories' ? { name: "", slug: "" } :
                section === 'types' ? { name: "", category: categories[0]?.name || "", slug: "" } :
                    { question: "", answer: "" };
            setActiveItem(emptyItem);
            setIsEdit(false);
        }
        new bootstrap.Modal(document.getElementById('taxModal')).show();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = activeSection;
        try {
            if (isEdit) {
                await axios.put(`${API_BASE_URL}/${endpoint}/${activeItem.id}`, activeItem);
            } else {
                const payload = { ...activeItem, id: Date.now().toString() };
                await axios.post(`${API_BASE_URL}/${endpoint}`, payload);
            }
            bootstrap.Modal.getInstance(document.getElementById('taxModal')).hide();
            fetchData();
        } catch (err) {
            alert("Save failed");
        }
    };

    const renderHeader = (title, subtitle, icon, section) => (
        <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
                <h2 className="fw-bold m-0" style={{ letterSpacing: '-1.5px', color: '#fff', fontSize: '2.5rem' }}>{title}</h2>
                <p className="text-secondary mt-2 fw-medium">{subtitle}</p>
            </div>
            <button
                className="btn btn-luxury-primary px-4 py-3 rounded-pill d-flex align-items-center gap-2"
                onClick={() => handleOpenModal(section)}
            >
                <FiPlus size={20} />
                <span className="fw-bold text-uppercase" style={{ fontSize: '12px' }}>Add New</span>
            </button>
        </div>
    );

    return (
        <div className="animate-in">
            {/* ── TOP TABS ── */}
            <div className="d-flex gap-3 mb-5 bg-dark p-2 rounded-4 border border-secondary" style={{ width: 'fit-content' }}>
                <button
                    className={`btn px-4 py-3 rounded-3 border-0 transition-all d-flex align-items-center gap-2 ${activeSection === 'categories' ? 'bg-luxury-gold text-dark fw-bold' : 'text-secondary opacity-50'}`}
                    onClick={() => setActiveSection('categories')}
                >
                    <FiPlusSquare /> Categories
                </button>
                <button
                    className={`btn px-4 py-3 rounded-3 border-0 transition-all d-flex align-items-center gap-2 ${activeSection === 'types' ? 'bg-luxury-gold text-dark fw-bold' : 'text-secondary opacity-50'}`}
                    onClick={() => setActiveSection('types')}
                >
                    <FiTag /> Types
                </button>
                <button
                    className={`btn px-4 py-3 rounded-3 border-0 transition-all d-flex align-items-center gap-2 ${activeSection === 'faq' ? 'bg-luxury-gold text-dark fw-bold' : 'text-secondary opacity-50'}`}
                    onClick={() => setActiveSection('faq')}
                >
                    <FiHelpCircle /> FAQs
                </button>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="luxury-spinner mx-auto mb-3"></div>
                </div>
            ) : (
                <div className="taxonomy-content">
                    {activeSection === 'categories' && (
                        <>
                            {renderHeader("Category Management", "Define the high-level hierarchy of your catalog.", <FiPlusSquare />, "categories")}
                            <div className="row g-4">
                                {categories.map(cat => (
                                    <div key={cat.id} className="col-md-4">
                                        <div className="bg-dark p-4 rounded-4 border border-secondary d-flex justify-content-between align-items-center hover-up">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-black p-2 rounded-3 text-gold"><FiPlusSquare size={18} /></div>
                                                <div>
                                                    <h6 className="m-0 fw-bold text-white">{cat.name}</h6>
                                                    <span className="small text-muted">/{cat.slug}</span>
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-black btn-sm border-secondary hvr-gold" onClick={() => handleOpenModal('categories', cat)}><FiEdit2 size={14} /></button>
                                                <button className="btn btn-black btn-sm border-secondary hvr-danger" onClick={() => deleteItem('categories', cat.id)}><FiTrash2 size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeSection === 'types' && (
                        <>
                            {renderHeader("Product Types", "Refine your categories with specific SKU sub-genres.", <FiTag />, "types")}
                            <div className="row g-4">
                                {types.map(type => (
                                    <div key={type.id} className="col-md-4">
                                        <div className="bg-dark p-4 rounded-4 border border-secondary d-flex justify-content-between align-items-center hover-up">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-black p-2 rounded-3 text-gold"><FiTag size={18} /></div>
                                                <div>
                                                    <h6 className="m-0 fw-bold text-white">{type.name}</h6>
                                                    <span className="small text-muted">{type.category} · /{type.slug}</span>
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-black btn-sm border-secondary hvr-gold" onClick={() => handleOpenModal('types', type)}><FiEdit2 size={14} /></button>
                                                <button className="btn btn-black btn-sm border-secondary hvr-danger" onClick={() => deleteItem('types', type.id)}><FiTrash2 size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeSection === 'faq' && (
                        <>
                            {renderHeader("Ecosystem FAQ", "Manage support content and knowledge assets.", <FiHelpCircle />, "faq")}
                            <div className="row g-4">
                                {faqs.length > 0 ? faqs.map(f => (
                                    <div key={f.id} className="col-12">
                                        <div className="bg-dark p-4 rounded-4 border border-secondary d-flex justify-content-between align-items-start hover-up">
                                            <div className="d-flex gap-3">
                                                <div className="bg-black p-2 rounded-3 text-gold mt-1"><FiHelpCircle size={18} /></div>
                                                <div>
                                                    <h6 className="fw-bold text-white mb-2">{f.question}</h6>
                                                    <p className="small text-muted mb-0">{f.answer}</p>
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-black btn-sm border-secondary hvr-gold" onClick={() => handleOpenModal('faq', f)}><FiEdit2 size={14} /></button>
                                                <button className="btn btn-black btn-sm border-secondary hvr-danger" onClick={() => deleteItem('faq', f.id)}><FiTrash2 size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-12 text-center py-5 text-muted opacity-50">
                                        <FiHelpCircle size={48} className="mb-3" />
                                        <p className="fw-bold">No FAQ assets configured yet.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Modal */}
            <div className="modal fade" id="taxModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content bg-charcoal border border-secondary rounded-4 shadow-lg">
                        <div className="modal-header border-bottom border-secondary p-4 bg-black">
                            <h5 className="modal-title fw-bold text-white d-flex align-items-center gap-2" style={{ color: '#fff !important' }}>
                                {activeSection === 'categories' ? <FiPlusSquare className="text-gold" /> :
                                    activeSection === 'types' ? <FiTag className="text-gold" /> :
                                        <FiHelpCircle className="text-gold" />}
                                {isEdit ? `Edit ${activeSection === 'faq' ? 'FAQ' : 'Taxonomy'}` : `Add ${activeSection === 'faq' ? 'FAQ' : 'Taxonomy'}`}
                            </h5>
                            <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="modal"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {activeItem && (
                                <div className="modal-body p-4">
                                    {(activeSection === 'categories' || activeSection === 'types') && (
                                        <>
                                            <div className="mb-4">
                                                <label className="form-label small fw-bold text-uppercase text-gold mb-2" style={{ letterSpacing: '1px' }}>Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control luxury-input"
                                                    value={activeItem.name}
                                                    onChange={(e) => setActiveItem({ ...activeItem, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                                    required
                                                />
                                            </div>
                                            {activeSection === 'types' && (
                                                <div className="mb-4">
                                                    <label className="form-label small fw-bold text-uppercase text-gold mb-2" style={{ letterSpacing: '1px' }}>Parent Category</label>
                                                    <select
                                                        className="form-select luxury-input"
                                                        value={activeItem.category}
                                                        onChange={(e) => setActiveItem({ ...activeItem, category: e.target.value })}
                                                    >
                                                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                                    </select>
                                                </div>
                                            )}
                                            <div className="mb-0">
                                                <label className="form-label small fw-bold text-uppercase text-gold mb-2" style={{ letterSpacing: '1px' }}>Slug</label>
                                                <input
                                                    type="text"
                                                    className="form-control luxury-input"
                                                    value={activeItem.slug}
                                                    onChange={(e) => setActiveItem({ ...activeItem, slug: e.target.value })}
                                                />
                                            </div>
                                        </>
                                    )}
                                    {activeSection === 'faq' && (
                                        <>
                                            <div className="mb-4">
                                                <label className="form-label small fw-bold text-uppercase text-gold mb-2" style={{ letterSpacing: '1px' }}>Question</label>
                                                <input
                                                    type="text"
                                                    className="form-control luxury-input"
                                                    value={activeItem.question}
                                                    onChange={(e) => setActiveItem({ ...activeItem, question: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-0">
                                                <label className="form-label small fw-bold text-uppercase text-gold mb-2" style={{ letterSpacing: '1px' }}>Answer</label>
                                                <textarea
                                                    className="form-control luxury-input"
                                                    rows="4"
                                                    value={activeItem.answer}
                                                    onChange={(e) => setActiveItem({ ...activeItem, answer: e.target.value })}
                                                    required
                                                ></textarea>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
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
                .hvr-gold:hover { color: #D4AF37 !important; border-color: #D4AF37 !important; }
                .hvr-danger:hover { color: #ff4d4d !important; border-color: #ff4d4d !important; }
                .text-gold { color: #D4AF37; }
                .hover-up:hover { transform: translateY(-5px); border-color: #D4AF37 !important; }
                .luxury-spinner {
                    width: 40px; height: 40px; border: 3px solid #222; border-top-color: #D4AF37; border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .transition-all { transition: all 0.3s ease; }
            `}</style>
        </div>
    );
};

export default ViewTaxonomies;
