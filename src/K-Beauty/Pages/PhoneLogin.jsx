import { useState, useEffect, useRef } from "react";
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast } from "react-toastify";

function PhoneLogin() {

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmation, setConfirmation] = useState(null);

    const recaptchaVerifier = useRef(null);

    // Initialize reCAPTCHA once
    useEffect(() => {

        if (!recaptchaVerifier.current) {

            try {
                recaptchaVerifier.current = new RecaptchaVerifier(
                    auth,
                    "recaptcha-container",
                    {
                        size: "invisible",
                        callback: (response) => {
                            console.log("reCAPTCHA solved:", response);
                        },
                        "expired-callback": () => {
                            console.log("reCAPTCHA expired");
                            toast.warning("reCAPTCHA expired. Please try again.");
                        }
                    }
                );
            } catch (err) {
                console.error("reCAPTCHA initialization error:", err);
            }

        }

        return () => {
            if (recaptchaVerifier.current) {
                try {
                    recaptchaVerifier.current.clear();
                    recaptchaVerifier.current = null;
                } catch (err) {
                    console.error("reCAPTCHA cleanup error:", err);
                }
            }
        };

    }, []);

    // Send OTP
    const sendOTP = async () => {

        if (!phone) {
            toast.error("Please enter a phone number");
            return;
        }

        try {

            const result = await signInWithPhoneNumber(
                auth,
                phone,
                recaptchaVerifier.current
            );

            setConfirmation(result);
            toast.success("OTP Sent Successfully!");

        } catch (error) {

            console.error("OTP Error:", error);
            // Check for specific firebase error
            if (error.code === 'auth/billing-not-enabled') {
                toast.error("Billing not enabled. Please use a Test Phone Number.");
            } else {
                toast.error("Failed to send OTP. Check console for details.");
            }

        }

    };

    // Verify OTP
    const verifyOTP = async () => {

        if (!otp) {
            toast.error("Please enter the OTP");
            return;
        }

        if (!confirmation) {
            toast.error("Please send OTP first");
            return;
        }

        try {

            await confirmation.confirm(otp);
            toast.success("Login Successful!");

        } catch (error) {

            console.error("OTP Verify Error:", error);
            toast.error("Invalid OTP. Please try again.");

        }

    };

    return (

        <div style={{ padding: "40px", maxWidth: "400px", margin: "0 auto" }}>

            <h2 style={{ marginBottom: "20px" }}>Mobile Login</h2>

            <div style={{ marginBottom: "15px" }}>
                <input
                    style={{ padding: "10px", width: "100%", borderRadius: "5px", border: "1px solid #ccc" }}
                    placeholder="+919848885818"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>

            <button
                style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", width: "100%" }}
                onClick={sendOTP}
            >
                Send OTP
            </button>

            <div style={{ marginTop: "25px", marginBottom: "15px" }}>
                <input
                    style={{ padding: "10px", width: "100%", borderRadius: "5px", border: "1px solid #ccc" }}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
            </div>

            <button
                style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", width: "100%" }}
                onClick={verifyOTP}
            >
                Verify OTP
            </button>

            <div id="recaptcha-container" style={{ marginTop: "20px" }}></div>

        </div>

    );

}

export default PhoneLogin;