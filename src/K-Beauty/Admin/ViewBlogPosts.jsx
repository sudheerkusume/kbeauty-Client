import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { loginStatus } from '../../App';
import { FiLayers, FiPlus, FiEdit2, FiTrash2, FiImage, FiFileText, FiX, FiCheck } from 'react-icons/fi';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import known assets for resolution
import blogImg1 from '../assets/BlogSection1.webp';
import blogImg2 from '../assets/BlogSection2.webp';
import blogImg3 from '../assets/BlogSection3.webp';
import blogImg4 from '../assets/Blogimage4.webp';

import API_BASE_URL from "../config";

const imageMap = {
    "BlogSection1.webp": blogImg1,
    "BlogSection2.webp": blogImg2,
    "BlogSection3.webp": blogImg3,
    "Blogimage4.webp": blogImg4
};

const ViewBlogPosts = () => {
    const { token } = useContext(loginStatus);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeBlog, setActiveBlog] = useState({
        title: "", category: "Skincare Tips", img: "BlogSection1.webp", Question: "", Answer: ""
    });
    const [blogImageFile, setBlogImageFile] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/blogs`);
            setBlogs(res.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Fetch blogs error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const deleteBlog = async (id) => {
        if (window.confirm("Delete this blog post?")) {
            try {
                await axios.delete(`${API_BASE_URL}/blogs/${id}`);
                fetchBlogs();
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    const handleOpenModal = (blog = null) => {
        if (blog) {
            setActiveBlog(blog);
            setIsEdit(true);
        } else {
            setActiveBlog({ title: "", category: "Skincare Tips", img: "BlogSection1.webp", Question: "", Answer: "" });
            setIsEdit(false);
        }
        setBlogImageFile(null); // Reset file selection
        const modal = new bootstrap.Modal(document.getElementById('blogModal'));
        modal.show();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            
            // Append blog data
            Object.keys(activeBlog).forEach(key => {
                if (key !== 'img') { // We handle img separately
                    formData.append(key, activeBlog[key]);
                }
            });

            if (!isEdit) {
                formData.append('id', Date.now().toString());
            }

            // Handle Image File
            if (blogImageFile) {
                formData.append('img', blogImageFile);
            } else {
                formData.append('img', activeBlog.img);
            }

            const config = {
                headers: {
                    'x-token': token
                }
            };

            if (isEdit) {
                await axios.put(`${API_BASE_URL}/blogs/${activeBlog._id || activeBlog.id}`, formData, config);
            } else {
                await axios.post(`${API_BASE_URL}/blogs`, formData, config);
            }
            bootstrap.Modal.getInstance(document.getElementById('blogModal')).hide();
            fetchBlogs();
        } catch (err) {
            alert("Save failed");
        }
    };

    const resolveImg = (img) => {
        if (!img) return null;
        if (img.startsWith('http') || img.startsWith('/') || img.startsWith('data:')) return img;
        return imageMap[img] || img;
    };

    return (
        <div className="animate-in">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold m-0" style={{ letterSpacing: '-1.5px', color: '#fff', fontSize: '2.5rem' }}>Blog Content</h2>
                    <p className="text-secondary mt-2 fw-medium">Manage your editorial stories and skincare guides.</p>
                </div>
                <button
                    className="btn btn-luxury-primary px-4 py-3 rounded-pill d-flex align-items-center gap-2"
                    onClick={() => handleOpenModal()}
                >
                    <FiPlus size={20} />
                    <span className="fw-bold text-uppercase" style={{ fontSize: '12px' }}>New Story</span>
                </button>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="luxury-spinner mx-auto mb-3"></div>
                </div>
            ) : (
                <div className="row g-4">
                    {blogs.map((blog) => {
                        const imgSrc = resolveImg(blog.img);
                        return (
                            <div className="col-12 col-md-6" key={blog.id}>
                                <div className="bg-dark rounded-4 overflow-hidden border border-secondary transition-all hover-up h-100 d-flex flex-column">
                                    <div className="position-relative" style={{ height: '240px' }}>
                                        <div className="position-absolute top-0 end-0 p-3 d-flex gap-2" style={{ zIndex: 10 }}>
                                            <button
                                                className="btn btn-black btn-sm rounded-3 p-2 border-secondary hvr-gold"
                                                onClick={() => handleOpenModal(blog)}
                                            >
                                                <FiEdit2 size={14} />
                                            </button>
                                            <button
                                                className="btn btn-black btn-sm rounded-3 p-2 border-secondary hvr-danger"
                                                onClick={() => deleteBlog(blog._id || blog.id)}
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                        <div className="w-100 h-100 bg-black d-flex align-items-center justify-content-center border-bottom border-secondary overflow-hidden">
                                            {imgSrc ? (
                                                <img src={imgSrc} alt={blog.title} className="w-100 h-100 object-fit-cover" />
                                            ) : (
                                                <div className="text-center">
                                                    <FiImage size={40} className="text-muted opacity-25 mb-2" />
                                                    <p className="small text-muted m-0">{blog.img || "No Media"}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-4 flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <span className="badge bg-gold-subtle text-gold border border-gold-low text-uppercase fw-bold p-2" style={{ fontSize: '10px' }}>{blog.category}</span>
                                            <span className="text-muted small">ID: {blog.id}</span>
                                        </div>
                                        <h5 className="fw-bold mb-3 text-white lh-base">{blog.title}</h5>
                                        <div className="text-muted small mb-0 line-clamp-3">
                                            <FiFileText size={14} className="me-2 text-gold" />
                                            {blog.Answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            <div className="modal fade" id="blogModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content bg-charcoal border border-secondary rounded-4 shadow-lg">
                        <div className="modal-header border-bottom border-secondary p-4 bg-black">
                            <h5 className="modal-title fw-bold text-white d-flex align-items-center gap-2" style={{ color: '#fff !important' }}>
                                <FiLayers className="text-gold" />
                                {isEdit ? "Refine Story" : "Initialize New Story"}
                            </h5>
                            <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="modal"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body p-4 p-md-5">
                                <div className="row g-4">
                                    <div className="col-md-8">
                                        <label className="form-label small fw-bold text-uppercase text-gold mb-2" style={{ letterSpacing: '1px' }}>Story Headline</label>
                                        <input
                                            type="text"
                                            className="form-control luxury-input"
                                            value={activeBlog.title}
                                            onChange={(e) => setActiveBlog({ ...activeBlog, title: e.target.value })}
                                            placeholder="Enter compelling title..."
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase text-gold mb-2" style={{ letterSpacing: '1px' }}>Topic Cluster</label>
                                        <select
                                            className="form-select luxury-input"
                                            value={activeBlog.category}
                                            onChange={(e) => setActiveBlog({ ...activeBlog, category: e.target.value })}
                                        >
                                            <option>Skincare Tips</option>
                                            <option>Brand Spotlight</option>
                                            <option>Beauty Guides</option>
                                            <option>Trend Analysis</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold text-uppercase text-gold mb-2" style={{ letterSpacing: '1px' }}>Visual Asset</label>
                                        <div className="p-4 border-2 border-dashed border-secondary rounded-4 bg-black-subtle text-center">
                                            <input 
                                                type="file" 
                                                id="blogImageInput" 
                                                className="d-none" 
                                                accept="image/*" 
                                                onChange={(e) => setBlogImageFile(e.target.files[0])} 
                                            />
                                            <label htmlFor="blogImageInput" className="pointer mb-0 w-100">
                                                {blogImageFile ? (
                                                    <div className="animate-in">
                                                        <img src={URL.createObjectURL(blogImageFile)} alt="Preview" className="rounded-4 shadow-lg mb-3" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                                                        <p className="small text-gold fw-bold mb-0">{blogImageFile.name}</p>
                                                    </div>
                                                ) : activeBlog.img && resolveImg(activeBlog.img) ? (
                                                    <div>
                                                        <img src={resolveImg(activeBlog.img)} alt="Current" className="rounded-4 shadow-sm mb-3 opacity-50" style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'cover' }} />
                                                        <p className="small text-muted mb-0">Click to replace current image</p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <FiImage size={32} className="text-muted opacity-50 mb-3" />
                                                        <p className="small text-muted fw-bold mb-0">Click to Upload Story Image</p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold text-uppercase text-gold mb-2" style={{ letterSpacing: '1px' }}>Lead Question</label>
                                        <input
                                            type="text"
                                            className="form-control luxury-input"
                                            value={activeBlog.Question}
                                            onChange={(e) => setActiveBlog({ ...activeBlog, Question: e.target.value })}
                                            placeholder="The hook statement..."
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold text-uppercase text-gold mb-2" style={{ letterSpacing: '1px' }}>Editorial Narrative</label>
                                        <textarea
                                            className="form-control luxury-input"
                                            rows="6"
                                            value={activeBlog.Answer}
                                            onChange={(e) => setActiveBlog({ ...activeBlog, Answer: e.target.value })}
                                            placeholder="Craft the story here..."
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-top border-secondary p-4 bg-black">
                                <button type="button" className="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Discard</button>
                                <button type="submit" className="btn btn-luxury-primary rounded-pill px-5 d-flex align-items-center gap-2">
                                    <FiCheck /> {isEdit ? "Apply Changes" : "Publish Story"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .bg-charcoal { background-color: #0d0d0d; }
                .bg-black-subtle { background-color: #050505; }
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
                .hvr-gold:hover { color: #D4AF37; border-color: #D4AF37 !important; }
                .hvr-danger:hover { color: #ff4d4d; border-color: #ff4d4d !important; }
                .bg-gold-subtle { background: rgba(212, 175, 55, 0.05); }
                .border-gold-low { border-color: rgba(212, 175, 55, 0.2) !important; }
                .text-gold { color: #D4AF37; }
                .hover-up:hover { transform: translateY(-8px); border-color: #D4AF37 !important; box-shadow: 0 15px 40px rgba(0,0,0,0.4); }
                .luxury-spinner {
                    width: 40px; height: 40px; border: 3px solid #222; border-top-color: #D4AF37; border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .line-clamp-3 {
                    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
                }
                .object-fit-cover { object-fit: cover; }
                .smaller { font-size: 0.75rem; }
            `}</style>
        </div>
    );
};

export default ViewBlogPosts;
