// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useGame } from '../hooks/useGame';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuthContext();
    const { getMyUploadedGames, loading: gamesLoading } = useGame();
    const [myGames, setMyGames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadDeveloperData = async () => {
            const res = await getMyUploadedGames();
            console.log(res);
            if (res.success) setMyGames(res.data);
        };
        loadDeveloperData();
    }, [getMyUploadedGames]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>User Dashboard</h1>
                <button onClick={handleLogout} style={{ padding: '10px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Logout
                </button>
            </header>

            {/* Profile Overview Card */}
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
                <h3>Welcome back, {user?.username}</h3>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
                <Link to="/settings">Edit Profile & Password</Link>
            </div>

            {/* Developer Section: Uploaded Games */}
            <section style={{ marginTop: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Your Uploaded Games (Dev View)</h2>
                    <button onClick={() => navigate('/upload')}>+ Upload New Game</button>
                </div>
                
                {gamesLoading ? (
                    <p>Loading your games...</p>
                ) : myGames.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                        {myGames.map(game => (
                            <div key={game.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
                                <img src={game.image_url || 'https://via.placeholder.com/150'} alt={game.title} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                                <h4>{game.title}</h4>
                                <p>Status: <span style={{ color: game.status === 'active' ? 'green' : 'orange' }}>{game.status}</span></p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => navigate(`/game/${game.id}`)}>View</button>
                                    <button onClick={() => navigate(`/game/edit/${game.id}`)}>Edit</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You haven't uploaded any games yet.</p>
                )}
            </section>
        </div>
    );
};

export default Dashboard;