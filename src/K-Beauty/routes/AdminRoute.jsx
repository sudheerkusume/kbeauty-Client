import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { loginStatus } from '../../App';
import axios from 'axios';
import API_BASE_URL from '../config';

const AdminRoute = ({ children }) => {
    const { token, login } = useContext(loginStatus);
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!token) {
                setIsAdmin(false);
                return;
            }
            try {
                const res = await axios.get(`${API_BASE_URL}/api/auth/getuser`, {
                    headers: { "x-token": token }
                });
                if (res.data.role === 'admin') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (err) {
                console.error("Admin check failed:", err);
                setIsAdmin(false);
            }
        };

        checkAdmin();
    }, [token]);

    if (!login || token === "") {
        return <Navigate to="/Login" />;
    }

    if (isAdmin === null) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', background: '#000' }}>
                <div className="spinner-border text-gold" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
