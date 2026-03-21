import React from "react";
import { useCart } from "./context/CartContext";
import { useNavigate } from "react-router-dom";

const MainCart = ({ isOpen, onClose }) => {
    const { cartItems, removeFromCart } = useCart();
    const navigate = useNavigate();

    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
    );

    return (
        <div className="">
            {/* Background Blur */}
            <div
                className={`cart-backdrop ${isOpen ? "visible" : ""}`}
                onClick={onClose}
            ></div>

            {/* Cart Sidebar */}
            <div className={`cart-sidebar shadow-lg p-5 ${isOpen ? "show" : ""}`} style={{ background: 'var(--bg-cream)', color: 'var(--text-primary)', borderLeft: '1px solid var(--border-soft)' }}>
                <div className="offcanvas-header mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                    <h5 className="offcanvas-title fw-bold" style={{ letterSpacing: '1px', color: 'var(--text-primary)' }}>🛒 MY LUXURY CART</h5>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>

                <div className="offcanvas-body">
                    {cartItems.length === 0 ? (
                        <div className="text-center mt-5">
                            <h6>Your cart is empty.</h6>
                            <button
                                style={{ borderRadius: '4px', marginInlineEnd: 10, background: 'var(--gold-gradient)', border: 'none' }}
                                className="btn text-white mt-3 px-4 py-2 fw-bold shadow-sm"
                                onClick={() => {
                                    onClose();
                                    navigate("/BestSellers");
                                }}
                            >
                                Start Shopping
                            </button>
                            <button
                                style={{ borderRadius: '4px', border: '1px solid var(--pink-accent)', color: 'var(--pink-accent)' }}
                                className="btn mt-3 px-4 py-2 fw-bold"
                                onClick={() => {
                                    onClose();
                                    navigate("/CartPage");
                                }}
                            >
                                View Cart
                            </button>

                        </div>
                    ) : (
                        <>
                            {cartItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="d-flex align-items-center mb-3 border-bottom pb-2"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.Product}
                                        className="img-fluid rounded me-2"
                                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                    />
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1">{item.Product}</h6>
                                        <p className="mb-1 text-secondary">
                                            ₹{item.price} × {item.quantity}
                                        </p>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => removeFromCart(item)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}

                             <div className="border-top pt-3 mt-4" style={{ borderColor: 'var(--border-soft)' }}>
                                <div className="d-flex justify-content-between mb-4">
                                    <span className="fw-medium">Total:</span>
                                    <strong className="fs-5">₹{totalPrice}</strong>
                                </div>
                                <div className="cart-footer">
                                    <button
                                        style={{ borderRadius: '4px', background: 'var(--gold-gradient)', border: 'none' }}
                                        className="btn text-white w-100 mb-2 py-3 fw-bold shadow-sm"
                                        onClick={() => {
                                            onClose();
                                            navigate("/CartPage");
                                        }}
                                    >
                                        PROCEED TO CHECKOUT
                                    </button>
                                    <button
                                        style={{ borderRadius: '4px', border: '1px solid var(--pink-accent)', color: 'var(--pink-accent)' }}
                                        className="btn w-100 py-3 fw-bold"
                                        onClick={() => {
                                            onClose();
                                            navigate("/CartPage");
                                        }}
                                    >
                                        VIEW CART
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainCart;
