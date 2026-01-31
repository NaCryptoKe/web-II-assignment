// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useGame } from '../hooks/useGame';
import { useNavigate } from 'react-router-dom';
import '../css/home-page.css';

const HomePage = () => {
    const { fetchHomeData, getLibrary, loading } = useGame();
    const [data, setData] = useState({ newest: [], popular: [], rated: [], library: [] });
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const lists = await fetchHomeData();
                const lib = await getLibrary();

                setData({
                    newest: lists?.newest || [],
                    popular: lists?.popular || [],
                    rated: lists?.rated || [],
                    library: lib.data || []
                });
            } catch (err) {
                console.error("Error loading home page:", err);
            }
        };
        load();
    }, [fetchHomeData, getLibrary]);

    const featured = data.newest[0];

    if (loading && data.newest.length === 0) {
        return (
            <div className="loading-container">
                <p>Loading games...</p>
            </div>
        );
    }

    return (
        <div className="home-page">
            {featured && (
                <section
                    className="featured-section"
                    onClick={() => navigate(`/game/${featured.id}`)}
                >
                    <div className="featured-image-wrapper">
                        <img src={featured.image_path} alt={featured.title} />
                        <div className="featured-overlay">
                            <h1>Featured: {featured.title}</h1>
                        </div>
                    </div>
                </section>
            )}

            {data.library.length > 0 && (
                <div className="row-container">
                    <h2 className="row-title">My Library</h2>
                    <GameRow games={data.library} />
                </div>
            )}

            <div className="row-container">
                <h2 className="row-title">Top Downloaded</h2>
                <GameRow games={data.popular} />
            </div>

            <div className="row-container">
                <h2 className="row-title">Top Rated</h2>
                <GameRow games={data.rated} />
            </div>

            <div className="row-container">
                <h2 className="row-title">Newest Games</h2>
                <GameRow games={data.newest} />
            </div>
        </div>
    );
};

const GameRow = ({ games }) => {
    const navigate = useNavigate();

    if (!games || games.length === 0) return <p className="no-games">No games found.</p>;

    return (
        <div className="game-row">
            {games.map(g => (
                <div
                    key={g.id}
                    className="game-card"
                    onClick={() => navigate(`/game/${g.id}`)}
                >
                    <div className="card-image-container">
                        <img
                            src={g.image_path || 'https://via.placeholder.com/150x200'}
                            alt={g.title}
                        />
                    </div>
                    <div className="card-info">
                        <p className="game-title">{g.title}</p>
                        <span className="game-rating">★ {g.rating || '0'}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default HomePage;