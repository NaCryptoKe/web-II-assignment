import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const footerStyle = {
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        padding: '40px 50px 20px 50px',
        marginTop: '60px',
        borderTop: '1px solid #333'
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto'
    };

    const sectionStyle = {
        flex: '1',
        minWidth: '200px'
    };

    const linkStyle = {
        display: 'block',
        color: '#bbb',
        textDecoration: 'none',
        marginBottom: '10px',
        fontSize: '0.9rem',
        transition: 'color 0.2s'
    };

    const headingStyle = {
        fontSize: '1.2rem',
        marginBottom: '20px',
        color: '#007bff'
    };

    return (
        <footer style={footerStyle}>
            <div style={containerStyle}>
                {/* Brand Section */}
                <div style={sectionStyle}>
                    <h2 style={headingStyle}>GAMEVAULT</h2>
                    <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        The premier community-driven marketplace for indie developers and gamers alike. Discover, play, and review.
                    </p>
                </div>

                {/* Quick Links */}
                <div style={sectionStyle}>
                    <h3 style={{ ...headingStyle, color: '#fff', fontSize: '1rem' }}>Explore</h3>
                    <Link to="/" style={linkStyle}>Home</Link>
                    <Link to="/browse" style={linkStyle}>Browse Games</Link>
                </div>

                {/* Support Section */}
                <div style={sectionStyle}>
                    <h3 style={{ ...headingStyle, color: '#fff', fontSize: '1rem' }}>Support</h3>
                    <Link to="/faq" style={linkStyle}>FAQ</Link>
                    <Link to="/terms" style={linkStyle}>Terms of Service</Link>
                    <Link to="/contact" style={linkStyle}>Contact Us</Link>
                </div>

                {/* Social Links */}
                <div style={sectionStyle}>
                    <h3 style={{ ...headingStyle, color: '#fff', fontSize: '1rem' }}>Follow Us</h3>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <a href="https://twitter.com" style={linkStyle}>Twitter</a>
                        <a href="https://discord.com" style={linkStyle}>Discord</a>
                        <a href="https://github.com" style={linkStyle}>GitHub</a>
                    </div>
                </div>
            </div>

            <div style={{ 
                textAlign: 'center', 
                marginTop: '40px', 
                paddingTop: '20px', 
                borderTop: '1px solid #333',
                color: '#666',
                fontSize: '0.8rem'
            }}>
                © {new Date().getFullYear()} GameVault Inc. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;