import React, { useState, useEffect } from 'react';
import './IngredientSection.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import API_BASE_URL from "../config";

const IngredientSection = () => {
    const [ingredients, setIngredients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/products`)
            .then(res => {
                const allProducts = res.data;
                const uniqueIngredients = new Set();
                
                // Extract only ingredients that are actually assigned to products
                allProducts.forEach(product => {
                    if (product.keyIngredients && Array.isArray(product.keyIngredients)) {
                        product.keyIngredients.forEach(ing => {
                            if (ing.trim()) uniqueIngredients.add(ing.trim());
                        });
                    }
                });
                
                // Sort them alphabetically for a clean display
                setIngredients(Array.from(uniqueIngredients).sort());
            })
            .catch(err => console.log(err));
    }, []);

    if (ingredients.length === 0) return null;

    return (
        <section className="ingredient-section py-5 bg-black">
            <div className="container">
                <div className="text-center mb-5">
                    <span className="ing-subtitle">Purity in Every Drop</span>
                    <h2 className="ing-title">Shop by Ingredient</h2>
                </div>
                <div className="ingredient-grid-luxe">
                    {ingredients.map((ing, index) => (
                        <div
                            className="ing-card-premium"
                            key={index}
                            onClick={() => navigate(`/ingredient/${ing}`)}
                        >
                            <div className="ing-orb">
                                <span className="ing-initial">{ing.charAt(0).toUpperCase()}</span>
                            </div>
                            <h4 className="ing-name mt-3 text-center">{ing}</h4>
                            <div className="ing-browse-btn">Explore <span className="ms-1">→</span></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default IngredientSection;
