import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import { useAuthContext } from '../context/AuthContext';

/**
 * HELPER: Formats bytes into human readable string
 */
const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
};

/**
 * PAGE 1: GAME DETAILS
 */
export const GameDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchGameDetails, downloadGame, loading, error } = useGame();
    const { user } = useAuthContext();
    const [game, setGame] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const load = async () => {
            const res = await fetchGameDetails(id);
            if (res.success) setGame(res.data);
        };
        load();
    }, [id, fetchGameDetails]);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const res = await downloadGame(id);
            if (res.success && res.downloadUrl) {
                // Fetch as blob to force automatic download (avoiding new tab)
                const response = await fetch(res.downloadUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${game.title || 'game'}.zip`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                alert("Download failed: " + (res.message || "Link not found"));
            }
        } catch (err) {
            console.error("Download error:", err);
        } finally {
            setIsDownloading(false);
        }
    };

    if (loading) return <div style={{ padding: '50px' }}>Loading...</div>;
    if (error || !game) return <div style={{ padding: '50px' }}>Game not found.</div>;

    const isOwner = user?.userId === game.ownerId;

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '40px' }}>
                <img 
                    src={game.imagePath || 'https://via.placeholder.com/300x400'} 
                    alt={game.title} 
                    style={{ width: '350px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} 
                />
                <div style={{ flex: 1 }}>
                    <h1>{game.title}</h1>
                    <p style={{ fontSize: '1.2rem', color: '#555', margin: '20px 0' }}>{game.description}</p>
                    <div style={{ marginBottom: '30px' }}>
                        <p><strong>Rating:</strong> ★ {game.rating || 'No ratings'}</p>
                        <p><strong>Downloads:</strong> {game.downloads_count || 0}</p>
                        <p><strong>Price:</strong> {game.price > 0 ? `$${game.price}` : 'Free'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button onClick={handleDownload} disabled={isDownloading} style={{ padding: '12px 25px', backgroundColor: isDownloading ? '#ccc' : '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            {isDownloading ? "Downloading..." : "Download Game"}
                        </button>
                        {isOwner && (
                            <button onClick={() => navigate(`/game/edit/${game.id}`)} style={{ padding: '12px 25px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                Edit Game
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * PAGE 2: EDIT GAME (JSON Based)
 */
export const EditGamePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchGameDetails, updateGame, loading } = useGame();
    const [formData, setFormData] = useState({ title: '', description: '', price: 0 });

    useEffect(() => {
        fetchGameDetails(id).then(res => {
            if (res.success) {
                setFormData({ title: res.data.title || '', description: res.data.description || '', price: res.data.price || 0 });
            }
        });
    }, [id, fetchGameDetails]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await updateGame(id, formData);
        if (res.success) {
            alert("Updated!");
            navigate(`/game/${id}`);
        }
    };

    if (loading) return <div style={{ padding: '50px' }}>Loading...</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Edit Game Info</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Title" style={{ padding: '10px' }} required />
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description" style={{ padding: '10px', height: '150px' }} required />
                <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Price" style={{ padding: '10px' }} />
                <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>Save Changes</button>
            </form>
        </div>
    );
};

/**
 * PAGE 3: UPLOAD GAME (FormData Based)
 */
export const UploadGamePage = () => {
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
        if (!gameFile || !imageFile) return setError("Files missing");

        const data = new FormData();
        data.append('title', form.title);
        data.append('description', form.description);
        data.append('price', form.price);
        data.append('game', gameFile);
        data.append('image', imageFile);

        const res = await uploadGame(data);
        if (res.success) {
            alert("Uploaded!");
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Upload Game</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input type="text" placeholder="Title" onChange={e => setForm({...form, title: e.target.value})} style={{ padding: '10px' }} required />
                <textarea placeholder="Description" onChange={e => setForm({...form, description: e.target.value})} style={{ padding: '10px', height: '100px' }} required />
                <input type="number" placeholder="Price" onChange={e => setForm({...form, price: e.target.value})} style={{ padding: '10px' }} required />
                
                <div>
                    <label>Game File (Max 100MB)</label><br/>
                    <input type="file" onChange={e => handleFile(e, setGameFile)} required />
                    {gameFile && <small>{formatBytes(gameFile.size)}</small>}
                </div>
                
                <div>
                    <label>Cover Image (Max 100MB)</label><br/>
                    <input type="file" accept="image/*" onChange={e => handleFile(e, setImageFile)} required />
                    {imageFile && <small>{formatBytes(imageFile.size)}</small>}
                </div>

                <button type="submit" disabled={loading} style={{ padding: '15px', background: loading ? '#ccc' : '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    {loading ? "Uploading..." : "Upload Game"}
                </button>
            </form>
        </div>
    );
};

export default UploadGamePage;