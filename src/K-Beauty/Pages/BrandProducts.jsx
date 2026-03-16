import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from "../config";
import { IoIosArrowBack } from 'react-icons/io';

const BrandProducts = () => {
    const { brandName } = useParams();
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/products?brand=${brandName}`)
            .then(res => {
                // The backend is now filtering by brand, so the client-side filter is no longer needed.
                // Sorting by ID descending (Newest First) - numeric
                const sortedData = res.data.sort((a, b) => b._id.localeCompare(a._id));
                setProducts(sortedData);
            })
            .catch(err => console.log(err));
    }, [brandName]);

    return (
        <div className="brand-products-page py-5 bg-black">
            <div className="container py-5">
                <button
                    className="btn btn-link text-dark text-decoration-none mb-4 d-flex align-items-center p-0"
                    onClick={() => navigate(-1)}
                >
                    <IoIosArrowBack className="me-2" /> Back
                </button>

                <div className="mb-5">
                    <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '4px', color: '#C8A27C' }}>Brand Collection</span>
                    <h1 className="laneige-title" style={{ fontSize: '3rem', textTransform: 'capitalize' }}>{brandName}</h1>
                    <p className="text-muted">Discover the range of products from {brandName}.</p>
                </div>

                {products.length > 0 ? (
                    <div className="row g-4">
                        {products.map(product => (
                            <div className="col-md-3" key={product._id}>
                                <div className="signature-premium-card" onClick={() => navigate(`/BestSellers/${product._id}`)} style={{ cursor: 'pointer' }}>
                                    <div className="premium-img-container">
                                        <img src={product.images?.[0] || product.image || 'https://via.placeholder.com/600x800'} alt={product.title} className="premium-main-img" />
                                    </div>
                                    <div className="card-content-p">
                                        <span className="premium-care-label text-uppercase">{product.brand}</span>
                                        <h3 className="premium-product-title">{product.title}</h3>
                                        <div className="premium-price-wrap">
                                            <span className="premium-offer-price">₹{product.offerPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <h3>No products found for this brand yet.</h3>
                        <p>Stay tuned for new arrivals from {brandName}!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandProducts;
