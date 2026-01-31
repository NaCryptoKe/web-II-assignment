import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../hooks/useOrder';
import '../css/cart-page.css';

const CartPage = () => {
    const navigate = useNavigate();
    const { placeOrder, loading } = useOrder();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(savedCart);
    }, []);

    const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

    const removeItem = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) return alert("Your cart is empty!");

        const gameIds = cartItems.map(item => item.id);
        const res = await placeOrder({ items: gameIds });

        if (res.success) {
            alert("Purchase successful! You can now download your games.");
            localStorage.removeItem('cart');
            localStorage.clear();
            setCartItems([]);
            navigate('/my-library');
        } else {
            alert("Checkout failed: " + res.message);
        }
    };

    return (
        <div className="cart-container">
            <h2 className="cart-header">Your Shopping Cart</h2>
            <div className="cart-divider"></div>

            {cartItems.length === 0 ? (
                <div className="cart-empty-state">
                    <p>Your cart is empty.</p>
                    <button
                        className="btn-browse"
                        onClick={() => navigate('/browse')}
                    >
                        Browse Games
                    </button>
                </div>
            ) : (
                <>
                    <div className="cart-list">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-details">
                                    <img src={item.imagePath} alt={item.title} className="cart-item-img" />
                                    <div>
                                        <h4 className="cart-item-title">{item.title}</h4>
                                        <p className="cart-item-price">${item.price}</p>
                                    </div>
                                </div>
                                <button
                                    className="cart-remove-btn"
                                    onClick={() => removeItem(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3 className="cart-total">Total: ${totalPrice.toFixed(2)}</h3>
                        <p className="cart-tax-note">Tax included at checkout</p>

                        <div className="cart-actions">
                            <button
                                className="btn-secondary"
                                onClick={() => navigate('/browse')}
                            >
                                Continue Shopping
                            </button>
                            <button
                                className="btn-checkout"
                                onClick={handleCheckout}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Complete Purchase"}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;