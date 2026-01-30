import React from 'react';

const FAQPage = () => {
    const faqData = [
        { q: "How do I download my games?", a: "Once purchased, games appear in your Library. Go to the game's detail page to find the 'Download Now' button." },
        { q: "Can I get a refund?", a: "Refunds are handled on a case-by-case basis. Please contact support within 24 hours of purchase." },
        { q: "How do I publish a game?", a: "Registered developers can upload games via the 'Upload' section in their dashboard." },
        { q: "What formats are the games in?", a: "Most games are provided as .zip archives containing the executable files for your platform." }
    ];

    return (
        <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Frequently Asked Questions</h1>
            {faqData.map((item, index) => (
                <div key={index} style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                    <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Q: {item.q}</h3>
                    <p style={{ color: '#555', lineHeight: '1.6' }}>{item.a}</p>
                </div>
            ))}
        </div>
    );
};

export default FAQPage;