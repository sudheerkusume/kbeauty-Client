import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from "../config";
import { IoIosArrowBack } from 'react-icons/io';

const IngredientProducts = () => {
    const { name } = useParams();
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/products?ingredients_like=${name}`)
            .then(res => {
                // Filter products that contain the ingredient name in their keyIngredients
                const filtered = res.data.filter(p =>
                    p.keyIngredients?.some(ing => ing.toLowerCase().includes(name.toLowerCase()))
                );
                // Sorting by ID descending (Newest First) - numeric
                const sortedData = filtered.sort((a, b) => b._id.localeCompare(a._id));
                setProducts(sortedData);
            })
            .catch(err => console.log(err));
    }, [name]);

    return (
        <div className="ingredient-products-page py-5 bg-black">
            <div className="container py-5">
                <button
                    className="btn btn-link text-dark text-decoration-none mb-4 d-flex align-items-center p-0"
                    onClick={() => navigate(-1)}
                >
                    <IoIosArrowBack className="me-2" /> Back to Home
                </button>

                <div className="mb-5">
                    <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '4px', color: '#C8A27C' }}>Discovery</span>
                    <h1 className="laneige-title" style={{ fontSize: '3rem' }}>{name} infused</h1>
                    <p className="text-muted">Explore our curated selection of products formulated with {name}.</p>
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
                        <h3>No products found for this ingredient yet.</h3>
                        <p>Our experts are working on bringing more {name} infused products!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IngredientProducts;
