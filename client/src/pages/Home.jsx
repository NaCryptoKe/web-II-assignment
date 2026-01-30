// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useGame } from '../hooks/useGame'; // Ensure this matches the expanded hook
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    // FIX: Destructure 'fetchHomeData' instead of 'getDashboardData'
    const { fetchHomeData, getLibrary, loading } = useGame();
    const [data, setData] = useState({ newest: [], popular: [], rated: [], library: [] });
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                // fetchHomeData returns the { newest, popular, rated } object
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

    if (loading && data.newest.length === 0) return <p>Loading games...</p>;

    return (
        <div className="home-page" style={{ padding: '20px' }}>
            {featured && (
                <section 
                    className="featured" 
                    onClick={() => navigate(`/game/${featured.id}`)}
                    style={{ cursor: 'pointer', marginBottom: '30px' }}
                >
                    <img src={featured.image_path} alt={featured.title} style={{width: '100%', height: '350px', objectFit: 'cover', borderRadius: '12px'}} />
                    <h1 style={{ marginTop: '10px' }}>Featured: {featured.title}</h1>
                </section>
            )}

            {data.library.length > 0 && (
                <>
                    <h2>My Library</h2>
                    {console.log(data.library)}
                    <GameRow games={data.library} />
                </>
            )}

            <h2>Top Downloaded</h2>
            <GameRow games={data.popular} />

            <h2>Top Rated</h2>
            <GameRow games={data.rated} />

            <h2>Newest Games</h2>
            <GameRow games={data.newest} />
        </div>
    );
};

const GameRow = ({ games }) => {
    const navigate = useNavigate();
    
    if (!games || games.length === 0) return <p>No games found.</p>;

    return (
        <div style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            gap: '15px', 
            marginBottom: '30px',
            paddingBottom: '10px' 
        }}>
            {games.map(g => (
                <div 
                    key={g.id} 
                    onClick={() => navigate(`/game/${g.id}`)} 
                    style={{ cursor: 'pointer', minWidth: '180px', textAlign: 'center' }}
                >
                    <img 
                        src={g.image_path || 'https://via.placeholder.com/150x200'} 
                        alt={g.title} 
                        style={{ width: '150px', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <p style={{ fontWeight: 'bold', margin: '5px 0' }}>{g.title}</p>
                    <small>★ {g.rating || '0'}</small>
                </div>
            ))}
        </div>
    );
}

export default HomePage;