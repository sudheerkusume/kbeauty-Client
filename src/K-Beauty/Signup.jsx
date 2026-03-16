import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "./config";

const Signup = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fname: "",
        lname: "",
        email: "",
        password: "",
        cpassword: ""   // ✅ added confirm password field
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const newUser = {
            name: `${form.fname} ${form.lname}`,  // ✅ Combine first and last name
            email: form.email,
            password: form.password,
            cpassword: form.cpassword,
        };

        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/signin`, newUser);  // ✅ Corrected path with /api/auth prefix
            setSuccess(res.data.message);
            setTimeout(() => navigate("/Login"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="signup-wrapper">
            <div className="signup-container">
                <h2 className="signup-title">CREATE AN ACCOUNT</h2>
                <p className="signup-subtitle">
                    Enter your information below to proceed. If you already have an account,
                    please <Link to="/Login">log in</Link> instead.
                </p>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="name-fields">
                        <input
                            type="text"
                            name="fname"
                            placeholder="First name"
                            value={form.fname}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="lname"
                            placeholder="Last name"
                            value={form.lname}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="cpassword"
                        placeholder="Confirm Password"
                        value={form.cpassword}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className="signup-btn">Create an account</button>
                </form>

                <div className="signup-footer">
                    Already have an account? <Link to="/Login">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
