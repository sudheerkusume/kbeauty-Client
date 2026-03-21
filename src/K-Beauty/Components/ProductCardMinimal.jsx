import React from 'react';
import { Link } from 'react-router-dom';
import WishlistButton from '../WishlistButton';
import './ProductCardMinimal.css';

const ProductCardMinimal = ({ product }) => {
    if (!product) return null;

    const discountPercent = product.price && product.offerPrice
        ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
        : 0;

    const targetLink = `/${product.category === 'Makeup' ? 'Makeup' : 'SkinCare'}/${product._id}`;

    return (
        <div className="product-card-minimal">
            <div className="minimal-img-wrap">
                <Link to={targetLink}>
                    <img
                        src={product.images?.[0] || 'https://via.placeholder.com/300x400'}
                        alt={product.title}
                        className="minimal-img"
                    />
                </Link>
                {discountPercent > 0 && (
                    <div className="minimal-badge">-{discountPercent}%</div>
                )}
                <div className="minimal-wishlist">
                    <WishlistButton product={product} />
                </div>
            </div>
            <div className="minimal-info text-center mt-3">
                <span className="minimal-brand">{product.brand}</span>
                <Link to={targetLink} className="text-decoration-none">
                    <h5 className="minimal-title">{product.title}</h5>
                </Link>
                <div className="minimal-price">
                    <span className="price-new">₹{product.offerPrice || product.price}</span>
                    {product.price > product.offerPrice && (
                        <span className="price-old ms-2">₹{product.price}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCardMinimal;
