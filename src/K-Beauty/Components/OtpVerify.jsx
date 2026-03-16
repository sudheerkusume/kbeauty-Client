import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginStatus } from "../../App";
import API_BASE_URL from "../config";
import toast from "react-hot-toast";

const OtpVerify = ({ confirmationResult, phone, onBack }) => {
    const [otp, setOtp] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [timer, setTimer] = useState(60);
    const { setToken, setLogin, setUser } = useContext(loginStatus);
    const navigate = useNavigate();

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp || otp.length < 6) {
            toast.error("Please enter 6-digit OTP");
            return;
        }

        setVerifying(true);
        try {
            // 1. Confirm OTP with Firebase
            const result = await confirmationResult.confirm(otp);
            const idToken = await result.user.getIdToken();

            // 2. Link with Backend
            const res = await axios.post(`${API_BASE_URL}/api/auth/firebase-login`, { idToken });
            const { token: accessToken, refreshToken, user } = res.data;

            // 3. Store tokens and update state
            localStorage.setItem("usertoken", accessToken);
            localStorage.setItem("refreshtoken", refreshToken);
            localStorage.setItem("userrole", user.role);

            setToken(accessToken);
            setUser(user);
            setLogin(true);
            
            toast.success("Login Successful!");
            navigate(user.role === "admin" ? "/dashboard" : "/Account");
        } catch (err) {
            console.error("Verification Error:", err);
            toast.error(err.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="otp-verify-container animate__animated animate__fadeIn">
            <h3 className="text-center mb-3">Verification Code</h3>
            <p className="text-center text-muted small mb-4">
                We sent a code to <strong>{phone}</strong>
            </p>

            <form onSubmit={handleVerifyOtp}>
                <div className="mb-4">
                    <input 
                        type="text" 
                        placeholder="000000" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        required 
                        maxLength="6"
                        className="login-input text-center fs-3 fw-bold"
                        style={{ letterSpacing: '8px' }}
                        autoFocus
                    />
                </div>

                <button type="submit" className="login-button w-100 py-3 rounded-pill" disabled={verifying}>
                    {verifying ? (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : "Verify & Log In"}
                </button>

                <div className="text-center mt-4">
                    {timer > 0 ? (
                        <p className="small text-muted">Resend code in <strong>{timer}s</strong></p>
                    ) : (
                        <button type="button" className="btn btn-link text-gold small fw-bold" onClick={onBack}>
                            Didn't get the code? Try again
                        </button>
                    )}
                </div>

                <button type="button" className="btn btn-link w-100 text-muted mt-2 small" onClick={onBack}>
                    Change phone number
                </button>
            </form>
        </div>
    );
};

export default OtpVerify;
