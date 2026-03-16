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
            <div className={`cart-sidebar bg-black text-white border-start border-secondary shadow-lg p-5 ${isOpen ? "show" : ""}`}>
                <div className="offcanvas-header border-bottom border-secondary mb-4 pb-3">
                    <h5 className="offcanvas-title fw-bold text-gold" style={{ letterSpacing: '1px' }}>🛒 MY LUXURY CART</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                </div>

                <div className="offcanvas-body">
                    {cartItems.length === 0 ? (
                        <div className="text-center mt-5">
                            <h6>Your cart is empty.</h6>
                            <button
                                style={{ borderRadius: 0, marginInlineEnd: 10 }}
                                className="btn btn-gold mt-3 px-4 py-2 fw-bold"
                                onClick={() => {
                                    onClose();
                                    navigate("/BestSellers");
                                }}
                            >
                                Start Shopping
                            </button>
                            <button
                                style={{ borderRadius: 0 }}
                                className="btn btn-outline-gold mt-3 px-4 py-2 fw-bold"
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

                            <div className="border-top pt-3 mt-4">
                                <div className="d-flex justify-content-between">
                                    <span>Total:</span>
                                    <strong>₹{totalPrice}</strong>
                                </div>
                                <div className="cart-footer">
                                    <button
                                        style={{ borderRadius: 0 }}
                                        className="btn btn-gold w-100 mb-2 py-3 fw-bold"
                                        onClick={() => {
                                            onClose();
                                            navigate("/CartPage");
                                        }}
                                    >
                                        PROCEED TO CHECKOUT
                                    </button>
                                    <button
                                        style={{ borderRadius: 0 }}
                                        className="btn btn-outline-gold w-100 py-3 fw-bold"
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
