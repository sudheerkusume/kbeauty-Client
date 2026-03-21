import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { loginStatus } from "../App";
import { useCart } from "./context/CartContext";
import API_BASE_URL from "./config";
import { IoChevronBack, IoCheckmarkCircle } from "react-icons/io5";
import "./Order.css";

const Order = () => {
    const { token, user: loggedInUser } = useContext(loginStatus);
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();

    const [currentStep, setCurrentStep] = useState(1); // 1: Information, 2: Shipping, 3: Payment
    const [loading, setLoading] = useState(false);
    const [paymentMode, setPaymentMode] = useState("Cash on Delivery");

    const [formData, setFormData] = useState({
        email: loggedInUser?.email || "",
        phone: loggedInUser?.phone || "",
        shippingAddress: {
            firstName: loggedInUser?.name?.split(" ")[0] || "",
            lastName: loggedInUser?.name?.split(" ").slice(1).join(" ") || "",
            email: loggedInUser?.email || "",
            address: loggedInUser?.address || "",
            apartment: "",
            city: "",
            state: "",
            pincode: "",
            phone: loggedInUser?.phone || ""
        },
        billingSameAsShipping: true,
        billingAddress: {
            firstName: "",
            lastName: "",
            address: "",
            apartment: "",
            city: "",
            state: "",
            pincode: "",
            phone: ""
        }
    });

    useEffect(() => {
        if (loggedInUser) {
            setFormData(prev => ({
                ...prev,
                email: prev.email || loggedInUser.email || "",
                phone: prev.phone || loggedInUser.phone || "",
                shippingAddress: {
                    ...prev.shippingAddress,
                    firstName: prev.shippingAddress.firstName || loggedInUser.name?.split(" ")[0] || "",
                    lastName: prev.shippingAddress.lastName || loggedInUser.name?.split(" ").slice(1).join(" ") || "",
                    email: prev.shippingAddress.email || loggedInUser.email || "",
                    address: prev.shippingAddress.address || loggedInUser.address || "",
                    phone: prev.shippingAddress.phone || loggedInUser.phone || ""
                }
            }));
        }
    }, [loggedInUser]);

    // Totals calculation
    const subtotal = cartItems.reduce((acc, item) => {
        const numericPrice = Number(item.price.toString().replace(/[^0-9.-]+/g, ""));
        return acc + numericPrice * (item.quantity || 1);
    }, 0);
    const shippingFee = subtotal > 1000 ? 0 : 50;
    const tax = Math.round(subtotal * 0.18); // 18% GST snapshot
    const totalAmount = subtotal + shippingFee + tax;

    const handleInputChange = (e, section, field) => {
        const value = e.target.value;
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: { ...prev[section], [field]: value }
            }));
        } else {
            // If updating root email, also update shippingAddress email
            if (field === "email") {
                setFormData(prev => ({
                    ...prev,
                    email: value,
                    shippingAddress: { ...prev.shippingAddress, email: value }
                }));
            } else {
                setFormData(prev => ({ ...prev, [field]: value }));
            }
        }
    };


    const nextStep = () => {
        if (currentStep === 1) {
            const { shippingAddress, email } = formData;
            // Validate all fields required by backend validator
            if (!email || !shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode || !shippingAddress.phone) {
                toast.error("Please fill in all required fields (Name, Address, City, State, Pincode, Phone)");
                return;
            }
            if (shippingAddress.pincode.length !== 6) {
                toast.error("Pincode must be 6 digits");
                return;
            }
            if (shippingAddress.phone.length !== 10) {
                toast.error("Phone number must be 10 digits");
                return;
            }
        }
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handlePaymentSuccess = async (response) => {
        setLoading(true);
        try {
            const payload = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: cartItems.map(item => ({
                    productId: item._id,
                    name: item.title || item.name,
                    price: Number(item.price.toString().replace(/[^0-9.-]+/g, "")),
                    qty: item.quantity || 1,
                    image: item.image
                })),
                shippingAddress: formData.shippingAddress,
                billingAddress: formData.billingSameAsShipping ? formData.shippingAddress : formData.billingAddress,
                subtotal,
                shippingFee,
                tax,
                total: totalAmount
            };

            const { data } = await axios.post(`${API_BASE_URL}/api/payment/verify-payment`, payload, {
                headers: { "x-token": token },
            });

            toast.success(`Order ${data.customOrderId} placed!`);
            await clearCart();
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Payment verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleOnlinePayment = async () => {
        setLoading(true);
        try {
            const { data: order } = await axios.post(`${API_BASE_URL}/api/payment/create-order`, { amount: totalAmount }, {
                headers: { "x-token": token },
            });

            const options = {
                key: order.key_id,
                amount: order.amount,
                currency: order.currency,
                name: "K-Beauty Mart",
                description: "Purchase of Premium Products",
                order_id: order.id,
                handler: (res) => handlePaymentSuccess(res),
                prefill: {
                    name: `${formData.shippingAddress.firstName} ${formData.shippingAddress.lastName}`,
                    email: formData.email,
                    contact: formData.shippingAddress.phone
                },
                theme: { color: "#D4AF37" },
                modal: { ondismiss: () => setLoading(false) }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            toast.error("Failed to initialize payment");
            setLoading(false);
        }
    };

    const processOrder = async () => {
        if (paymentMode === "Online Payment") {
            handleOnlinePayment();
            return;
        }

        setLoading(true);
        try {
            const codPayload = {
                items: cartItems.map(item => ({
                    productId: item._id,
                    name: item.title || item.name,
                    price: Number(item.price.toString().replace(/[^0-9.-]+/g, "")),
                    qty: item.quantity || 1,
                    image: item.image
                })),
                shippingAddress: formData.shippingAddress,
                billingAddress: formData.billingSameAsShipping ? formData.shippingAddress : formData.billingAddress,
                subtotal,
                shippingFee,
                tax,
                total: totalAmount
            };

            const { data } = await axios.post(`${API_BASE_URL}/api/payment/cod`, codPayload, {
                headers: { "x-token": token }
            });

            toast.success(`Order ${data.customOrderId} placed successfully!`);
            await clearCart();
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    const StepIndicator = () => (
        <div className="step-indicator">
            <div className={`step-item ${currentStep >= 1 ? "completed" : ""} ${currentStep === 1 ? "active" : ""}`}>
                <div className="step-number">{currentStep > 1 ? <IoCheckmarkCircle size={18} /> : "1"}</div>
                <span>Information</span>
            </div>
            <div className="step-line"></div>
            <div className={`step-item ${currentStep >= 2 ? "completed" : ""} ${currentStep === 2 ? "active" : ""}`}>
                <div className="step-number">{currentStep > 2 ? <IoCheckmarkCircle size={18} /> : "2"}</div>
                <span>Shipping</span>
            </div>
            <div className="step-line"></div>
            <div className={`step-item ${currentStep >= 3 ? "completed" : ""} ${currentStep === 3 ? "active" : ""}`}>
                <div className="step-number">3</div>
                <span>Payment</span>
            </div>
        </div>
    );

    return (
        <div className="checkout-container py-5">
            <Toaster position="top-right" />
            <div className="container">
                <div className="row g-5">
                    {/* Main Content */}
                    <div className="col-lg-7">
                        <div className="d-flex align-items-center mb-4">
                            <h2 className="brand-logo mb-0 me-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, color: 'var(--text-primary)' }}>K-BEAUTY</h2>
                            <StepIndicator />
                        </div>

                        {currentStep === 1 && (
                            <div className="fade-in">
                                <section className="mb-5">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="checkout-title mb-0">Contact Information</h5>
                                        {!loggedInUser && <span className="small text-muted">Already have an account? <a href="/login" style={{ color: 'var(--pink-accent)' }}>Log in</a></span>}
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            id="email" 
                                            placeholder="Email" 
                                            value={formData.email}
                                            onChange={(e) => handleInputChange(e, null, "email")}
                                        />
                                        <label htmlFor="email">Email address</label>
                                    </div>
                                </section>

                                <section>
                                    <h5 className="checkout-title">Shipping Address</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input type="text" className="form-control" placeholder="First Name" value={formData.shippingAddress.firstName} onChange={(e) => handleInputChange(e, "shippingAddress", "firstName")} />
                                                <label>First Name</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input type="text" className="form-control" placeholder="Last Name" value={formData.shippingAddress.lastName} onChange={(e) => handleInputChange(e, "shippingAddress", "lastName")} />
                                                <label>Last Name</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <input type="text" className="form-control" placeholder="Address" value={formData.shippingAddress.address} onChange={(e) => handleInputChange(e, "shippingAddress", "address")} />
                                                <label>Address</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <input type="text" className="form-control" placeholder="Apartment, suite, etc." value={formData.shippingAddress.apartment} onChange={(e) => handleInputChange(e, "shippingAddress", "apartment")} />
                                                <label>Apartment, suite, etc. (optional)</label>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input type="text" className="form-control" placeholder="City" value={formData.shippingAddress.city} onChange={(e) => handleInputChange(e, "shippingAddress", "city")} />
                                                <label>City</label>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input type="text" className="form-control" placeholder="State" value={formData.shippingAddress.state} onChange={(e) => handleInputChange(e, "shippingAddress", "state")} />
                                                <label>State</label>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-floating">
                                                <input type="text" className="form-control" placeholder="Pincode" value={formData.shippingAddress.pincode} onChange={(e) => handleInputChange(e, "shippingAddress", "pincode")} />
                                                <label>Pincode</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <input type="tel" className="form-control" placeholder="Phone" value={formData.shippingAddress.phone} onChange={(e) => handleInputChange(e, "shippingAddress", "phone")} />
                                                <label>Phone</label>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="d-flex justify-content-end mt-5">
                                    <button className="btn btn-premium px-5 py-3" onClick={nextStep}>Continue to Shipping</button>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="fade-in">
                                <div className="checkout-card mb-4">
                                    <div className="d-flex justify-content-between border-bottom border-secondary pb-3 mb-3">
                                        <div className="small text-muted w-25">Contact</div>
                                        <div className="small flex-grow-1">{formData.email}</div>
                                        <button className="btn btn-link text-gold btn-sm p-0" onClick={() => setCurrentStep(1)}>Change</button>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div className="small text-muted w-25">Ship to</div>
                                        <div className="small flex-grow-1">{formData.shippingAddress.address}, {formData.shippingAddress.city}, {formData.shippingAddress.pincode}</div>
                                        <button className="btn btn-link btn-sm p-0" style={{ color: 'var(--pink-accent)', textDecoration: 'none' }} onClick={() => setCurrentStep(1)}>Change</button>
                                    </div>
                                </div>

                                <section>
                                    <h5 className="checkout-title mt-5">Shipping Method</h5>
                                    <div className="payment-option active d-flex justify-content-between align-items-center">
                                        <div>
                                            <div className="fw-bold">Standard Shipping</div>
                                            <div className="small text-muted">Estimated delivery: 3-5 business days</div>
                                        </div>
                                        <div className="fw-bold">{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</div>
                                    </div>
                                </section>

                                <div className="d-flex justify-content-between align-items-center mt-5">
                                    <button className="btn-back" onClick={prevStep}><IoChevronBack /> Return to Information</button>
                                    <button className="btn btn-premium px-5 py-3" onClick={nextStep}>Continue to Payment</button>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="fade-in">
                                <div className="checkout-card mb-5">
                                    <div className="d-flex justify-content-between border-bottom border-secondary pb-3 mb-3">
                                        <div className="small text-muted w-25">Contact</div>
                                        <div className="small flex-grow-1">{formData.email}</div>
                                        <button className="btn btn-link text-gold btn-sm p-0" onClick={() => setCurrentStep(1)}>Change</button>
                                    </div>
                                    <div className="d-flex justify-content-between border-bottom border-secondary pb-3 mb-3">
                                        <div className="small text-muted w-25">Ship to</div>
                                        <div className="small flex-grow-1">{formData.shippingAddress.address}, {formData.shippingAddress.city}</div>
                                        <button className="btn btn-link text-gold btn-sm p-0" onClick={() => setCurrentStep(1)}>Change</button>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div className="small text-muted w-25">Method</div>
                                        <div className="small flex-grow-1">Standard Shipping · {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</div>
                                    </div>
                                </div>

                                <section>
                                    <h5 className="checkout-title">Payment</h5>
                                    <p className="small text-muted mb-4">All transactions are secure and encrypted.</p>
                                    
                                    <div className={`payment-option ${paymentMode === "Online Payment" ? "active" : ""}`} onClick={() => setPaymentMode("Online Payment")}>
                                        <div className="d-flex align-items-center gap-3">
                                            <input type="radio" checked={paymentMode === "Online Payment"} readOnly />
                                            <div>
                                                <div className="fw-bold">Online Payment (Razorpay)</div>
                                                <div className="small text-muted">UPI, Cards, Netbanking</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`payment-option ${paymentMode === "Cash on Delivery" ? "active" : ""}`} onClick={() => setPaymentMode("Cash on Delivery")}>
                                        <div className="d-flex align-items-center gap-3">
                                            <input type="radio" checked={paymentMode === "Cash on Delivery"} readOnly />
                                            <div>
                                                <div className="fw-bold">Cash on Delivery (COD)</div>
                                                <div className="small text-muted">Pay on delivery</div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="d-flex justify-content-between align-items-center mt-5">
                                    <button className="btn-back" onClick={prevStep}><IoChevronBack /> Return to Shipping</button>
                                    <button className="btn btn-premium px-5 py-3" disabled={loading} onClick={processOrder}>
                                        {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : "Place Order"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Order Summary */}
                    <div className="col-lg-5">
                        <div className="order-summary-sticky">
                            <div className="checkout-card">
                                <h5 className="checkout-title mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--border-soft)' }}>Your Cart ({cartItems.length} items)</h5>
                                
                                <div className="mb-4">
                                    {cartItems.map((item, idx) => (
                                        <div key={idx} className="d-flex align-items-center gap-3 mb-3 position-relative">
                                            <div className="position-relative">
                                                <img src={item.image} alt={item.title} className="product-thumb" />
                                                <span className="product-qty-badge">{item.quantity || 1}</span>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="small fw-bold">{item.title}</div>
                                                <div className="small text-muted">₹{Number(item.price).toLocaleString()}</div>
                                            </div>
                                            <div className="small fw-bold">₹{(Number(item.price) * (item.quantity || 1)).toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="summary-item">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="summary-item">
                                    <span>Shipping</span>
                                    <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee.toLocaleString()}`}</span>
                                </div>
                                <div className="summary-item">
                                    <span>Estimated Tax (18%)</span>
                                    <span>₹{tax.toLocaleString()}</span>
                                </div>
                                <div className="summary-total mt-4">
                                    <span>Total</span>
                                    <div className="text-end">
                                        <span className="small text-muted fw-normal me-2">INR</span>
                                        <span>₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;
