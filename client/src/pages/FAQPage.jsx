import React from 'react';
import '../css/faq-page.css';

const FAQPage = () => {
    const faqData = [
        { q: "How do I download my games?", a: "Once purchased, games appear in your Library. Go to the game's detail page to find the 'Download Now' button." },
        { q: "Can I get a refund?", a: "Refunds are handled on a case-by-case basis. Please contact support within 24 hours of purchase." },
        { q: "How do I publish a game?", a: "Registered developers can upload games via the 'Upload' section in their dashboard." },
        { q: "What formats are the games in?", a: "Most games are provided as .zip archives containing the executable files for your platform." }
    ];

    return (
        <div className="faq-container">
            <h1 className="faq-main-title">Frequently Asked Questions</h1>
            <div className="faq-list">
                {faqData.map((item, index) => (
                    <div key={index} className="faq-item">
                        <h3 className="faq-question">Q: {item.q}</h3>
                        <p className="faq-answer">{item.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQPage;