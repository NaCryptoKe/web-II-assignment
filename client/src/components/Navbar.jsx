import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user } = useAuthContext();
    const [cartCount, setCartCount] = useState(0);

    // Update cart count from localStorage
    useEffect(() => {
        const updateCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(cart.length);
        };

        updateCount();
        window.addEventListener('storage', updateCount);
        return () => window.removeEventListener('storage', updateCount);
    }, []);

    // Styles
    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 50px',
        backgroundColor: '#1a1a1a',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    };

    const linkStyle = {
        color: 'white',
        textDecoration: 'none',
        fontSize: '1rem',
        fontWeight: '500',
        transition: 'color 0.2s'
    };

    const adminLinkStyle = {
        ...linkStyle,
        color: '#ff4d4d', // Distinctive red for Admin
        fontWeight: 'bold',
        border: '1px solid #ff4d4d',
        padding: '5px 12px',
        borderRadius: '4px'
    };

    return (
        <nav style={navStyle}>
            {/* Logo */}
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                <Link to="/" style={{ ...linkStyle, color: '#007bff' }}>
                    GAME<span style={{color: '#fff'}}>VAULT</span>
                </Link>
            </div>

            {/* Nav Items */}
            <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                <Link to="/" style={linkStyle}>Home</Link>
                <Link to="/browse" style={linkStyle}>Browse</Link>
                
                <Link to="/cart" style={linkStyle}>
                    Cart {cartCount > 0 && (
                        <span style={{ 
                            background: '#ffc107', 
                            color: '#000', 
                            padding: '2px 6px', 
                            borderRadius: '50%', 
                            fontSize: '0.75rem',
                            marginLeft: '4px' 
                        }}>{cartCount}</span>
                    )}
                </Link>

                {user ? (
                    <>
                        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
                        
                        {/* Admin Button - Only shows if user role is admin */}
                        {user.role === 'admin' && (
                            <Link to="/admin" style={adminLinkStyle}>
                                Admin Panel
                            </Link>
                        )}
                    </>
                ) : (
                    <>
                        <Link to="/login" style={linkStyle}>Login</Link>
                        <Link to="/signup" style={{ 
                            ...linkStyle, 
                            background: '#007bff', 
                            padding: '8px 16px', 
                            borderRadius: '6px' 
                        }}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;