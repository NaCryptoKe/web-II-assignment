import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import '../css/navbar.css';
import logo from '../images/logo.svg'

const Navbar = () => {
    const { user } = useAuthContext();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const updateCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(cart.length);
        };

        updateCount();
        window.addEventListener('storage', updateCount);
        return () => window.removeEventListener('storage', updateCount);
    }, []);

    return (
        <nav className="navbar">
            {/* Logo */}
            <div className="nav-logo">
                <Link to="/">
                    <img src={logo} alt=""/>
                </Link>
            </div>

            {/* Nav Items */}
            <div className="nav-links">
                <Link to="/" className="nav-item">Home</Link>
                <Link to="/browse" className="nav-item">Browse</Link>

                <Link to="/cart" className="nav-item cart-link">
                    Cart
                    {cartCount > 0 && (
                        <span className="cart-badge">{cartCount}</span>
                    )}
                </Link>

                {user ? (
                    <>
                        <Link to="/dashboard" className="nav-item">Dashboard</Link>
                        {user.role === 'admin' && (
                            <Link to="/admin" className="nav-admin-btn">
                                Admin Panel
                            </Link>
                        )}
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-item">Login</Link>
                        <Link to="/register" className="nav-signup-btn">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;