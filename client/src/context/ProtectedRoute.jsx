import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from './AuthContext';

// 1. wrapper for routes that require ANY logged-in user
export const ProtectedRoute = () => {
    const { user } = useAuthContext();
    const location = useLocation();

    // Note: We don't need to check 'loading' here because your 
    // App.jsx blocks the entire UI until loading is finished.
    console.log(user)
    if (!user) {
        // Redirect to login, remembering where they tried to go
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

// 2. wrapper for routes that require an ADMIN specifically
export const AdminRoute = () => {
    const { user } = useAuthContext();
    const location = useLocation();

    // Check if user exists AND if they are an admin
    // Verify that 'user.role' matches your actual database field name
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />; // Send unauthorized users home
    }

    return <Outlet />;
};