import React from 'react';

const ContactPage = () => {
    return (
        <div style={{ padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center' }}>Contact Us</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
                Have a question or need technical support? Send us a message.
            </p>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name</label>
                    <input type="text" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} placeholder="Your Name" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                    <input type="email" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} placeholder="you@example.com" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Message</label>
                    <textarea style={{ width: '100%', height: '150px', padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} placeholder="How can we help?"></textarea>
                </div>
                <button type="submit" style={{ padding: '15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Send Message
                </button>
            </form>

            <div style={{ marginTop: '50px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '30px' }}>
                <p><strong>Email:</strong> support@gamevault.com</p>
                <p><strong>Address:</strong> 123 Game Dev Way, Pixel City, PC 54321</p>
            </div>
        </div>
    );
};

export default ContactPage;