import React, { useEffect, useState, useContext, useMemo } from 'react';
import { loginStatus } from '../../App';
import toast from "react-hot-toast";
import API_BASE_URL from "../config";
import axios from 'axios';
import {
    FiEdit2, FiTrash2, FiSearch, FiPackage,
    FiAlertTriangle, FiTrendingUp, FiLayers, FiDollarSign,
    FiPlus, FiChevronRight, FiCheckCircle, FiInfo, FiTag, FiImage
} from 'react-icons/fi';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

const ViewProduct = () => {
    const { token } = useContext(loginStatus);
    const [category, setCategory] = useState("Skincare");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showLowStock, setShowLowStock] = useState(false);

    // Taxonomy States
    const [availableBrands, setAvailableBrands] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableTypes, setAvailableTypes] = useState([]);
    const dynamicCategories = availableCategories.map(c => c.name);

    // Taxonomy Add States
    const [taxName, setTaxName] = useState("");
    const [taxLogo, setTaxLogo] = useState("");
    const [taxLogoFile, setTaxLogoFile] = useState(null);
    const [taxCategory, setTaxCategory] = useState(""); // For adding new Type

    // For Edit Modal
    const [selected, setSelected] = useState({
        _id: "", title: "", brand: "", category: "Skincare", type: "", slug: "",
        price: "", offerPrice: "", size: "", stockQuantity: "", rating: 4.5,
        description: "", Country: "Korea", images: [], videoUrl: "",
        skinType: [], skinConcern: [], benefits: [], keyIngredients: [], howToUse: [],
        shippingInfo: "", faqs: [], bestseller: false,
        combo: { isCombo: false, productsIncluded: [], comboPrice: "", originalPrice: "", savings: "" }
    });


    // For Add Modal
    const [newProduct, setNewProduct] = useState({
        title: "", brand: "", category: "Skincare", type: "", slug: "",
        price: "", offerPrice: "", size: "", stockQuantity: "", rating: 4.5,
        description: "", Country: "Korea", images: [], videoUrl: "",
        skinType: [], skinConcern: [], benefits: [], keyIngredients: [], howToUse: [],
        shippingInfo: "", faqs: [], bestseller: false,
        combo: { isCombo: false, productsIncluded: [], comboPrice: "", originalPrice: "", savings: "" }
    });

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [isComboAddMode, setIsComboAddMode] = useState(false);

    // Tab Navigation State (0 to 4)
    const [addActiveTab, setAddActiveTab] = useState(0);
    const [editActiveTab, setEditActiveTab] = useState(0);
    const [isSaving, setIsSaving] = useState(false); // Global saving state (overlay)

    const tabsList = ["Basic Info", "Specifications", "Skin Profile", "Details & Usage", "Media & FAQ"];

    const generateSlug = (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const validateForm = (data) => {
        let errs = {};
        if (!data.title) errs.title = "Title is required";
        if (!data.brand) errs.brand = "Brand is required";
        if (!data.category) errs.category = "Category is required";
        
        // Price validation depends on combo mode
        if (data.combo?.isCombo) {
            if (!data.combo.comboPrice || data.combo.comboPrice <= 0) {
                errs.price = "Valid Bundle Offer Price is required";
            }
        } else {
            if (!data.price || data.price <= 0) {
                errs.price = "Valid price is required";
            }
        }
        return errs;
    };

    const fetchBrands = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/brands`);
            setAvailableBrands(res.data || []);
        } catch (err) { console.error("Fetch brands error:", err); }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/categories`);
            setAvailableCategories(res.data || []);
        } catch (err) { console.error("Fetch categories error:", err); }
    };

    const fetchTypes = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/types`);
            setAvailableTypes(res.data || []);
        } catch (err) { console.error("Fetch types error:", err); }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/products`);
            // Sorting by ID descending (Newest First) - using localeCompare for MongoDB _id
            const sortedProducts = (res.data || []).sort((a, b) => b._id.localeCompare(a._id));
            setProducts(sortedProducts);
            setLoading(false);
        } catch (err) {
            console.error("Fetch error:", err);
            setProducts([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchBrands();
        fetchCategories();
        fetchTypes();
    }, []);

    const deleteProduct = async (_id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`${API_BASE_URL}/products/${_id}`, {
                    headers: { 'x-token': token }
                });
                alert("Product deleted successfully");
                fetchProducts();
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    const getOneProduct = (_id) => {
        const prod = products.find((p) => p._id === _id);
        if (prod) {
            setSelected({ 
                ...prod,
                combo: prod.combo || { isCombo: false, productsIncluded: [], comboPrice: "", originalPrice: "", savings: "" }
            });
            setEditActiveTab(0); // Reset to first tab
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Prevent premature submission from enter key on non-final tabs
        if (editActiveTab !== 4) return;

        const validationErrors = validateForm(selected);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            alert("Please fix the errors before updating.");
            return;
        }

        setIsSaving(true);
        // Yield to main thread for 100ms to ensure the Loading Overlay paints before heavy FormData work
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const formData = new FormData();
            
            // Append all fields except files, arrays, and combo
            Object.keys(selected).forEach(key => {
                const excluded = ['id', '_id', 'slug', 'images', 'videoUrl', 'skinType', 'skinConcern', 'benefits', 'keyIngredients', 'howToUse', 'faqs', 'imageFiles', 'videoFile', 'combo'];
                if (selected.combo?.isCombo) excluded.push('price', 'offerPrice');

                if (!excluded.includes(key)) {
                    formData.append(key, selected[key]);
                }
            });

            // Handle Combo Object as JSON string for better backend compatibility
            if (selected.combo) {
                // Also ensure root fields are set for basic listing queries
                if (selected.combo.isCombo) {
                    formData.append('price', selected.combo.originalPrice);
                    formData.append('offerPrice', selected.combo.comboPrice);
                }
                formData.append('combo', JSON.stringify(selected.combo));
            }

            // Handle Existing Images (URLs)
            if (selected.images) {
                selected.images.forEach(img => {
                    if (typeof img === 'string' && img.startsWith('http')) {
                        formData.append('images', img);
                    }
                });
            }

            // Handle New Images (Files)
            if (selected.imageFiles) {
                selected.imageFiles.forEach(file => formData.append('images', file));
            }

            // Handle New Video (File)
            if (selected.videoFile) {
                formData.append('video', selected.videoFile);
            } else if (selected.videoUrl) {
                formData.append('videoUrl', selected.videoUrl);
            }

            await axios.put(`${API_BASE_URL}/products/${selected._id}`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'x-token': token
                }
            });
            alert("Product updated successfully");
            fetchProducts();
            setIsSaving(false);
            bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        } catch (err) { 
            alert("Update failed"); 
            setIsSaving(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        // Prevent premature submission from enter key on non-final tabs
        if (addActiveTab !== 4) return;

        const validationErrors = validateForm(newProduct);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            alert("Please fix the errors before creating.");
            return;
        }

        setIsSaving(true);
        setSubmitting(true);
        // Yield to main thread for 100ms to ensure the Loading Overlay paints before heavy FormData work
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const formData = new FormData();
            // ID is handled by MongoDB _id, legacy id field is optional
            formData.append('slug', newProduct.slug || newProduct.title.toLowerCase().replace(/\s+/g, '-'));

            // Append scalar fields (excluding price/offerPrice for combos to avoid duplicates)
            Object.keys(newProduct).forEach(key => {
                const excluded = ['id', 'slug', 'images', 'videoUrl', 'skinType', 'skinConcern', 'benefits', 'keyIngredients', 'howToUse', 'faqs', 'imageFiles', 'videoFile', 'combo'];
                if (newProduct.combo?.isCombo) excluded.push('price', 'offerPrice');

                if (!excluded.includes(key)) {
                    formData.append(key, newProduct[key]);
                }
            });

            // Handle Combo Object as JSON string for better backend compatibility
            if (newProduct.combo) {
                // Also ensure root fields are set for basic listing queries
                if (newProduct.combo.isCombo) {
                    formData.append('price', newProduct.combo.originalPrice);
                    formData.append('offerPrice', newProduct.combo.comboPrice);
                }
                formData.append('combo', JSON.stringify(newProduct.combo));
            }

            // Append Arrays
            ['skinType', 'skinConcern', 'benefits', 'keyIngredients', 'howToUse', 'faqs'].forEach(key => {
                if (newProduct[key]) {
                    newProduct[key].forEach(val => formData.append(key, val));
                }
            });

            // Append New Images (Files)
            if (newProduct.imageFiles) {
                newProduct.imageFiles.forEach(file => formData.append('images', file));
            }

            // Append New Video (File)
            if (newProduct.videoFile) {
                formData.append('video', newProduct.videoFile);
            }

            await axios.post(`${API_BASE_URL}/products`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'x-token': token
                }
            });
            alert("Success! Luxury SKU initialized.");
            fetchProducts();
            setIsSaving(false);
            bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
            setNewProduct({
                title: "", brand: "", category: "Skincare", type: "", slug: "",
                price: "", offerPrice: "", size: "", stockQuantity: "", rating: 4.5,
                description: "", Country: "Korea", images: [], videoUrl: "",
                skinType: [], skinConcern: [], benefits: [], keyIngredients: [], howToUse: [],
                shippingInfo: "", faqs: [], bestseller: false,
                combo: { isCombo: false, productsIncluded: [], comboPrice: "", originalPrice: "", savings: "" }
            });
        } catch (err) { 
            alert("Addition failed"); 
            setIsSaving(false);
        }
        finally { setSubmitting(false); }
    };

    // --- DYNAMIC ARRAY HELPERS ---
    const handleArrayChange = (isEdit, field, index, value) => {
        const state = isEdit ? selected : newProduct;
        const setState = isEdit ? setSelected : setNewProduct;

        if (field.startsWith('combo.')) {
            const subField = field.split('.')[1];
            const updatedArray = [...state.combo[subField]];
            updatedArray[index] = value;
            setState({ ...state, combo: { ...state.combo, [subField]: updatedArray } });
        } else {
            const updatedArray = [...state[field]];
            updatedArray[index] = value;
            setState({ ...state, [field]: updatedArray });
        }
    };

    const addArrayItem = (isEdit, field) => {
        const state = isEdit ? selected : newProduct;
        const setState = isEdit ? setSelected : setNewProduct;

        if (field.startsWith('combo.')) {
            const subField = field.split('.')[1];
            const currentArray = (state.combo && Array.isArray(state.combo[subField])) ? state.combo[subField] : [];
            setState({ ...state, combo: { ...state.combo, [subField]: [...currentArray, ""] } });
        } else {
            const currentArray = Array.isArray(state[field]) ? state[field] : [];
            setState({ ...state, [field]: [...currentArray, ""] });
        }
    };

    const removeArrayItem = (isEdit, field, index) => {
        const state = isEdit ? selected : newProduct;
        const setState = isEdit ? setSelected : setNewProduct;

        if (field.startsWith('combo.')) {
            const subField = field.split('.')[1];
            const updatedArray = state.combo[subField].filter((_, i) => i !== index);
            setState({ ...state, combo: { ...state.combo, [subField]: updatedArray } });
        } else {
            const updatedArray = state[field].filter((_, i) => i !== index);
            setState({ ...state, [field]: updatedArray });
        }
    };

    const handleComboChange = (isEdit, e) => {
        const { name, value, type, checked } = e.target;
        const state = isEdit ? selected : newProduct;
        const setState = isEdit ? setSelected : setNewProduct;
        const key = name.replace('combo.', '');
        
        const currentCombo = state.combo || { isCombo: false, productsIncluded: [], comboPrice: "", originalPrice: "", savings: "" };
        
        const newVal = type === "checkbox" ? checked : value;
        const updatedCombo = { ...currentCombo, [key]: newVal };

        // Auto-calculate Savings
        if (key === 'comboPrice' || key === 'originalPrice') {
            const cp = parseFloat(key === 'comboPrice' ? newVal : updatedCombo.comboPrice) || 0;
            const op = parseFloat(key === 'originalPrice' ? newVal : updatedCombo.originalPrice) || 0;
            updatedCombo.savings = Math.max(0, op - cp);
        }

        setState({ ...state, combo: updatedCombo });
    };

    const handleDualProductChange = (isEdit, index, value) => {
        const state = isEdit ? selected : newProduct;
        const setState = isEdit ? setSelected : setNewProduct;
        
        const updatedIncluded = [...(state.combo?.productsIncluded || ["", ""])];
        updatedIncluded[index] = value;
        
        // Auto-generate Title
        const p1 = updatedIncluded[0]?.trim() || "";
        const p2 = updatedIncluded[1]?.trim() || "";
        const autoTitle = p1 && p2 ? `${p1} + ${p2}` : (p1 || p2 || "");

        setState({
            ...state,
            title: autoTitle,
            slug: generateSlug(autoTitle),
            combo: {
                ...(state.combo || {}),
                productsIncluded: updatedIncluded
            }
        });
    };

    const handleFileChange = (isEdit, e) => {
        const { name, files } = e.target;
        const state = isEdit ? selected : newProduct;
        const setState = isEdit ? setSelected : setNewProduct;

        if (name === "images") {
            const newFiles = Array.from(files);
            setState({
                ...state,
                imageFiles: [...(state.imageFiles || []), ...newFiles]
            });
        } else if (name === "video") {
            setState({
                ...state,
                videoFile: files[0]
            });
        }
    };

    const removeNewFile = (isEdit, type, index) => {
        const state = isEdit ? selected : newProduct;
        const setState = isEdit ? setSelected : setNewProduct;

        if (type === "images") {
            const updated = state.imageFiles.filter((_, i) => i !== index);
            setState({ ...state, imageFiles: updated });
        } else if (type === "video") {
            setState({ ...state, videoFile: null });
        }
    };

    const renderArrayFields = (isEdit, field, label, placeholder) => {
        const state = isEdit ? selected : newProduct;
        return (
            <div className="col-12 mb-2 p-3 bg-dark rounded-4 border border-secondary shadow-sm transition-all hover-up-small">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                        <div className="p-2 bg-black rounded-circle shadow-sm text-gold d-flex">
                            {field === 'images' ? <FiImage size={14} /> : field === 'keyIngredients' ? <FiTag size={14} /> : <FiLayers size={14} />}
                        </div>
                        <label className="fw-bold small text-white text-uppercase m-0" style={{ letterSpacing: '0.5px' }}>{label}</label>
                    </div>
                    <button
                        type="button"
                        className="btn btn-luxury-primary-small rounded-pill px-3 py-1 d-flex align-items-center gap-2"
                        onClick={() => addArrayItem(isEdit, field)}
                        style={{ fontSize: '11px', fontWeight: '800' }}
                    >
                        <FiPlus size={12} /> ADD ITEM
                    </button>
                </div>
                <div className="d-flex flex-column gap-2">
                    {state[field]?.map((item, idx) => (
                        <div key={idx} className="animate-in">
                            <div className="d-flex gap-2 align-items-center mb-2">
                                <div className="small fw-bold text-muted opacity-50" style={{ width: '20px' }}>{idx + 1}.</div>
                                <input
                                    className="form-control luxury-input flex-grow-1"
                                    style={{ height: '44px', padding: '0 18px', fontSize: '13px' }}
                                    value={item}
                                    placeholder={`${placeholder}...`}
                                    onChange={(e) => handleArrayChange(isEdit, field, idx, e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-white shadow-sm border-0 rounded-circle d-flex align-items-center justify-content-center"
                                    onClick={() => removeArrayItem(isEdit, field, idx)}
                                    style={{ width: '32px', height: '32px' }}
                                >
                                    <FiTrash2 size={12} className="text-danger" />
                                </button>
                            </div>
                            {field === 'images' && item && typeof item === 'string' && (
                                <div className="ms-4 mb-3 rounded-3 overflow-hidden border border-secondary shadow-sm bg-black" style={{ width: '80px', height: '80px' }}>
                                    <img src={item} alt="Preview" className="w-100 h-100" style={{ objectFit: 'cover' }} onError={(e) => e.target.src = 'https://via.placeholder.com/80?text=Invalid'} />
                                </div>
                            )}
                        </div>
                    ))}
                    {(!state[field] || state[field].length === 0) && (
                        <div className="text-center py-2">
                            <p className="text-muted small m-0 italic">No entries yet. Add your first {label.toLowerCase()}.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const onEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        let updated = { ...selected };
        if (type === "checkbox") {
            updated[name] = checked;
        } else {
            updated[name] = value;
            if (name === "title") updated.slug = generateSlug(value);
            if (name === "category") updated.type = ""; // Reset type on category change
        }
        setSelected(updated);
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    const onCreateChange = (e) => {
        const { name, value, type, checked } = e.target;
        let updated = { ...newProduct };
        if (type === "checkbox") {
            updated[name] = checked;
        } else {
            updated[name] = value;
            if (name === "title") updated.slug = generateSlug(value);
            if (name === "category") updated.type = ""; // Reset type on category change
        }
        setNewProduct(updated);
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesCategory = p.category === category;
            const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStock = showLowStock ? p.stockQuantity < 5 : true;
            return matchesCategory && matchesSearch && matchesStock;
        });
    }, [products, category, searchTerm, showLowStock]);

    const stats = useMemo(() => ({
        total: products.length,
        lowStock: products.filter(p => p.stockQuantity < 5).length,
        avgPrice: products.length ? Math.round(products.reduce((acc, p) => acc + Number(p.offerPrice), 0) / products.length) : 0
    }), [products]);


    return (
        <div className='container-fluid p-0' style={{ fontFamily: "'Inter', sans-serif", color: '#fff' }}>

            {/* ── HEADER AESTHETICS ── */}
            <div className="d-flex justify-content-between align-items-end mb-5">
                <div>
                    <h2 className="fw-bold m-0" style={{ letterSpacing: '-1.5px', color: '#fff', fontSize: '2.5rem' }}>Inventory Hub</h2>
                    <p className="text-secondary mt-2 fw-medium">Manage your premium K-Beauty collection with ease.</p>
                </div>
                <div className="d-flex gap-3">
                    <button
                        className="btn btn-luxury-primary d-flex align-items-center gap-3 px-4 py-3 shadow-lg rounded-pill animate-float"
                        data-bs-toggle="modal"
                        data-bs-target="#addModal"
                        onClick={() => {
                            setAddActiveTab(0);
                            setErrors({});
                            setIsComboAddMode(false);
                            setNewProduct(prev => ({ ...prev, combo: { ...prev.combo, isCombo: false } }));
                        }}
                    >
                        <FiPlus size={20} />
                        <span className="fw-bold">Create Product</span>
                    </button>
                    <button
                        className="btn btn-gold d-flex align-items-center gap-3 px-4 py-3 shadow-lg rounded-pill animate-float"
                        style={{ background: '#D4AF37', color: '#000', border: 'none' }}
                        data-bs-toggle="modal"
                        data-bs-target="#addModal"
                        onClick={() => {
                            setAddActiveTab(0); // Start at Basic Info to name products
                            setErrors({});
                            setIsComboAddMode(true);
                            setNewProduct(prev => ({ 
                                ...prev, 
                                title: "", 
                                slug: "",
                                combo: { ...(prev.combo || {}), isCombo: true, productsIncluded: ["", ""] } 
                            }));
                        }}
                    >
                        <FiLayers size={20} />
                        <span className="fw-bold">Create Combo</span>
                    </button>
                </div>
            </div>

            {/* ── STATS COMMAND CENTER ── */}
            {/* ── COMMAND BAR ── */}
            <div className="bg-black p-3 rounded-4 shadow-sm border border-secondary mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="category-tabs d-flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
                        {availableCategories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => setCategory(cat.name)}
                            className={`btn px-4 py-2 rounded-3 border-0 transition-all flex-shrink-0 ${category === cat.name ? 'bg-luxury-gold text-dark fw-bold shadow-sm' : 'bg-dark text-secondary fw-semibold'
                                 }`}
                            style={{ fontSize: '13px', whiteSpace: 'nowrap' }}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="d-flex gap-3 align-items-center flex-grow-1 flex-wrap">
                    <div className="position-relative flex-grow-1" style={{ minWidth: '200px' }}>
                        <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ zIndex: 10 }} />
                        <input
                            type="text"
                            className="form-control ps-5 border-0 luxury-input"
                            placeholder="Search catalog..."
                            style={{ fontSize: '15px', fontWeight: '700', height: '50px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="d-flex align-items-center bg-dark rounded-pill px-4" style={{ height: '50px', border: '1px solid #333' }}>
                        <div className="form-check form-switch m-0 d-flex align-items-center gap-3">
                            <input
                                className="form-check-input pointer"
                                type="checkbox"
                                id="lowStockToggle"
                                checked={showLowStock}
                                onChange={(e) => setShowLowStock(e.target.checked)}
                                style={{ width: '40px', height: '20px' }}
                            />
                            <label className="form-check-label text-white small fw-bold text-uppercase pointer" htmlFor="lowStockToggle" style={{ letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                                Low Stock <span className="text-danger ms-1">({stats.lowStock})</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── PRODUCT MANAGEMENT LIST ── */}
            <div className="bg-black rounded-4 shadow-sm overflow-hidden border border-secondary">
                <div className="table-responsive">
                    <table className='table table-hover align-middle mb-0 text-white'>
                        <thead className='bg-dark text-secondary'>
                            <tr style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                                <th className="ps-4 py-4 border-0">Product Details</th>
                                <th className="py-4 border-0">Pricing</th>
                                <th className="py-4 border-0">Stock Status</th>
                                <th className="pe-4 py-4 border-0 text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5">
                                        <div className="luxury-spinner mx-auto mb-3"></div>
                                        <span className="text-muted small fw-bold">Synchronizing...</span>
                                    </td>
                                </tr>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((p) => (
                                    <tr key={p._id} className="transition-all">
                                        <td className="ps-4 py-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="inventory-img-container p-1 rounded-3 bg-dark" style={{ width: 56, height: 56 }}>
                                                    <img
                                                        src={p.images?.[0] || 'https://via.placeholder.com/100'}
                                                        alt=""
                                                        className="w-100 h-100 rounded-2"
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <div>
                                                    <h6 className='m-0 fw-bold text-white' style={{ fontSize: '14px' }}>{p.title}</h6>
                                                    <span className="text-secondary small fw-medium">{p.brand} · SKU:{p._id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="fw-bold text-white" style={{ fontSize: '15px' }}>₹{p.offerPrice}</div>
                                            <div className="text-secondary small">MSRP: ₹{p.price}</div>
                                        </td>
                                        <td className="py-4">
                                            <div className="d-flex flex-column gap-2" style={{ width: '120px' }}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className={`fw-bold small ${p.stockQuantity < 5 ? 'text-danger' : 'text-success'}`}>
                                                        {p.stockQuantity} Units
                                                    </span>
                                                </div>
                                                <div className="progress rounded-pill bg-dark" style={{ height: '4px' }}>
                                                    <div
                                                        className={`progress-bar rounded-pill ${p.stockQuantity < 5 ? 'bg-danger' : 'bg-success'}`}
                                                        style={{ width: `${Math.min((p.stockQuantity / 20) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="pe-4 py-4 text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                    <button
                                                        className='btn btn-dark border-secondary rounded-3 p-2'
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#editModal"
                                                        onClick={() => getOneProduct(p._id)}
                                                    >
                                                        <FiEdit2 size={14} className="text-gold" />
                                                    </button>
                                                    <button
                                                        className='btn btn-dark border-secondary rounded-3 p-2'
                                                        onClick={() => deleteProduct(p._id)}
                                                    >
                                                        <FiTrash2 size={14} className="text-danger" />
                                                    </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-5">
                                        <FiPackage size={48} className="text-muted mb-3 opacity-25" />
                                        <h6 className="text-muted fw-bold">No Products Found</h6>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="modal fade" id="addModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <form className="modal-content border-0 shadow-lg rounded-5 overflow-hidden" onSubmit={handleCreate}>
                        <div className="bg-white p-4 border-bottom border-light">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="fw-bold m-0" style={{ letterSpacing: '-1px' }}>
                                        {isComboAddMode ? 'Create New Combo Bundle' : 'Create New SKU'}
                                    </h4>
                                    <div className="d-flex align-items-center gap-2 mt-1">
                                        <div className="badge bg-primary-subtle text-primary rounded-pill px-3">Step {addActiveTab + 1} of 5</div>
                                        <p className="text-muted small m-0">{tabsList[addActiveTab]}</p>
                                    </div>
                                </div>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                        </div>

                        <div className="modal-body p-0">
                            {/* --- TABS NAVIGATION (READ-ONLY) --- */}
                            <ul className="nav nav-tabs px-4 pt-3 bg-light border-0 flex-nowrap overflow-x-auto" id="addTabs" role="tablist" style={{ whiteSpace: 'nowrap', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                                {tabsList.map((tab, idx) => (
                                    <li key={idx} className="nav-item me-3" role="presentation">
                                        <button
                                            className={`nav-link fw-bold small text-uppercase border-0 h-100 px-3 py-2 rounded-top-3 ${addActiveTab === idx ? 'active text-primary border-bottom border-primary border-3 bg-white' : 'text-muted opacity-50'}`}
                                            type="button"
                                            onClick={() => setAddActiveTab(idx)}
                                        >
                                            {idx + 1}. {tab.split(' ')[0]}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="tab-content" id="addTabsContent">
                                {/* TAB 1: BASIC INFO */}
                                <div className={`tab-pane fade p-4 pt-5 ${addActiveTab === 0 ? 'show active' : ''}`}>
                                    <div className="row g-4">
                                        {isComboAddMode ? (
                                            <div className="col-12">
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <div className="p-3 bg-dark rounded-4 border border-secondary border-dashed" style={{ borderStyle: 'dashed' }}>
                                                            <label className="fw-bold small text-gold mb-2 text-uppercase d-flex align-items-center gap-2">
                                                                <div className="bg-gold text-dark rounded-circle d-flex align-items-center justify-content-center" style={{ width: '18px', height: '18px', fontSize: '10px' }}>1</div>
                                                                Product 1 Details
                                                            </label>
                                                            <input 
                                                                className="form-control luxury-input mb-2" 
                                                                placeholder="Enter title for first product..."
                                                                value={newProduct.combo?.productsIncluded?.[0] || ""}
                                                                onChange={(e) => handleDualProductChange(false, 0, e.target.value)}
                                                            />
                                                            <select className="form-select luxury-input small" name="brand" value={newProduct.brand} onChange={onCreateChange}>
                                                                <option value="">Select Brand</option>
                                                                {availableBrands.map(b => <option key={b._id} value={b.name}>{b.name}</option>)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="p-3 bg-dark rounded-4 border border-secondary border-dashed" style={{ borderStyle: 'dashed' }}>
                                                            <label className="fw-bold small text-gold mb-2 text-uppercase d-flex align-items-center gap-2">
                                                                <div className="bg-gold text-dark rounded-circle d-flex align-items-center justify-content-center" style={{ width: '18px', height: '18px', fontSize: '10px' }}>2</div>
                                                                Product 2 Details
                                                            </label>
                                                            <input 
                                                                className="form-control luxury-input mb-2" 
                                                                placeholder="Enter title for second product..."
                                                                value={newProduct.combo?.productsIncluded?.[1] || ""}
                                                                onChange={(e) => handleDualProductChange(false, 1, e.target.value)}
                                                            />
                                                            <select className="form-select luxury-input small" value={newProduct.brand} onChange={onCreateChange}>
                                                                <option value="">Select Brand</option>
                                                                {availableBrands.map(b => <option key={b._id} value={b.name}>{b.name}</option>)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                {newProduct.title && (
                                                    <div className="mt-3 p-2 bg-light rounded text-center">
                                                        <small className="text-muted fw-bold">SKU TITLE: <span className="text-dark">{newProduct.title}</span></small>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <div className="col-md-6">
                                                    <label className="fw-bold small text-muted mb-2 text-uppercase">Product Title*</label>
                                                    <input name="title" value={newProduct.title} onChange={onCreateChange} className={`form-control luxury-input ${errors.title ? 'is-invalid' : ''}`} placeholder="e.g. Rice Water Bright Foam" />
                                                    {errors.title && <div className="invalid-feedback fw-bold small">{errors.title}</div>}
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="fw-bold small text-muted mb-2 text-uppercase">Slug (Auto-generated)</label>
                                                    <input name="slug" value={newProduct.slug} onChange={onCreateChange} className="form-control luxury-input bg-light" readOnly placeholder="auto-generated-slug" />
                                                </div>
                                            </>
                                        )}
                                        <div className="col-md-4">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase d-flex justify-content-between">Brand* <FiPlus className="text-primary pointer" onClick={() => { bootstrap.Modal.getOrCreateInstance(document.getElementById('brandAddModal')).show(); }} /></label>
                                            <select name="brand" value={newProduct.brand} onChange={onCreateChange} className={`form-select luxury-input ${errors.brand ? 'is-invalid' : ''}`}>
                                                <option value="">Select Brand</option>
                                                {availableBrands.map(b => <option key={b._id} value={b.name}>{b.name}</option>)}
                                            </select>
                                            {errors.brand && <div className="invalid-feedback fw-bold small">{errors.brand}</div>}
                                        </div>
                                        <div className="col-md-4">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase d-flex justify-content-between">Category* <FiPlus className="text-secondary pointer" onClick={() => { bootstrap.Modal.getOrCreateInstance(document.getElementById('categoryAddModal')).show(); }} /></label>
                                            <select name="category" value={newProduct.category} onChange={onCreateChange} className={`form-select luxury-input ${errors.category ? 'is-invalid' : ''}`}>
                                                <option value="">Select Category</option>
                                                {availableCategories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                                            </select>
                                            {errors.category && <div className="invalid-feedback fw-bold small">{errors.category}</div>}
                                        </div>
                                        <div className="col-md-4">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase d-flex justify-content-between">Type <FiPlus className="text-info pointer" onClick={() => { bootstrap.Modal.getOrCreateInstance(document.getElementById('typeAddModal')).show(); }} /></label>
                                            <select name="type" value={newProduct.type} onChange={onCreateChange} className="form-select luxury-input">
                                                <option value="">Select Type</option>
                                                {availableTypes.filter(t => t.category === newProduct.category).map(t => (
                                                    <option key={t._id || t.id} value={t.name}>{t.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {!isComboAddMode && (
                                            <>
                                                <div className="col-md-6">
                                                    <label className="fw-bold small text-muted mb-2 text-uppercase">Price (MSRP)*</label>
                                                    <input type="number" name="price" value={newProduct.price} onChange={onCreateChange} className={`form-control luxury-input ${errors.price ? 'is-invalid' : ''}`} placeholder="0" />
                                                    {errors.price && <div className="invalid-feedback fw-bold small">{errors.price}</div>}
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="fw-bold small text-muted mb-2 text-uppercase">Offer Price</label>
                                                    <input type="number" name="offerPrice" value={newProduct.offerPrice} onChange={onCreateChange} className="form-control luxury-input" placeholder="0" />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* TAB 2: SPECIFICATIONS */}
                                <div className={`tab-pane fade p-4 pt-5 ${addActiveTab === 1 ? 'show active' : ''}`}>
                                    <div className="row g-4">
                                        <div className="col-md-4">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase">Stock Quantity</label>
                                            <input type="number" name="stockQuantity" value={newProduct.stockQuantity} onChange={onCreateChange} className="form-control luxury-input" placeholder="0" />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase">Size / Vol</label>
                                            <input name="size" value={newProduct.size} onChange={onCreateChange} className="form-control luxury-input" placeholder="e.g. 50ml" />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase">Origin Country</label>
                                            <select name="Country" value={newProduct.Country} onChange={onCreateChange} className="form-select luxury-input">
                                                <option value="Korea">Korea</option>
                                                <option value="India">India</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase">Initial Rating (1-5)</label>
                                            <input type="number" step="0.1" name="rating" value={newProduct.rating} onChange={onCreateChange} className="form-control luxury-input" placeholder="4.5" />
                                        </div>
                                        <div className="col-md-6 d-flex align-items-center mt-5">
                                            <div className="form-check form-switch ps-5">
                                                <input className="form-check-input" type="checkbox" name="bestseller" checked={newProduct.bestseller} onChange={onCreateChange} />
                                                <label className="form-check-label fw-bold small text-muted text-uppercase ms-2">Bestseller Item</label>
                                            </div>
                                        </div>

                                        <div className="col-12 border-top border-light mt-4 pt-4">
                                            <div className="form-check form-switch ps-5 mb-4">
                                                <input 
                                                    className="form-check-input" 
                                                    type="checkbox" 
                                                    name="combo.isCombo" 
                                                    checked={newProduct.combo?.isCombo || false} 
                                                    onChange={(e) => !isComboAddMode && handleComboChange(false, e)} 
                                                    disabled={isComboAddMode}
                                                />
                                                <label className="form-check-label fw-bold small text-muted text-uppercase ms-2">Combo Product (Bundle Deal)</label>
                                            </div>
                                            {newProduct.combo?.isCombo && (
                                                <div className="row g-4 animate-in">
                                                    <div className="col-12">
                                                        <div className="alert alert-gold py-3 small d-flex align-items-center gap-3 border-0 rounded-4" style={{ background: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.2) !important' }}>
                                                            <FiInfo size={18} /> 
                                                            <div>
                                                                <strong className="d-block mb-1">PRO BUNDLE TIP:</strong>
                                                                The first 2 images you upload in the Media tab will form the side-by-side Duo Visual. Ensure they match your product naming order!
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="fw-bold small text-gold mb-2 text-uppercase font-poppins">Total M.R.P. (Sum)*</label>
                                                        <input type="number" name="combo.originalPrice" value={newProduct.combo.originalPrice} onChange={(e) => handleComboChange(false, e)} className="form-control luxury-input border-gold-subtle" placeholder="0" />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="fw-bold small text-gold mb-2 text-uppercase font-poppins">Bundle Offer Price*</label>
                                                        <input type="number" name="combo.comboPrice" value={newProduct.combo.comboPrice} onChange={(e) => handleComboChange(false, e)} className="form-control luxury-input border-gold-subtle" placeholder="0" />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="fw-bold small text-muted mb-2 text-uppercase font-poppins">Auto-Calculated Savings</label>
                                                        <div className="form-control luxury-input bg-black border-secondary text-gold fw-bold d-flex align-items-center" style={{ height: '48px' }}>
                                                            ₹{newProduct.combo.savings || 0}
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        {renderArrayFields(false, "combo.productsIncluded", "Products in this Bundle (Names)", "e.g. Skin Toner")}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* TAB 3: SKIN PROFILE */}
                                <div className={`tab-pane fade p-4 pt-5 ${addActiveTab === 2 ? 'show active' : ''}`}>
                                    <div className="row g-4">
                                        <div className="col-md-6 border-end border-light">
                                            {renderArrayFields(false, "skinType", "Skin Concern Target", "e.g. Oily Skin")}
                                        </div>
                                        <div className="col-md-6">
                                            {renderArrayFields(false, "skinConcern", "Specific Concerns", "e.g. Acne")}
                                        </div>
                                        <div className="col-12 border-top border-light mt-4 pt-4">
                                            {renderArrayFields(false, "benefits", "Key Product Benefits", "e.g. Deep Cleansing")}
                                        </div>
                                    </div>
                                </div>

                                {/* TAB 4: DETAILS */}
                                <div className={`tab-pane fade p-4 pt-5 ${addActiveTab === 3 ? 'show active' : ''}`}>
                                    <div className="row g-4">
                                        <div className="col-12">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase">Description</label>
                                            <textarea name="description" value={newProduct.description} onChange={onCreateChange} className="form-control luxury-input h-auto py-3 rounded-4" rows="4"></textarea>
                                        </div>
                                        <div className="col-md-6 border-end border-light">
                                            {renderArrayFields(false, "keyIngredients", "Key Ingredients", "e.g. Niacinamide")}
                                        </div>
                                        <div className="col-md-6">
                                            {renderArrayFields(false, "howToUse", "Application Steps", "Step Description")}
                                        </div>
                                    </div>
                                </div>

                                {/* TAB 5: MEDIA */}
                                <div className={`tab-pane fade p-4 pt-5 ${addActiveTab === 4 ? 'show active' : ''}`}>
                                    <div className="row g-4">
                                        <div className="col-12 mb-4">
                                            <label className="fw-bold small text-muted mb-3 text-uppercase d-flex align-items-center gap-2">
                                                <FiImage /> Product Image Gallery
                                            </label>
                                            <div className="p-4 border-2 border-dashed rounded-4 text-center bg-light transition-all hover-shadow" style={{ borderStyle: 'dashed' }}>
                                                <input
                                                    type="file"
                                                    id="addImages"
                                                    name="images"
                                                    multiple
                                                    className="d-none"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(false, e)}
                                                />
                                                <label htmlFor="addImages" className="pointer mb-0">
                                                    <div className="p-3 bg-white rounded-circle shadow-sm mx-auto mb-3" style={{ width: '60px' }}>
                                                        <FiPlus size={24} className="text-primary" />
                                                    </div>
                                                    <h6 className="fw-bold">Upload Images</h6>
                                                    <p className="text-muted small mb-0">Drag and drop or click to select multiple files</p>
                                                </label>
                                            </div>

                                            {/* Previews for new files */}
                                            <div className="d-flex flex-wrap gap-4 mt-4">
                                                {newProduct.imageFiles?.map((file, idx) => (
                                                    <div key={idx} className="position-relative animate-in" style={{ width: '120px', height: '120px' }}>
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt=""
                                                            className="w-100 h-100 rounded-4 shadow-lg border-2"
                                                            style={{ objectFit: 'cover', borderColor: (newProduct.combo?.isCombo && idx < 2) ? '#D4AF37' : '#2c2c2c' }}
                                                        />
                                                        {newProduct.combo?.isCombo && idx < 2 && (
                                                            <div className="position-absolute top-0 start-50 translate-middle-x bg-gold text-dark fw-bold px-3 py-1 rounded-pill shadow" style={{ fontSize: '10px', zIndex: 10, marginTop: '-10px', whiteSpace: 'nowrap', backgroundColor: '#D4AF37' }}>
                                                                SLOT {idx + 1}
                                                            </div>
                                                        )}
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 translate-middle shadow-lg p-0 d-flex align-items-center justify-content-center"
                                                            style={{ width: '30px', height: '30px', zIndex: 11 }}
                                                            onClick={() => removeNewFile(false, 'images', idx)}
                                                        >
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="col-12 mb-4">
                                            <label className="fw-bold small text-muted mb-3 text-uppercase d-flex align-items-center gap-2">
                                                <FiPackage /> Product Video (Optional)
                                            </label>
                                            <div className="p-4 border-2 border-dashed rounded-4 text-center bg-light" style={{ borderStyle: 'dashed' }}>
                                                <input
                                                    type="file"
                                                    id="addVideo"
                                                    name="video"
                                                    className="d-none"
                                                    accept="video/*"
                                                    onChange={(e) => handleFileChange(false, e)}
                                                />
                                                {!newProduct.videoFile ? (
                                                    <label htmlFor="addVideo" className="pointer mb-0">
                                                        <div className="p-3 bg-white rounded-circle shadow-sm mx-auto mb-3" style={{ width: '60px' }}>
                                                            <FiPlus size={24} className="text-success" />
                                                        </div>
                                                        <h6 className="fw-bold text-success">Add Video</h6>
                                                        <p className="text-muted small mb-0">Select a beauty showcase video (Max 50MB)</p>
                                                    </label>
                                                ) : (
                                                    <div className="position-relative mx-auto" style={{ maxWidth: '300px' }}>
                                                        <video
                                                            src={URL.createObjectURL(newProduct.videoFile)}
                                                            className="w-100 rounded-4 shadow-sm"
                                                            controls
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm rounded-pill position-absolute top-0 end-0 m-2 shadow-sm d-flex align-items-center gap-2"
                                                            onClick={() => removeNewFile(false, 'video')}
                                                        >
                                                            <FiTrash2 size={12} /> Remove Video
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase">Shipping Information</label>
                                            <input name="shippingInfo" value={newProduct.shippingInfo} onChange={onCreateChange} className="form-control luxury-input" placeholder="Standard shipping applies." />
                                        </div>
                                        <div className="col-12 border-top border-light mt-4 pt-4">
                                            {renderArrayFields(false, "faqs", "Product FAQ", "Question content")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer bg-light border-0 p-4 gap-3">
                            {addActiveTab > 0 && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
                                    style={{ height: '50px' }}
                                    onClick={() => setAddActiveTab(prev => prev - 1)}
                                >
                                    Back
                                </button>
                            )}

                            {addActiveTab < 4 && (
                                <button
                                    key="next-btn"
                                    type="button"
                                    className="btn btn-primary rounded-pill flex-grow-1 shadow-sm fw-bold border-0 fs-5"
                                    style={{ height: '60px' }}
                                    onClick={() => setAddActiveTab(prev => prev + 1)}
                                >
                                    Next Stage
                                </button>
                            )}
                            {addActiveTab === 4 && (
                                <button
                                    key="submit-btn"
                                    type="submit"
                                    className="btn btn-luxury-primary flex-grow-1 shadow-sm fw-bold border-0 fs-5 rounded-4"
                                    style={{ height: '60px' }}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Creating SKU...' : 'Complete Initialization'}
                                </button>
                            )}

                        </div>
                    </form>
                </div>
            </div>

            {/* ── EDIT MODAL ── */}
            <div className="modal fade" id="editModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <form className="modal-content border-0 shadow-lg rounded-5 overflow-hidden" onSubmit={handleUpdate}>
                        <div className="bg-white p-4 border-bottom border-light">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="fw-bold m-0" style={{ letterSpacing: '-1px' }}>Update Inventory</h4>
                                    <div className="d-flex align-items-center gap-2 mt-1">
                                        <div className="badge bg-secondary-subtle text-secondary rounded-pill px-3">Step {editActiveTab + 1} of 5</div>
                                        <p className="text-muted small m-0">{tabsList[editActiveTab]}</p>
                                    </div>
                                </div>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                        </div>

                        <div className="modal-body p-0">
                            {/* --- TABS NAVIGATION (READ-ONLY) --- */}
                            <ul className="nav nav-tabs px-4 pt-3 bg-light border-0 flex-nowrap overflow-x-auto" id="editTabs" role="tablist" style={{ whiteSpace: 'nowrap', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                                {tabsList.map((tab, idx) => (
                                    <li key={idx} className="nav-item me-3" role="presentation">
                                        <button
                                            className={`nav-link fw-bold small text-uppercase border-0 h-100 px-3 py-2 rounded-top-3 ${editActiveTab === idx ? 'active text-primary border-bottom border-primary border-3 bg-white' : 'text-muted opacity-50'}`}
                                            type="button"
                                            onClick={() => setEditActiveTab(idx)}
                                        >
                                            {idx + 1}. {tab.split(' ')[0]}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="tab-content" id="editTabsContent">
                                {/* TAB 1: BASIC INFO */}
                                <div className={`tab-pane fade p-4 pt-5 ${editActiveTab === 0 ? 'show active' : ''}`}>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase">Product Title*</label>
                                            <input name="title" value={selected.title || ''} onChange={onEditChange} className={`form-control luxury-input ${errors.title ? 'is-invalid' : ''}`} />
                                            {errors.title && <div className="invalid-feedback fw-bold small">{errors.title}</div>}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase">Slug (Auto-generated)</label>
                                            <input name="slug" value={selected.slug || ''} onChange={onEditChange} className="form-control luxury-input bg-light" readOnly />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase d-flex justify-content-between">Brand* <FiPlus className="text-primary pointer" onClick={() => { bootstrap.Modal.getOrCreateInstance(document.getElementById('brandAddModal')).show(); }} /></label>
                                            <select name="brand" value={selected.brand || ''} onChange={onEditChange} className={`form-select luxury-input ${errors.brand ? 'is-invalid' : ''}`}>
                                                <option value="">Select Brand</option>
                                                {availableBrands.map(b => <option key={b._id || b.id} value={b.name}>{b.name}</option>)}
                                            </select>
                                            {errors.brand && <div className="invalid-feedback fw-bold small">{errors.brand}</div>}
                                        </div>
                                        <div className="col-md-4">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase d-flex justify-content-between">Category* <FiPlus className="text-secondary pointer" onClick={() => { bootstrap.Modal.getOrCreateInstance(document.getElementById('categoryAddModal')).show(); }} /></label>
                                            <select name="category" value={selected.category || ''} onChange={onEditChange} className={`form-select luxury-input ${errors.category ? 'is-invalid' : ''}`}>
                                                <option value="">Select Category</option>
                                                {availableCategories.map(cat => <option key={cat._id || cat.id} value={cat.name}>{cat.name}</option>)}
                                            </select>
                                            {errors.category && <div className="invalid-feedback fw-bold small">{errors.category}</div>}
                                        </div>
                                        <div className="col-md-4">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase d-flex justify-content-between">Type <FiPlus className="text-info pointer" onClick={() => { bootstrap.Modal.getOrCreateInstance(document.getElementById('typeAddModal')).show(); }} /></label>
                                            <select name="type" value={selected.type || ''} onChange={onEditChange} className="form-select luxury-input">
                                                <option value="">Select Type</option>
                                                {availableTypes.filter(t => t.category === selected.category).map(t => (
                                                    <option key={t._id || t.id} value={t.name}>{t.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase">Price (MSRP)*</label>
                                            <input type="number" name="price" value={selected.price || ''} onChange={onEditChange} className={`form-control luxury-input ${errors.price ? 'is-invalid' : ''}`} />
                                            {errors.price && <div className="invalid-feedback fw-bold small">{errors.price}</div>}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase">Offer Price</label>
                                            <input type="number" name="offerPrice" value={selected.offerPrice || ''} onChange={onEditChange} className="form-control luxury-input" />
                                        </div>
                                    </div>
                                </div>

                                {/* TAB 2: SPECIFICATIONS */}
                                <div className={`tab-pane fade p-4 pt-5 ${editActiveTab === 1 ? 'show active' : ''}`}>
                                    <div className="row g-4">
                                        <div className="col-md-4">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase">Stock Quantity</label>
                                            <input type="number" name="stockQuantity" value={selected.stockQuantity || ''} onChange={onEditChange} className="form-control luxury-input" />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase">Size / Vol</label>
                                            <input name="size" value={selected.size || ''} onChange={onEditChange} className="form-control luxury-input" />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase">Origin Country</label>
                                            <select name="Country" value={selected.Country || ''} onChange={onEditChange} className="form-select luxury-input">
                                                <option value="Korea">Korea</option>
                                                <option value="India">India</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase">Rating (1-5)</label>
                                            <input type="number" step="0.1" name="rating" value={selected.rating || ''} onChange={onEditChange} className="form-control luxury-input" />
                                        </div>
                                        <div className="col-md-6 d-flex align-items-center mt-5">
                                            <div className="form-check form-switch ps-5">
                                                <input className="form-check-input" type="checkbox" name="bestseller" checked={selected.bestseller || false} onChange={onEditChange} />
                                                <label className="form-check-label fw-bold small text-muted text-uppercase ms-2">Bestseller Item</label>
                                            </div>
                                        </div>

                                        <div className="col-12 border-top border-light mt-4 pt-4">
                                            <div className="form-check form-switch ps-5 mb-4">
                                                <input className="form-check-input" type="checkbox" name="combo.isCombo" checked={selected.combo?.isCombo || false} onChange={(e) => handleComboChange(true, e)} />
                                                <label className="form-check-label fw-bold small text-muted text-uppercase ms-2">Combo Product (Bundle Deal)</label>
                                            </div>
                                            {selected.combo?.isCombo && (
                                                <div className="row g-4 animate-in">
                                                    <div className="col-12">
                                                        <div className="alert alert-info py-2 small d-flex align-items-center gap-2 border-0" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#2980b9' }}>
                                                            <FiInfo /> <strong>Visual Duo Tip:</strong> The first two images in the "Media" tab will be displayed side-by-side on the store page.
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="fw-bold small text-muted mb-2 text-uppercase">Bundle Offer Price</label>
                                                        <input type="number" name="combo.comboPrice" value={selected.combo?.comboPrice || ''} onChange={(e) => handleComboChange(true, e)} className="form-control luxury-input" placeholder="0" />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="fw-bold small text-muted mb-2 text-uppercase">Total M.R.P. (Sum)</label>
                                                        <input type="number" name="combo.originalPrice" value={selected.combo?.originalPrice || ''} onChange={(e) => handleComboChange(true, e)} className="form-control luxury-input" placeholder="0" />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="fw-bold small text-muted mb-2 text-uppercase">Total Savings (₹)</label>
                                                        <input type="number" name="combo.savings" value={selected.combo?.savings || ''} onChange={(e) => handleComboChange(true, e)} className="form-control luxury-input" placeholder="0" />
                                                    </div>
                                                    <div className="col-12">
                                                        {renderArrayFields(true, "combo.productsIncluded", "Products in this Bundle (Names)", "e.g. Skin Toner")}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* TAB 3: SKIN PROFILE */}
                                <div className={`tab-pane fade p-4 pt-5 ${editActiveTab === 2 ? 'show active' : ''}`}>
                                    <div className="row g-4">
                                        <div className="col-md-6 border-end border-light">
                                            {renderArrayFields(true, "skinType", "Skin Concern Target", "e.g. Oily Skin")}
                                        </div>
                                        <div className="col-md-6">
                                            {renderArrayFields(true, "skinConcern", "Specific Concerns", "e.g. Acne")}
                                        </div>
                                        <div className="col-12 border-top border-light mt-4 pt-4">
                                            {renderArrayFields(true, "benefits", "Key Product Benefits", "e.g. Deep Cleansing")}
                                        </div>
                                    </div>
                                </div>

                                {/* TAB 4: DETAILS */}
                                <div className={`tab-pane fade p-4 pt-5 ${editActiveTab === 3 ? 'show active' : ''}`}>
                                    <div className="row g-4">
                                        <div className="col-12">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase">Description</label>
                                            <textarea name="description" value={selected.description || ''} onChange={onEditChange} className="form-control luxury-input h-auto py-3 rounded-4" rows="4"></textarea>
                                        </div>
                                        <div className="col-md-6 border-end border-light">
                                            {renderArrayFields(true, "keyIngredients", "Key Ingredients", "e.g. Niacinamide")}
                                        </div>
                                        <div className="col-md-6">
                                            {renderArrayFields(true, "howToUse", "Application Steps", "Step Description")}
                                        </div>
                                    </div>
                                </div>

                                {/* TAB 5: MEDIA */}
                                <div className={`tab-pane fade p-4 pt-5 ${editActiveTab === 4 ? 'show active' : ''}`}>
                                    <div className="row g-4">
                                        <div className="col-12 mb-4">
                                            <label className="fw-bold small text-muted mb-3 text-uppercase d-flex align-items-center gap-2">
                                                <FiImage /> Product Image Gallery
                                            </label>
                                            
                                            {/* Existing Images */}
                                            <div className="d-flex flex-wrap gap-3 mb-3">
                                                {selected.images?.map((img, idx) => (
                                                    <div key={`existing-${idx}`} className="position-relative animate-in" style={{ width: '100px', height: '100px' }}>
                                                        <img
                                                            src={img}
                                                            alt=""
                                                            className="w-100 h-100 rounded-3 shadow-sm border"
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                        {selected.combo?.isCombo && idx < 2 && (
                                                            <div className="position-absolute bottom-0 start-50 translate-middle-x bg-dark text-white tiny-label px-1 rounded-1" style={{ fontSize: '10px', zIndex: 5, marginBottom: '5px' }}>
                                                                Duo {idx + 1}
                                                            </div>
                                                        )}
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 translate-middle shadow-sm p-0 d-flex align-items-center justify-content-center"
                                                            style={{ width: '24px', height: '24px' }}
                                                            onClick={() => {
                                                                const updated = selected.images.filter((_, i) => i !== idx);
                                                                setSelected({ ...selected, images: updated });
                                                            }}
                                                        >
                                                            <FiTrash2 size={12} />
                                                        </button>
                                                        <div className="position-absolute bottom-0 start-50 translate-middle-x badge bg-dark opacity-75 small p-1 w-100 rounded-0 rounded-bottom-3" style={{ fontSize: '9px' }}>EXISTING</div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="p-4 border-2 border-dashed rounded-4 text-center bg-light transition-all hover-shadow" style={{ borderStyle: 'dashed' }}>
                                                <input
                                                    type="file"
                                                    id="editImages"
                                                    name="images"
                                                    multiple
                                                    className="d-none"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(true, e)}
                                                />
                                                <label htmlFor="editImages" className="pointer mb-0">
                                                    <div className="p-3 bg-white rounded-circle shadow-sm mx-auto mb-3" style={{ width: '60px' }}>
                                                        <FiPlus size={24} className="text-primary" />
                                                    </div>
                                                    <h6 className="fw-bold">Upload New Images</h6>
                                                    <p className="text-muted small mb-0">Add more beauty shots to your gallery</p>
                                                </label>
                                            </div>

                                            {/* Previews for new files */}
                                            <div className="d-flex flex-wrap gap-3 mt-3">
                                                {selected.imageFiles?.map((file, idx) => (
                                                    <div key={`new-${idx}`} className="position-relative animate-in" style={{ width: '100px', height: '100px' }}>
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt=""
                                                            className="w-100 h-100 rounded-3 shadow-sm border border-primary"
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 translate-middle shadow-sm p-0 d-flex align-items-center justify-content-center"
                                                            style={{ width: '24px', height: '24px' }}
                                                            onClick={() => removeNewFile(true, 'images', idx)}
                                                        >
                                                            <FiTrash2 size={12} />
                                                        </button>
                                                        <div className="position-absolute bottom-0 start-50 translate-middle-x badge bg-primary small p-1 w-100 rounded-0 rounded-bottom-3" style={{ fontSize: '9px' }}>NEW</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="col-12 mb-4">
                                            <label className="fw-bold small text-muted mb-3 text-uppercase d-flex align-items-center gap-2">
                                                <FiPackage /> Product Video (Optional)
                                            </label>
                                            <div className="p-4 border-2 border-dashed rounded-4 text-center bg-light" style={{ borderStyle: 'dashed' }}>
                                                <input
                                                    type="file"
                                                    id="editVideo"
                                                    name="video"
                                                    className="d-none"
                                                    accept="video/*"
                                                    onChange={(e) => handleFileChange(true, e)}
                                                />
                                                
                                                {/* Existing Video */}
                                                {!selected.videoFile && selected.videoUrl && (
                                                    <div className="position-relative mx-auto mb-3" style={{ maxWidth: '300px' }}>
                                                        <video
                                                            src={selected.videoUrl}
                                                            className="w-100 rounded-4 shadow-sm"
                                                            controls
                                                        />
                                                        <div className="mt-2 d-flex justify-content-center gap-2">
                                                            <label htmlFor="editVideo" className="btn btn-dark btn-sm rounded-pill px-3 fw-bold shadow-sm pointer">
                                                                Replace Video
                                                            </label>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm rounded-pill px-3 fw-bold shadow-sm"
                                                                onClick={() => setSelected({ ...selected, videoUrl: "" })}
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                        <div className="badge bg-dark mt-2">CURRENT VIDEO</div>
                                                    </div>
                                                )}

                                                {/* New Video Preview */}
                                                {selected.videoFile ? (
                                                    <div className="position-relative mx-auto" style={{ maxWidth: '300px' }}>
                                                        <video
                                                            src={URL.createObjectURL(selected.videoFile)}
                                                            className="w-100 rounded-4 shadow-sm border border-success"
                                                            controls
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm rounded-pill position-absolute top-0 end-0 m-2 shadow-sm d-flex align-items-center gap-2"
                                                            onClick={() => removeNewFile(true, 'video')}
                                                        >
                                                            <FiTrash2 size={12} /> Remove New Video
                                                        </button>
                                                        <div className="badge bg-success mt-2">NEW VIDEO READY</div>
                                                    </div>
                                                ) : !selected.videoUrl && (
                                                    <label htmlFor="editVideo" className="pointer mb-0">
                                                        <div className="p-3 bg-white rounded-circle shadow-sm mx-auto mb-3" style={{ width: '60px' }}>
                                                            <FiPlus size={24} className="text-success" />
                                                        </div>
                                                        <h6 className="fw-bold text-success">Add Showcase Video</h6>
                                                        <p className="text-muted small mb-0">Select a high-resolution beauty video</p>
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <label className="fw-bold small text-muted mb-2 text-uppercase">Shipping Information</label>
                                            <input name="shippingInfo" value={selected.shippingInfo || ''} onChange={onEditChange} className="form-control luxury-input" />
                                        </div>
                                        <div className="col-12 border-top border-light mt-4 pt-4">
                                            {renderArrayFields(true, "faqs", "Product FAQ", "Question content")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer bg-light border-0 p-4 gap-3">
                            {editActiveTab > 0 && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
                                    style={{ height: '50px' }}
                                    onClick={() => setEditActiveTab(prev => prev - 1)}
                                >
                                    Back
                                </button>
                            )}

                            {editActiveTab < 4 && (
                                <button
                                    key="edit-next-btn"
                                    type="button"
                                    className="btn btn-primary rounded-pill flex-grow-1 shadow-sm fw-bold border-0 fs-5"
                                    style={{ height: '60px' }}
                                    onClick={() => setEditActiveTab(prev => prev + 1)}
                                >
                                    Next Stage
                                </button>
                            )}
                            {editActiveTab === 4 && (
                                <button
                                    key="edit-submit-btn"
                                    type="submit"
                                    className="btn btn-luxury-primary flex-grow-1 shadow-sm fw-bold border-0 fs-5 rounded-4"
                                    style={{ height: '60px' }}
                                >
                                    Save Changes
                                </button>
                            )}

                        </div>
                    </form>
                </div>
            </div>

            {/* Custom Styles Injector */}
            <style>{`
                .btn-luxury-primary { 
                    background: linear-gradient(90deg, #25d3df 0%, #2b59c3 100%); 
                    color: #fff; 
                    border-radius: 50px;
                    border: none;
                    box-shadow: 0 10px 20px rgba(43, 89, 195, 0.2);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
                    display: flex; align-items: center; justify-content: center;
                }
                .btn-luxury-primary:hover { 
                    transform: translateY(-2px); 
                    box-shadow: 0 15px 30px rgba(43, 89, 195, 0.3);
                    color: #fff;
                }
                .btn-luxury-primary-small {
                    background: linear-gradient(90deg, #25d3df 0%, #2b59c3 100%);
                    color: #fff;
                    border: none;
                    box-shadow: 0 4px 10px rgba(43, 89, 195, 0.2);
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s ease;
                }
                .btn-luxury-primary-small:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 15px rgba(43, 89, 195, 0.3);
                }
                .bg-luxury-gold { background: #2b59c3 !important; }
                .hover-up:hover { transform: translateY(-5px); }
                .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .animate-in {
                    animation: slideUp 0.3s ease-out;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .luxury-input {
                    padding: 0 24px; border-radius: 50px; background: #f1f3f9; border: 1px solid #d1d9e6;
                    font-size: 15px; font-weight: 700;
                    color: #1a2b4b;
                    box-shadow: inset 0 4px 10px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                    height: 50px;
                    width: 100%;
                }
                .luxury-input:focus {
                    background: #fff; border-color: #2b59c3; outline: none; 
                    box-shadow: inset 0 4px 10px rgba(0,0,0,0.1), 0 0 0 4px rgba(43, 89, 195, 0.1);
                }
                .modal-content { background: #f0f3f9 !important; border-radius: 40px !important; }
                @media (max-width: 576px) {
                    .modal-dialog {
                        max-width: 100% !important;
                        margin: 0 !important;
                        min-height: 100vh;
                    }
                    .modal-content {
                        min-height: 100vh;
                        border-radius: 0 !important;
                    }
                    .luxury-input {
                        height: 44px;
                        padding: 0 16px;
                    }
                    table {
                        font-size: 12px !important;
                    }
                    .btn-luxury-primary, .btn-primary {
                        height: 50px !important;
                        font-size: 16px !important;
                    }
                }
                .bg-white { background: transparent !important; } /* Allow modal-content bg to show */
                .luxury-input::placeholder {
                    text-transform: none; font-weight: 500; letter-spacing: normal; opacity: 0.6;
                }
                .luxury-spinner {
                    width: 32px; height: 32px; border: 3px solid rgba(212, 175, 55, 0.1); border-top-color: #D4AF37; border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .brand-toggle-btn {
                    transition: all 0.2s ease;
                    opacity: 0.6;
                }
                .brand-toggle-btn:hover {
                    opacity: 1;
                    transform: scale(1.2);
                    color: #2b59c3 !important;
                }
            `}</style>
            {/* ── SECONDARY TAXONOMY MODALS ── */}
            {/* Brand Add Modal */}
            <div className="modal fade" id="brandAddModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-4 border-0 shadow">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="fw-bold">Add New Brand</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <input className="form-control mb-3 luxury-input" placeholder="Brand Name" value={taxName} onChange={(e) => setTaxName(e.target.value)} />
                            <div className="p-3 bg-light rounded-4 border-2 border-dashed border-secondary text-center">
                                <input 
                                    type="file" 
                                    id="brandLogoInput" 
                                    className="d-none" 
                                    accept="image/*" 
                                    onChange={(e) => setTaxLogoFile(e.target.files[0])} 
                                />
                                <label htmlFor="brandLogoInput" className="pointer mb-0">
                                    {taxLogoFile ? (
                                        <div className="animate-in">
                                            <img src={URL.createObjectURL(taxLogoFile)} alt="Preview" className="rounded-3 shadow-sm mb-2" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                                            <p className="small text-primary fw-bold mb-0">{taxLogoFile.name}</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="p-2 bg-white rounded-circle shadow-sm mx-auto mb-2" style={{ width: '40px' }}>
                                                <FiImage className="text-muted" />
                                            </div>
                                            <p className="small text-muted fw-bold mb-0">Click to Upload Brand Logo</p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer border-0">
                            <button className="btn btn-primary w-100 rounded-3 py-3 fw-bold" onClick={async () => {
                                if (!taxName) {
                                    alert("Please enter brand name");
                                    return;
                                }
                                
                                try {
                                    const slug = taxName.toLowerCase().replace(/\s+/g, '-');
                                    const formData = new FormData();
                                    formData.append('id', `br-${Date.now()}`);
                                    formData.append('name', taxName);
                                    formData.append('slug', slug);
                                    
                                    if (taxLogoFile) {
                                        formData.append('img', taxLogoFile);
                                    }

                                    await axios.post(`${API_BASE_URL}/brands`, formData, {
                                        headers: {
                                            'x-token': token
                                        }
                                    });

                                    setTaxName(""); 
                                    setTaxLogoFile(null); 
                                    fetchBrands();
                                    bootstrap.Modal.getInstance(document.getElementById('brandAddModal')).hide();
                                    alert("Brand added successfully!");
                                } catch (err) {
                                    console.error("Brand add failed:", err);
                                    alert("Failed to add brand. Make sure you are logged in as admin.");
                                }
                            }}>Save Brand</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Add Modal */}
            <div className="modal fade" id="categoryAddModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-4 border-0 shadow">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="fw-bold">Add New Category</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <input className="form-control luxury-input" placeholder="Category Name" value={taxName} onChange={(e) => setTaxName(e.target.value)} />
                        </div>
                        <div className="modal-footer border-0">
                            <button className="btn btn-primary w-100 rounded-3" onClick={async () => {
                                if (!taxName) return;
                                const slug = taxName.toLowerCase().replace(/\s+/g, '-');
                                await axios.post(`${API_BASE_URL}/categories`, { id: `cat-${Date.now()}`, name: taxName, slug });
                                setTaxName(""); fetchCategories();
                                bootstrap.Modal.getInstance(document.getElementById('categoryAddModal')).hide();
                            }}>Save Category</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Type Add Modal */}
            <div className="modal fade" id="typeAddModal" tabIndex="-1">
                {/* ... (existing modal content) ... */}
            </div>

            {/* FULL SCREEN LOADING OVERLAY */}
            {isSaving && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div className="spinner-border text-gold mb-3" style={{ width: '3rem', height: '3rem', borderWidth: '0.2rem' }} role="status"></div>
                    <h4 className="fw-bold text-white mb-2" style={{ letterSpacing: '2px' }}>PROCESSING...</h4>
                    <p className="text-secondary small">Synchronizing catalog assets. Please wait.</p>
                </div>
            )}
        </div>
    );
};

export default ViewProduct;



