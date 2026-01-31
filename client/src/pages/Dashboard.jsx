
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useGame } from '../hooks/useGame';
import { useNavigate, Link } from 'react-router-dom';
import '../css/dashboard-page.css';

const Dashboard = () => {
    const { user, logout } = useAuthContext();
    const { getMyUploadedGames, loading: gamesLoading } = useGame();
    const [myGames, setMyGames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadDeveloperData = async () => {
            const res = await getMyUploadedGames();
            if (res.success) setMyGames(res.data);
        };
        loadDeveloperData();
    }, [getMyUploadedGames]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="dash-container">
            <header className="dash-header">
                <h1 className="dash-title">User Dashboard</h1>
                <button onClick={handleLogout} className="btn-logout">
                    Logout
                </button>
            </header>

            
            <div className="profile-card">
                <h3>Welcome back, <span className="text-lime">{user?.username}</span></h3>
                <div className="profile-details">
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> {user?.role}</p>
                </div>
                <Link to="/settings" className="settings-link">Edit Profile & Password</Link>
            </div>

            
            <section className="dev-section">
                <div className="section-header">
                    <h2>Your Uploaded Games (Dev View)</h2>
                    <button onClick={() => navigate('/upload')} className="btn-upload">
                        + Upload New Game
                    </button>
                </div>

                {gamesLoading ? (
                    <p className="loading-text">Loading your games...</p>
                ) : myGames.length > 0 ? (
                    <div className="dash-grid">
                        {myGames.map(game => (
                            <div key={game.id} className="dev-game-card">
                                <div className="card-thumb-container">
                                    <img src={game.imagePath || 'https://via.placeholder.com/150'} alt={game.title} />
                                </div>
                                <div className="dev-card-content">
                                    <h4>{game.title}</h4>
                                    <p>Status: <span className={game.status === 'active' ? 'status-active' : 'status-pending'}>{game.status}</span></p>
                                    <div className="dev-card-actions">
                                        <button className="btn-view" onClick={() => navigate(`/game/${game.id}`)}>View</button>
                                        <button className="btn-edit" onClick={() => navigate(`/game/edit/${game.id}`)}>Edit</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="empty-text">You haven't uploaded any games yet.</p>
                )}
            </section>
        </div>
    );
};

export default Dashboard;