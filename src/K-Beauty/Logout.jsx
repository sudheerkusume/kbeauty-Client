import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginStatus } from '../App';
import axios from 'axios';

const Logout = () => {
    const { token, setToken, setLogin } = useContext(loginStatus);
    const navigate = useNavigate();
    const [fuser, setFuser] = useState(null);

    const handleLogout = () => {
        setToken('');
        setLogin(false);
        localStorage.removeItem("usertoken");
        navigate('/Login');
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('https://htbrands-server.onrender.com/fuser', {
                    headers: { 'x-token': token }
                });
                setFuser(res.data);
            } catch (err) {
                console.error('Error fetching user:', err);
            }
        };

        if (token) {
            fetchUser();
        }
    }, [token]);

    return (
        <div className="container mt-5">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item text-muted">Home</li>
                    <li className="breadcrumb-item active" aria-current="page">My Account</li>
                </ol>
            </nav>

            {/* Header */}
            <h2 className="mb-2">My Account</h2>
            <button
                className="btn btn-link text-decoration-none ps-0 mb-4"
                onClick={handleLogout}
            >
                ↳ Log out
            </button>

            {/* Grid Layout for Sections */}
            <div className="row">
                {/* Order History */}
                <div className="col-md-6 mb-4">
                    <h5>Order history</h5>
                    <p className="text-muted">You haven't placed any orders yet.</p>
                </div>

                {/* Account Details */}
                <div className="col-md-6 mb-4">
                    <h5>Account details</h5>
                    {fuser ? (
                        <>
                            <p className="mb-1 text-muted">Name</p>
                            <p className="mb-2">{fuser.name || "Name not available"}</p>
                            <p className="mb-1 text-muted">Email</p>
                            <p className="mb-2">{fuser.email}</p>
                            <p className="mb-1 text-muted">Location</p>
                            <p className="mb-2">India</p>
                            <a href="/addresses" className="text-primary text-decoration-none">
                                View addresses (1)
                            </a>
                        </>
                    ) : (
                        <p className="text-muted">Loading user details...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Logout;
