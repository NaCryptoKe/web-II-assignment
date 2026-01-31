import React from 'react';
import { Link } from 'react-router-dom';
import '../css/footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Brand Section */}
                <div className="footer-section">
                    <h2 className="footer-brand">AXUM<span>ARCADE</span></h2>
                    <p className="footer-description">
                        The premier community-driven marketplace for indie developers and gamers alike. Discover, play, and review.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h3 className="footer-heading">Explore</h3>
                    <Link to="/" className="footer-link">Home</Link>
                    <Link to="/browse" className="footer-link">Browse Games</Link>
                </div>

                {/* Support Section */}
                <div className="footer-section">
                    <h3 className="footer-heading">Support</h3>
                    <Link to="/faq" className="footer-link">FAQ</Link>
                    <Link to="/terms" className="footer-link">Terms of Service</Link>
                    <Link to="/contact" className="footer-link">Contact Us</Link>
                </div>

                {/* Social Links */}
                <div className="footer-section">
                    <h3 className="footer-heading">Follow Us</h3>
                    <div className="footer-socials">
                        <a href="https://twitter.com" className="footer-link">Twitter</a>
                        <a href="https://discord.com" className="footer-link">Discord</a>
                        <a href="https://github.com" className="footer-link">GitHub</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} AxumArcade Inc. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;