import { useEffect, useState, useMemo } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Legend
} from 'recharts';
import '../css/AdminPanel.css'; // Importing the separated styles

// Helper to get local date string YYYY-MM-DD
const getLocalDateString = (date = new Date()) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};

const AdminPanel = () => {
    const { 
        games, 
        users, 
        revenue, 
        adminLoading, 
        refreshDashboard, 
        handleAcceptGame, 
        handleRejectGame 
    } = useAdmin();

    // Tabs State
    const [activeTab, setActiveTab] = useState('pending');

    // Date Filter State
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return getLocalDateString(d);
    });
    const [endDate, setEndDate] = useState(() => getLocalDateString(new Date()));

    useEffect(() => {
        refreshDashboard();
    }, []);

    // --- Data Processing ---

    // 1. Games Categorization
    const pendingGames = games?.pending || [];
    const activeGames = games?.active || [];
    const rejectedGames = games?.rejected || [];

    // 2. Revenue (Filter & Format for Chart)
    const chartData = useMemo(() => {
        if (!revenue || !Array.isArray(revenue)) return [];

        const filtered = revenue.filter(item => {
            const itemDate = item.saleDate ? item.saleDate.split('T')[0] : '';
            return itemDate >= startDate && itemDate <= endDate;
        });

        return filtered.map(item => ({
            date: new Date(item.saleDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            fullDate: item.saleDate.split('T')[0],
            Revenue: parseFloat(item.dailyTotal)
        })).sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

    }, [revenue, startDate, endDate]);

    const totalRevenuePeriod = chartData.reduce((acc, curr) => acc + curr.Revenue, 0);

    if (adminLoading) return (
        <div className="admin-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Loading Dashboard...</h2>
        </div>
    );

    // Helper to render a Game Card
    const renderGameCard = (game, showActions = false) => (
        <div key={game.id} className="game-card">
            <img 
                src={game.imagePath || 'https://via.placeholder.com/300x150?text=No+Image'} 
                alt={game.title} 
                className="card-image"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x150?text=Error'; }} 
            />
            
            <div className="card-content">
                <h4 className="card-title">{game.title}</h4>
                <span className="price-tag">${game.price || '0.00'}</span>
                <p className="card-desc">{game.description}</p>
                
                {showActions && (
                    <div className="btn-group">
                        <button 
                            className="btn btn-accept" 
                            onClick={() => handleAcceptGame(game.id)}
                        >
                            Accept
                        </button>
                        <button 
                            className="btn btn-reject"
                            onClick={() => handleRejectGame(game.id)}
                        >
                            Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    // Determine which list to show based on active tab
    const getVisibleGames = () => {
        switch(activeTab) {
            case 'active': return activeGames;
            case 'rejected': return rejectedGames;
            case 'pending': default: return pendingGames;
        }
    };

    const visibleGames = getVisibleGames();

    return (
        <div className="admin-container">
            <h1 className="admin-header">Admin Dashboard</h1>

            {/* --- GAMES SECTION (TABBED) --- */}
            <section className="admin-section">
                <h2 className="section-title">Game Management</h2>
                
                {/* Tab Navigation */}
                <div className="tab-header">
                    <button 
                        className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Reviews
                        <span className="tab-badge">{pendingGames.length}</span>
                    </button>
                    
                    <button 
                        className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                        onClick={() => setActiveTab('active')}
                    >
                        Active Games
                        <span className="tab-badge">{activeGames.length}</span>
                    </button>

                    <button 
                        className={`tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rejected')}
                    >
                        Rejected
                        <span className="tab-badge">{rejectedGames.length}</span>
                    </button>
                </div>

                {/* Game Grid Area */}
                <div className="games-grid">
                    {visibleGames.length > 0 ? (
                        visibleGames.map(game => renderGameCard(game, activeTab === 'pending'))
                    ) : (
                        <div className="empty-state">
                            <p>No games found in this category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* --- USERS SECTION --- */}
            <section className="admin-section">
                <h2 className="section-title">Registered Users ({users.length})</h2>
                <div className="user-scroll-area">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`status-badge ${u.isActive ? 'status-active' : 'status-inactive'}`}>
                                            {u.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* --- REVENUE CHART SECTION --- */}
            <section className="admin-section">
                <h2 className="section-title">Revenue Overview</h2>
                
                <div className="filter-controls">
                    <div className="date-group">
                        <label>Start Date</label>
                        <input 
                            type="date" 
                            className="date-input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    
                    <div className="date-group">
                        <label>End Date</label>
                        <input 
                            type="date" 
                            className="date-input"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <div className="total-revenue">
                        Total in Range: <strong>${totalRevenuePeriod.toFixed(2)}</strong>
                    </div>
                </div>

                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="date" stroke="#413C58" />
                            <YAxis stroke="#413C58" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#413C58', color: '#fff', borderRadius: '5px', border: 'none' }}
                                itemStyle={{ color: '#A3C4BC' }}
                            />
                            <Legend />
                            <Bar 
                                dataKey="Revenue" 
                                fill="#A3C4BC" 
                                radius={[4, 4, 0, 0]} 
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>
        </div>
    );
};

export default AdminPanel;