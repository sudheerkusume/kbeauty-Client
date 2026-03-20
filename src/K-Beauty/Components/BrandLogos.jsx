import React, { useState, useEffect } from 'react';
import './BrandLogos.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import API_BASE_URL from "../config";

const BrandLogos = () => {
    const [brands, setBrands] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/brands`)
            .then(res => setBrands(res.data))
            .catch(err => console.log(err));
    }, []);

    const resolveImg = (img) => {
        if (!img) return null;
        if (img.startsWith('http') || img.startsWith('/') || img.startsWith('data:')) return img;
        return `/assets/${img}`;
    };


    return (
        <section className="partners-section">
            <div className="container">
                <div className="row justify-content-center mb-5">
                    <div className="col-12 col-md-8 text-center partners-header">
                        <span className="partners-subtitle">TRUSTED BY EXPERTS</span>
                        <h2 className="partners-title">Our Collaborative Brands</h2>
                        <div className="partners-divider"></div>
                        <p className="partners-desc mt-4">
                            We curate the most innovative and authentic K-Beauty brands, bringing you exclusive formulations directly from Seoul.
                        </p>
                    </div>
                </div>

                <div className="partners-matrix">
                    {brands.map((brand, index) => (
                        <div 
                            key={`matrix-brand-${index}`} 
                            className="matrix-cell"
                            onClick={() => navigate(`/brand/${brand.name}`)}
                        >
                            <img src={resolveImg(brand.img)} alt={brand.name} className="matrix-logo" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandLogos;
