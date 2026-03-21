import React, { useContext } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useWishlist } from './context/WishlistContext';
import { loginStatus } from '../App';
import { toast } from 'react-toastify';

const WishlistButton = ({ product }) => {
    const { wishlist, toggleWishlist } = useWishlist();
    const { login } = useContext(loginStatus);

    const isWishlisted = wishlist.some(
        (item) => item._id === product?._id || item.title === product?.title
    );

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!login) {
            toast.info("Please Login to add items to Wishlist", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        toggleWishlist(product);
    };

    return (
        <button
            onClick={handleToggle}
            className="wishlist-btn-modern"
            style={{
                border: '1px solid var(--border-soft)',
                background: 'var(--bg-card)',
                cursor: 'pointer',
                color: isWishlisted ? 'var(--pink-accent)' : 'var(--text-secondary)',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                padding: '8px',
                borderRadius: '50%',
                boxShadow: 'var(--shadow-soft)',
                backdropFilter: 'blur(5px)',
            }}
        >
            {isWishlisted ? <FaHeart /> : <FaRegHeart />}
        </button>
    );
};

export default WishlistButton;
