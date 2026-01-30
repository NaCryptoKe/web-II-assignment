import { useEffect } from 'react';
import { useAdmin } from '../hooks/useAdmin';

const AdminPanel = () => {
    const { games, users, tags, revenue, adminLoading, refreshDashboard } = useAdmin();

    useEffect(() => {
        refreshDashboard();
    }, []);

    if (adminLoading) return <p>Loading Admin Data...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Dashboard</h1>
            
            <section>
                <h2>Pending Games ({games.pending?.length || 0})</h2>
                <pre>{JSON.stringify(games.pending, null, 2)}</pre>
            </section>

            <section>
                <h2>Registered Users</h2>
                <ul>
                    {users.map(u => <li key={u.id}>{u.username} ({u.email})</li>)}
                </ul>
            </section>

            <section>
                <h2>Revenue Overview</h2>
                <pre>{JSON.stringify(revenue, null, 2)}</pre>
            </section>

            <section>
                <h2>Current Tags</h2>
                <pre>{JSON.stringify(tags, null, 2)}</pre>
            </section>
        </div>
    );
};

export default AdminPanel;