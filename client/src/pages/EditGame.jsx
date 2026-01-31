
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import '../css/edit-game-page.css';

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
        const res = await updateGame(id, formData);

        if (res.success) {
            alert("Game updated successfully!");
            navigate(`/game/${id}`);
        } else {
            alert("Update failed: " + (res.message || "Error"));
        }
    };

    if (loading) return <div className="edit-loading">Loading editor...</div>;

    return (
        <div className="edit-game-container">
            <h2 className="edit-game-title">Edit Game Info</h2>
            <div className="edit-divider"></div>

            <form onSubmit={handleSubmit} className="edit-game-form">
                <div className="edit-form-group">
                    <label className="edit-label">Title</label>
                    <input
                        type="text"
                        className="edit-input"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                    />
                </div>
                <div className="edit-form-group">
                    <label className="edit-label">Description</label>
                    <textarea
                        className="edit-textarea"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        required
                    />
                </div>
                <div className="edit-form-group">
                    <label className="edit-label">Price ($)</label>
                    <input
                        type="number"
                        className="edit-input"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                </div>

                <div className="edit-action-btns">
                    <button type="submit" className="btn-save">
                        Save Changes
                    </button>
                    <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditGamePage;