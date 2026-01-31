import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import '../css/game-pages.css';

const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
};

const UploadGamePage = () => {
    const navigate = useNavigate();
    const { uploadGame, loading } = useGame();
    const [form, setForm] = useState({ title: '', description: '', price: 0 });
    const [gameFile, setGameFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');

    const MAX_SIZE = 100 * 1024 * 1024; // 100MB

    const handleFile = (e, setFile) => {
        const file = e.target.files[0];
        if (file && file.size > MAX_SIZE) {
            setError(`File too large (${formatBytes(file.size)}). Max 100MB.`);
            e.target.value = null;
            return;
        }
        setError('');
        setFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('hello')
        if (!gameFile || !imageFile) return setError("Files missing");

        const data = new FormData();
        data.append('title', form.title);
        data.append('description', form.description);
        data.append('price', form.price);
        data.append('game', gameFile);
        data.append('image', imageFile);

        const res = await uploadGame(data);
        if (res.success) {
            alert("Uploaded successfully!");
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="game-form-container">
            <h2 className="game-form-title">Upload New Game</h2>
            <div className="game-form-divider"></div>

            {error && <div className="game-error-banner">{error}</div>}

            <form className="vault-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="game-label">Game Title</label>
                    <input
                        type="text"
                        className="game-input"
                        placeholder="Enter title..."
                        onChange={e => setForm({...form, title: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="game-label">Description</label>
                    <textarea
                        className="game-textarea"
                        placeholder="Tell players about your game..."
                        onChange={e => setForm({...form, description: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="game-label">Price ($)</label>
                    <input
                        type="number"
                        className="game-input"
                        placeholder="0 for Free"
                        step={'0.01'}
                        onChange={e => setForm({...form, price: e.target.value})}
                        required
                    />
                </div>

                <div className="file-upload-section">
                    <div className="file-box">
                        <label className="game-label">Game Archive (.zip)</label>
                        <input type="file" className="file-input" onChange={e => handleFile(e, setGameFile)} required />
                        {gameFile && <span className="file-size-tag">{formatBytes(gameFile.size)}</span>}
                    </div>

                    <div className="file-box">
                        <label className="game-label">Cover Image</label>
                        <input type="file" className="file-input" accept="image/*" onChange={e => handleFile(e, setImageFile)} required />
                        {imageFile && <span className="file-size-tag">{formatBytes(imageFile.size)}</span>}
                    </div>
                </div>

                <button type="submit" className="btn-vault-primary" disabled={loading}>
                    {loading ? "Uploading to Vault..." : "Publish Game"}
                </button>
            </form>
        </div>
    );
};

export default UploadGamePage;