import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../hooks/useOrder';

const CartPage = () => {
    const navigate = useNavigate();
    const { placeOrder, loading } = useOrder();
    const [cartItems, setCartItems] = useState([]);

    // Load items from LocalStorage on mount
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

        // The backend orderController expects an array of game_ids in the 'items' field
        const gameIds = cartItems.map(item => item.id);
        console.log("Sending to backend:", { gameIds });
        const res = await placeOrder({ items: gameIds });

        if (res.success) {
            alert("Purchase successful! You can now download your games.");
            localStorage.removeItem('cart'); // Clear cart on success
            setCartItems([]);
            navigate('/my-library'); // Redirect to a library or orders page
        } else {
            alert("Checkout failed: " + res.message);
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h2>Your Shopping Cart</h2>
            <hr />

            {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Your cart is empty.</p>
                    <button 
                        onClick={() => navigate('/browse')}
                        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Browse Games
                    </button>
                </div>
            ) : (
                <>
                    <div style={{ marginTop: '20px' }}>
                        {cartItems.map(item => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <img src={item.imagePath} alt={item.title} style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <div>
                                        <h4 style={{ margin: 0 }}>{item.title}</h4>
                                        <p style={{ margin: '5px 0', color: '#666' }}>${item.price}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeItem(item.id)}
                                    style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'right' }}>
                        <h3 style={{ margin: 0 }}>Total: ${totalPrice.toFixed(2)}</h3>
                        <p style={{ color: '#777', fontSize: '14px' }}>Tax included at checkout</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }}>
                            <button 
                                onClick={() => navigate('/browse')}
                                style={{ padding: '12px 24px', background: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                            >
                                Continue Shopping
                            </button>
                            <button 
                                onClick={handleCheckout}
                                disabled={loading}
                                style={{ 
                                    padding: '12px 30px', 
                                    background: loading ? '#ccc' : '#28a745', 
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '6px', 
                                    fontWeight: 'bold', 
                                    cursor: loading ? 'default' : 'pointer' 
                                }}
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