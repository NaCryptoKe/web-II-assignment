import React from 'react';
import AppRoutes from './routes';
import { useAuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
    const { isInitialized } = useAuthContext();

    // Prevent rendering anything until we know the user's auth status
    if (!isInitialized) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <p>Loading application...</p>
            </div>
        );
    }

    return (
        <div className="app-main">
            <Navbar />
            <AppRoutes />
            <Footer />
        </div>
    );
}

export default App;