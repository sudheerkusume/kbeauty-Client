import axios from "axios";
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { loginStatus } from "../App";
import API_BASE_URL from "./config";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import toast from "react-hot-toast";
import OtpVerify from "./Components/OtpVerify";

const Login = () => {
    const [loginMode, setLoginMode] = useState("email"); // "email" or "phone"
    const [form, setForm] = useState({
        email: "",
        password: "",
        cpassword: "",
        phone: ""
    });

    const [confirmationResult, setConfirmationResult] = useState(null);
    const recaptchaVerifierRef = useRef(null);
    const recaptchaContainerRef = useRef(null);

    const { token, setToken, setLogin, setUser } = useContext(loginStatus);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [countryCode, setCountryCode] = useState("+91"); // Default to India
    const navigate = useNavigate();

    // 🛡️ Optimized Recaptcha Initialization (Switching to Invisible for Identity Platform)
    const setupRecaptcha = () => {
        if (recaptchaVerifierRef.current) return recaptchaVerifierRef.current;
        
        if (recaptchaContainerRef.current) {
            try {
                auth.languageCode = 'en'; 
                // Using 'invisible' size which is more stable for Pro projects
                recaptchaVerifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
                    'size': 'invisible', 
                    'callback': () => console.log("✅ Recaptcha Verified (Invisible)"),
                    'expired-callback': () => {
                        toast.error("Verification expired. Retrying...");
                        if (recaptchaVerifierRef.current) recaptchaVerifierRef.current.render();
                    }
                });
                console.log("🛡️ Recaptcha initialized in Invisible mode");
            } catch (err) {
                console.error("❌ Recaptcha init error:", err);
            }
        }
        return recaptchaVerifierRef.current;
    };

    useEffect(() => {
        if (loginMode === 'phone' && !recaptchaVerifierRef.current) {
            setupRecaptcha();
        }
        // Removing automatic clear on mode change to prevent race conditions 
        // with the reCAPTCHA script's internal DOM management.
    }, [loginMode]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        
        // Remove non-digits for length check
        const cleanPhone = form.phone.replace(/\D/g, '');
        
        if (!cleanPhone || cleanPhone.length < 10) {
            toast.error("Please enter a valid phone number");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const phoneNumber = form.phone.startsWith("+") ? form.phone : `${countryCode}${form.phone}`;
            console.log("📱 Sending OTP to:", phoneNumber);
            
            // Ensure verifier is ready
            const verifier = setupRecaptcha();
            
            const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
            setConfirmationResult(confirmation);
            toast.success("OTP sent successfully!");
        } catch (err) {
            console.error("🚨 FIREBASE AUTH ERROR:", {
                code: err.code,
                message: err.message,
                stack: err.stack,
                customData: err.customData // Identity Platform sends extra detail here
            });
            
            if (err.code === 'auth/invalid-app-credential') {
                setError(`Google rejected the request. Reason: ${err.message}. Please ensure the API is fully propagated.`);
            } else if (err.code === 'auth/too-many-requests') {
                setError("Rate limit reached. Testing with a real number? Add it to 'Testing Numbers' in Firebase Console.");
            } else {
                setError(err.message || "Failed to send OTP.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.cpassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/Ulogin`, form);
            const { token: accessToken, refreshToken, user } = res.data;

            localStorage.setItem("usertoken", accessToken);
            localStorage.setItem("refreshtoken", refreshToken);
            localStorage.setItem("userrole", user.role);

            setToken(accessToken);
            setUser(user);
            setLogin(true);
            toast.success("Login successful!");
            navigate(user.role === "admin" ? "/dashboard" : "/");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
            setTimeout(() => setError(""), 4000);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            const storedRole = localStorage.getItem("userrole");
            navigate(storedRole === "admin" ? "/dashboard" : "/Account");
        }
    }, [token, navigate]);

    return (
        <div className="login-wrapper">
            <div className="login-form-container shadow-lg">
                <div className="login-form">
                    <h2 className="login-title">LOGIN</h2>
                    
                    {/* 🛡️ ABSOLUTE STABILITY: Permanent Recaptcha Container */}
                    {/* This div NEVER leaves the DOM to prevent reCAPTCHA script crashes */}
                    <div 
                        style={{ 
                            position: loginMode === 'phone' && !confirmationResult ? 'static' : 'absolute',
                            left: loginMode === 'phone' && !confirmationResult ? '0' : '-9999px',
                            opacity: loginMode === 'phone' && !confirmationResult ? '1' : '0',
                            visibility: loginMode === 'phone' && !confirmationResult ? 'visible' : 'hidden',
                            height: loginMode === 'phone' && !confirmationResult ? 'auto' : '0px',
                            marginBottom: loginMode === 'phone' && !confirmationResult ? '20px' : '0px'
                        }}
                    >
                        <div 
                            id="recaptcha-container" 
                            ref={recaptchaContainerRef} 
                            className="d-flex justify-content-center"
                            style={{ minHeight: '100px' }}
                        ></div>
                        <p className="text-center text-muted x-small mt-2">Please complete verification</p>
                    </div>

                    {!confirmationResult && (
                        <div className="login-mode-toggle d-flex mb-4 p-1 bg-light rounded-pill">
                            <button type="button" 
                                className={`btn flex-grow-1 rounded-pill py-2 fw-bold transition-all ${loginMode === 'email' ? 'bg-dark text-white shadow' : 'text-muted'}`}
                                onClick={() => setLoginMode("email")}
                            >
                                Email
                            </button>
                            <button type="button" 
                                className={`btn flex-grow-1 rounded-pill py-2 fw-bold transition-all ${loginMode === 'phone' ? 'bg-dark text-white shadow' : 'text-muted'}`}
                                onClick={() => setLoginMode("phone")}
                            >
                                Phone (OTP)
                            </button>
                        </div>
                    )}

                    {error && <div className="login-error alert alert-danger p-2 text-center small mb-3">{error}</div>}

                    {!confirmationResult ? (
                        <>
                            {loginMode === 'email' ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <input type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} required className="login-input" />
                                    </div>
                                    <div className="mb-4">
                                        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="login-input" />
                                    </div>
                                    <div className="mb-4">
                                        <input type="password" name="cpassword" placeholder="Confirm Password" value={form.cpassword} onChange={handleChange} required className="login-input" />
                                    </div>
                                    <button type="submit" className="login-button w-100 py-3 rounded-pill fw-bold" disabled={loading}>
                                        {loading ? <span className="spinner-border spinner-border-sm"></span> : "Sign In"}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleSendOtp}>
                                    <div className="mb-4 text-center">
                                        <p className="text-muted small">We'll send a 6-digit code to your phone.</p>
                                        <div className="input-group">
                                            <select 
                                                className="form-select bg-white border-end-0" 
                                                style={{ maxWidth: '85px', fontSize: '0.9rem' }}
                                                value={countryCode}
                                                onChange={(e) => setCountryCode(e.target.value)}
                                            >
                                                <option value="+91">IN +91</option>
                                                <option value="+1">US +1</option>
                                            </select>
                                            <input 
                                                type="tel" 
                                                name="phone" 
                                                placeholder="Phone Number" 
                                                value={form.phone} 
                                                onChange={handleChange} 
                                                required 
                                                className="login-input border-start-0" 
                                                maxLength={countryCode === "+1" ? "10" : "10"} 
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="login-button w-100 py-3 rounded-pill fw-bold" disabled={loading}>
                                        {loading ? <span className="spinner-border spinner-border-sm"></span> : "Send OTP"}
                                    </button>
                                </form>
                            )}
                        </>
                    ) : (
                        <OtpVerify 
                            confirmationResult={confirmationResult} 
                            phone={form.phone} 
                            onBack={() => setConfirmationResult(null)} 
                        />
                    )}

                    <div className="login-links mt-4">
                        <p className="mb-2 text-center small text-muted">
                            Don’t have an account? <NavLink to="/Signup" className="text-gold fw-bold">Create one</NavLink>
                        </p>
                        <p className="text-center small">
                            <NavLink to="/forgot-password">Forgot your password?</NavLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
