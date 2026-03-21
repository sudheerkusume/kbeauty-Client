import React from 'react';
import { Link } from 'react-router-dom';
import image1 from '../assets/Categories_body_Cream.png'; // Replace with real category images
import image2 from '../assets/Categories_logo_Face_Serum_1-removebg-preview.png';
import image3 from '../assets/Categories_logo_FootCare.png';
import image4 from '../assets/Categories_logo_LipCare.png';
import image5 from '../assets/Categories_logo_Sunscreen.png'
const Categories = () => {
    const categoryData = [
        { name: "Best Sellers", img: image1, link: "/BestSellers" },
        { name: "Skin Care", img: image2, link: "/SkinCare" },
        { name: "Makeup", img: image4, link: "/Makeup" },
        { name: "Shop All", img: image5, link: "/SkinCare" },
    ];

    return (
        <div className="container-fluid py-5" style={{ background: 'var(--bg-cream)' }}>
            <div className="container">
                <h5 className="mb-4 text-start fw-bold text-uppercase" style={{ letterSpacing: '2px', fontSize: '1rem', color: 'var(--text-primary)' }}>Trending Categories</h5>
                <div className="row g-4 justify-content-center text-center">
                    {categoryData.map((cat, index) => (
                        <div className="col-6 col-md-2" key={index}>
                            <Link to={cat.link} className="text-decoration-none category-item-p">
                                <div className="category-circle-bg">
                                    <img src={cat.img} alt={cat.name} className="category-pop-img" />
                                </div>
                                <div className="category-name-p mt-3" style={{ color: 'var(--text-primary)' }}>{cat.name}</div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Categories;