import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginStatus } from '../../App';
import API_BASE_URL from "../config";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const { token } = useContext(loginStatus);

    console.log("WishlistProvider Token State:", token);

    // Fetch wishlist from backend on mount
    useEffect(() => {
        const fetchWishlist = async () => {
            if (!token || token === "" || token === "null") return;

            try {
                const res = await axios.get(`${API_BASE_URL}/wishlist`, {
                    headers: { "x-token": token },
                });
                console.log("Wishlist fetched from backend:", res.data.items);
                setWishlist(res.data?.items || []);
            } catch (error) {
                console.error("Error fetching wishlist:", error.response?.data || error.message);
                toast.error("Failed to sync wishlist from server");
            }
        };

        fetchWishlist();
    }, [token]);

    const addToWishlist = async (item) => {
        if (!token) return toast.error("Please login to add to wishlist");

        const normalizedId = item._id;
        const exists = wishlist.some(w => w._id === normalizedId || w.title === item.title);
        if (exists) {
            console.log("Item already in wishlist");
            return;
        }

        console.log("Adding to wishlist:", item.title);

        const updatedWishlist = [...wishlist, item];
        setWishlist(updatedWishlist);

        try {
            await axios.post(`${API_BASE_URL}/wishlist`, { items: updatedWishlist }, {
                headers: { "x-token": token },
            });
            console.log("Wishlist synced to backend");
            toast.success("Added to wishlist");
        } catch (error) {
            console.error("Failed to sync wishlist:", error.response?.data || error.message);
            toast.error("Wishlist save failed");
        }
    };

    const removeFromWishlist = async (id) => {
        const updatedWishlist = wishlist.filter(item => item._id !== id);
        setWishlist(updatedWishlist);

        try {
            await axios.post(`${API_BASE_URL}/wishlist`, { items: updatedWishlist }, {
                headers: { "x-token": token },
            });
        } catch (error) {
            console.error("Failed to sync wishlist after removal:", error);
        }
    };

    const toggleWishlist = async (item) => {
        const exists = wishlist.find(w => w._id === item._id || w.title === item.title);
        if (exists) {
            await removeFromWishlist(exists._id);
        } else {
            await addToWishlist(item);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
