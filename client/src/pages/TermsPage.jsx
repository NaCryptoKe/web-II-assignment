import React from 'react';
import '../css/terms-page.css';

const TermsPage = () => {
    return (
        <div className="terms-container">
            <h1 className="terms-title">Terms of Service</h1>
            <p className="terms-date">Last Updated: January 2026</p>

            <section className="terms-section">
                <h2 className="terms-heading">1. Acceptance of Terms</h2>
                <p className="terms-text">By accessing GameVault, you agree to be bound by these terms. If you do not agree, please do not use our services.</p>
            </section>

            <section className="terms-section">
                <h2 className="terms-heading">2. User Accounts</h2>
                <p className="terms-text">You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.</p>
            </section>

            <section className="terms-section">
                <h2 className="terms-heading">3. Intellectual Property</h2>
                <p className="terms-text">Developers retain all rights to their uploaded content. GameVault claims no ownership over the games published on our platform.</p>
            </section>

            <section className="terms-section">
                <h2 className="terms-heading">4. Prohibited Conduct</h2>
                <p className="terms-text">Users may not upload malware, pirated content, or engage in any behavior that disrupts the platform experience for others.</p>
            </section>
        </div>
    );
};

export default TermsPage;