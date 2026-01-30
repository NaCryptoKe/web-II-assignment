import React from 'react';

const TermsPage = () => {
    return (
        <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', color: '#444' }}>
            <h1>Terms of Service</h1>
            <p>Last Updated: January 2026</p>
            
            <section style={{ marginTop: '30px' }}>
                <h2>1. Acceptance of Terms</h2>
                <p>By accessing GameVault, you agree to be bound by these terms. If you do not agree, please do not use our services.</p>
            </section>

            <section style={{ marginTop: '30px' }}>
                <h2>2. User Accounts</h2>
                <p>You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.</p>
            </section>

            <section style={{ marginTop: '30px' }}>
                <h2>3. Intellectual Property</h2>
                <p>Developers retain all rights to their uploaded content. GameVault claims no ownership over the games published on our platform.</p>
            </section>

            <section style={{ marginTop: '30px' }}>
                <h2>4. Prohibited Conduct</h2>
                <p>Users may not upload malware, pirated content, or engage in any behavior that disrupts the platform experience for others.</p>
            </section>
        </div>
    );
};

export default TermsPage;