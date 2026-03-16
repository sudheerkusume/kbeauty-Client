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
        <div className="brand-logos-wrap py-4 bg-black border-bottom border-secondary">
            <div className="container-fluid overflow-hidden px-0">
                <div className="brand-logos-track">
                    <div className="brand-logos-scroll">
                        {/* First set of logos */}
                        {brands.map((brand, index) => (
                            <div
                                key={`brand-1-${index}`}
                                className="brand-logo-item"
                                onClick={() => navigate(`/brand/${brand.name}`)}
                            >
                                <img src={resolveImg(brand.img)} alt={brand.name} className="brand-logo-img" />
                            </div>
                        ))}
                        {/* Duplicate set for infinite scroll */}
                        {brands.map((brand, index) => (
                            <div
                                key={`brand-2-${index}`}
                                className="brand-logo-item"
                                onClick={() => navigate(`/brand/${brand.name}`)}
                            >
                                <img src={resolveImg(brand.img)} alt={brand.name} className="brand-logo-img" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandLogos;
