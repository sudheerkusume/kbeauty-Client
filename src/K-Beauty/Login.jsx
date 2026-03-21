import axios from "axios";
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { loginStatus } from "../App";
import API_BASE_URL from "./config";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import toast from "react-hot-toast";
import OtpVerify from "./Components/OtpVerify";
import MainLogo from "./assets/Mainlogo.png";

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
        <div className="login-wrapper ultimate-elite-layout">
            <div className="luxury-card-container shadow-2xl">
                {/* Left Luxury Panel - Editorial Visual */}
                <div className="luxury-side-panel d-none d-lg-flex">
                    <div className="luxury-content">
                        <img src={MainLogo} alt="K-Beauty Logo" className="elite-logo-hero" />
                        <div className="luxury-divider"></div>
                        <h1 className="luxury-quote">"Unlock Your <br/>Radiant Glow"</h1>
                        <p className="luxury-legal">PRESTIGIOUS KOREAN SKINCARE PORTAL</p>
                    </div>
                    {/* Animated Particles */}
                    <div className="glow-particle p1"></div>
                    <div className="glow-particle p2"></div>
                    <div className="glow-particle p3"></div>
                </div>

                {/* Right Form Panel - High-End Minimalist */}
                <div className="login-side-panel">
                    <div className="login-form-inner">
                        <div className="text-center mb-5 d-lg-none">
                            <img src={MainLogo} alt="K-Beauty Logo" className="mobile-logo" />
                        </div>
                        
                        <h2 className="login-title">WELCOME BACK</h2>
                        <p className="text-center mb-5 elite-subtitle">Sign in to access your curated skincare collection.</p>
                    
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
                        <div className="login-mode-toggle d-flex mb-5 p-1 elite-switcher-bg rounded-pill">
                            <button type="button" 
                                className={`btn flex-grow-1 rounded-pill py-2 fw-bold transition-all ${loginMode === 'email' ? 'active-elite-btn' : 'inactive-elite-btn'}`}
                                onClick={() => setLoginMode("email")}
                            >
                                Email
                            </button>
                            <button type="button" 
                                className={`btn flex-grow-1 rounded-pill py-2 fw-bold transition-all ${loginMode === 'phone' ? 'active-elite-btn' : 'inactive-elite-btn'}`}
                                onClick={() => setLoginMode("phone")}
                            >
                                Phone
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
                                    <button type="submit" className="login-button elite-btn-gradient w-100 py-3 rounded-pill fw-bold" disabled={loading}>
                                        {loading ? <span className="spinner-border spinner-border-sm"></span> : "Sign In to Boutique"}
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
                                    <button type="submit" className="login-button elite-btn-gradient w-100 py-3 rounded-pill fw-bold" disabled={loading}>
                                        {loading ? <span className="spinner-border spinner-border-sm"></span> : "Request Access Code"}
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

                    <div className="login-links mt-5">
                        <p className="mb-2 text-center small text-muted">
                            New to our Boutique? <NavLink to="/Signup" className="boutique-link-highlight">Apply for Membership</NavLink>
                        </p>
                        <p className="text-center small">
                            <NavLink to="/forgot-password" style={{ color: '#B17A7E', opacity: 0.6, fontSize: '0.8rem', letterSpacing: '1px' }}>RECOVERY ACCESS</NavLink>
                        </p>
                    </div>
                    </div>
                </div>
            </div>

            <style>{`
                .ultimate-elite-layout {
                    min-height: calc(100vh - 80px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #FFFBF7;
                    padding: 40px 20px;
                    font-family: 'Outfit', sans-serif;
                }
                
                .luxury-card-container {
                    display: flex;
                    width: 100%;
                    max-width: 1100px;
                    min-height: 700px;
                    background: #fff;
                    border-radius: 40px;
                    overflow: hidden;
                    box-shadow: 0 40px 100px -20px rgba(177, 122, 126, 0.25) !important;
                }

                /* --- Luxury Side Panel (Desktop) --- */
                .luxury-side-panel {
                    flex: 1.1;
                    background: linear-gradient(135deg, #B17A7E 0%, #E8B4B8 100%);
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    height: auto; /* Match height via flex stretch */
                }
                .luxury-side-panel::before {
                    content: '';
                    position: absolute;
                    width: 100%; height: 100%;
                    background: radial-gradient(circle at top right, rgba(255,255,255,0.3), transparent 70%);
                }
                .luxury-content { text-align: center; z-index: 10; color: #fff; padding: 40px; }
                .elite-logo-hero {
                    height: 160px;
                    width: auto;
                    filter: brightness(0) invert(1) drop-shadow(0 10px 20px rgba(0,0,0,0.1));
                    margin-bottom: 30px;
                }
                .luxury-divider { width: 50px; height: 1.5px; background: #fff; margin: 20px auto; opacity: 0.6; }
                .luxury-quote {
                    font-family: 'Playfair Display', serif;
                    font-style: italic;
                    font-size: 2.8rem;
                    line-height: 1.1;
                    letter-spacing: 1px;
                    margin-bottom: 20px;
                    color: #fff;
                    text-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }
                .luxury-legal { font-size: 0.8rem; letter-spacing: 5px; opacity: 0.9; font-weight: 400; }

                /* --- Login Side Panel --- */
                .login-side-panel {
                    flex: 1;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 60px;
                    height: auto;
                }
                .login-form-inner { width: 100%; max-width: 380px; }
                .mobile-logo { height: 90px; width: auto; margin-bottom: 20px; filter: drop-shadow(0 5px 15px rgba(177, 122, 126, 0.15)); }
                
                .login-title {
                    font-family: 'Playfair Display', serif;
                    font-weight: 700;
                    letter-spacing: 6px;
                    color: #5A3E3F;
                    text-align: center;
                    margin-bottom: 10px;
                    font-size: 1.8rem;
                }
                .elite-subtitle { color: #B17A7E; opacity: 0.8; font-weight: 300; letter-spacing: 1px; font-size: 0.9rem; }
                
                .elite-switcher-bg { background: #F8F1ED; border: 1px solid rgba(177, 122, 126, 0.08); }
                .active-elite-btn { background: #B17A7E !important; color: #fff !important; box-shadow: 0 10px 20px rgba(177, 122, 126, 0.2); }
                .inactive-elite-btn { color: #B17A7E !important; opacity: 0.5; }
                
                .login-input {
                    background: transparent !important;
                    border: none !important;
                    border-bottom: 1.5px solid rgba(177, 122, 126, 0.2) !important;
                    border-radius: 0 !important;
                    padding: 15px 0 !important;
                    transition: all 0.4s ease !important;
                    color: #5A3E3F !important;
                    font-size: 16px !important;
                }
                .login-input:focus { border-bottom-color: #B17A7E !important; box-shadow: none !important; transform: translateY(-2px); }
                .login-input::placeholder { color: #B17A7E; opacity: 0.4; font-weight: 300; letter-spacing: 1px; }

                .elite-btn-gradient {
                    background: linear-gradient(135deg, #E8B4B8 0%, #B17A7E 100%) !important;
                    border: none !important;
                    color: #fff !important;
                    letter-spacing: 4px !important;
                    text-transform: uppercase;
                    padding: 16px !important;
                    transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
                    box-shadow: 0 15px 35px rgba(177, 122, 126, 0.25) !important;
                }
                .elite-btn-gradient:hover { transform: translateY(-4px); box-shadow: 0 20px 45px rgba(177, 122, 126, 0.35) !important; }
                
                .boutique-link-highlight { color: #B17A7E !important; font-weight: 800; text-decoration: none; border-bottom: 2px solid #E8B4B8; }
                .boutique-link-highlight:hover { background: rgba(232, 180, 184, 0.1); }

                /* --- Glowing Particles --- */
                .glow-particle {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.4);
                    border-radius: 50%;
                    filter: blur(8px);
                    animation: float 15s infinite ease-in-out;
                    pointer-events: none;
                }
                .p1 { width: 80px; height: 80px; top: 10%; right: 5%; }
                .p2 { width: 120px; height: 120px; bottom: 15%; left: 5%; animation-delay: 5s; }
                .p3 { width: 60px; height: 60px; top: 35%; left: 25%; animation-delay: 2s; }
                @keyframes float { 
                    0%, 100% { transform: translate(0,0) scale(1); opacity: 0.3; } 
                    50% { transform: translate(25px, -40px) scale(1.15); opacity: 0.7; } 
                }

                @media (max-width: 991px) {
                    .luxury-card-container { flex-direction: column; border-radius: 30px; min-height: auto; }
                    .login-side-panel { padding: 50px 30px; }
                    .login-title { font-size: 1.5rem; letter-spacing: 4px; }
                    .elite-subtitle { font-size: 0.85rem; margin-bottom: 30px !important; }
                    .elite-btn-gradient { padding: 12px !important; font-size: 0.9rem !important; letter-spacing: 2px !important; }
                    .elite-switcher-bg { margin-bottom: 30px !important; }
                    .login-links { mt-4 !important; }
                }
            `}</style>
        </div>
    );
};

export default Login;
