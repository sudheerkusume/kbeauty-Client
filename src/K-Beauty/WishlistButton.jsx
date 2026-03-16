import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useWishlist } from './context/WishlistContext';

const WishlistButton = ({ product }) => {
    const { wishlist, toggleWishlist } = useWishlist();

    const isWishlisted = wishlist.some(
        (item) => item._id === product?._id || item.title === product?.title
    );

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    return (
        <button
            onClick={handleToggle}
            className="wishlist-btn-modern"
            style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: isWishlisted ? '#ff4d4d' : '#fff',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(5px)',
            }}
        >
            {isWishlisted ? <FaHeart /> : <FaRegHeart />}
        </button>
    );
};

export default WishlistButton;
