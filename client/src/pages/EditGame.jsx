// src/pages/EditGamePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';

const EditGamePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchGameDetails, updateGame, loading } = useGame();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0
    });

    useEffect(() => {
        const getInitialData = async () => {
            const res = await fetchGameDetails(id);
            if (res.success) {
                setFormData({
                    title: res.data.title || '',
                    description: res.data.description || '',
                    price: res.data.price || 0
                });
            }
        };
        getInitialData();
    }, [id, fetchGameDetails]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Passing the clean object to the service
        const res = await updateGame(id, formData);
        
        if (res.success) {
            alert("Game updated successfully!");
            navigate(`/game/${id}`);
        } else {
            alert("Update failed: " + (res.message || "Error"));
        }
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading editor...</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Edit Game Info</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label>Title</label>
                    <input 
                        type="text" 
                        value={formData.title} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})} 
                        style={{ width: '100%', padding: '10px' }}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea 
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                        style={{ width: '100%', height: '150px', padding: '10px' }}
                        required
                    />
                </div>
                <div>
                    <label>Price ($)</label>
                    <input 
                        type="number" 
                        value={formData.price} 
                        onChange={(e) => setFormData({...formData, price: e.target.value})} 
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                        Save Changes
                    </button>
                    <button type="button" onClick={() => navigate(-1)} style={{ padding: '10px 20px' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditGamePage;