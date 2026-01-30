// src/routes.jsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import HomePage from './pages/Home';
import VerifyOtpPage from './pages/VerifyOtp';
import AdminPanelPage from './pages/AdminPanel';
import Dashboard from './pages/Dashboard';
import UserSettings from './pages/UserSettings';
import GameDetails from './pages/GameDetails';
import UploadGamePage from './pages/UploadGame';
import EditGame from './pages/EditGame';
import BrowsePage from './pages/Browse';
import CartPage from './pages/Cart';
import FAQPage from './pages/FAQPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />

            {/* User & Social */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<UserSettings />} />

            {/* Games */}
            <Route path="/" element={<HomePage />} />
            <Route path="/game/:id" element={<GameDetails />} />
            <Route path="/game/edit/:id" element={<EditGame />} />
            <Route path="/upload" element={<UploadGamePage />} />
            <Route path="/browse" element={<BrowsePage />} />

            <Route path="/cart" element={<CartPage />} />

            <Route path="/faq" element={<FAQPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminPanelPage />} />
        </Routes>
    );
};

export default AppRoutes;