// src/routes.jsx
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './context/ProtectedRoute'; // Import the new wrappers

// Pages
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import VerifyOtpPage from './pages/VerifyOtp';
import HomePage from './pages/Home';
import GameDetails from './pages/GameDetails';
import BrowsePage from './pages/Browse';
import FAQPage from './pages/FAQPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';

// Protected Pages
import Dashboard from './pages/Dashboard';
import UserSettings from './pages/UserSettings';
import EditGame from './pages/EditGame';
import UploadGamePage from './pages/UploadGame';
import CartPage from './pages/Cart';
import AdminPanelPage from './pages/AdminPanel';

const AppRoutes = () => {
    return (
        <Routes>
            {/* --- Public Routes (Accessible by anyone) --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Auth Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />


            {/* --- Protected Routes (Requires Login) --- */}
            {/* Dashboard, Settings, Game Details, Edit, Upload, Cart */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<UserSettings />} />
                <Route path="/upload" element={<UploadGamePage />} />
                <Route path="/cart" element={<CartPage />} />
                
                {/* You requested Game Details to be protected */}
                <Route path="/game/:id" element={<GameDetails />} />
                <Route path="/game/edit/:id" element={<EditGame />} />
            </Route>


            {/* --- Admin Routes (Requires Admin Role) --- */}
            <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPanelPage />} />
            </Route>

        </Routes>
    );
};

export default AppRoutes;