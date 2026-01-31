import React from 'react';
import '../css/contact-page.css';

const ContactPage = () => {
    return (
        <div className="contact-container">
            <h1 className="contact-title">Contact Us</h1>
            <p className="contact-subtitle">
                Have a question or need technical support? Send us a message.
            </p>

            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-input" placeholder="Your Name" />
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" placeholder="you@example.com" />
                </div>
                <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea className="form-textarea" placeholder="How can we help?"></textarea>
                </div>
                <button type="submit" className="contact-submit-btn">
                    Send Message
                </button>
            </form>

            <div className="contact-info">
                <p><strong>Email:</strong> support@gamevault.com</p>
                <p><strong>Address:</strong> 123 Game Dev Way, Pixel City, PC 54321</p>
            </div>
        </div>
    );
};

export default ContactPage;