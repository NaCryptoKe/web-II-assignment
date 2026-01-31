import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import '../css/login-page.css';

const LoginPage = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const { login, isSubmitting, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ identifier, password });

            if (response.success) {
                navigate(`/`);
            } else {
                if (response?.message === 'Account not verified. A new OTP has been sent to your email.') {
                    navigate('/verify-otp', { state: { email: identifier } });
                }
            }
        } catch (err) {
            console.error("Login attempt failed:", err);
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-card">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2 className="login-title">Login</h2>

                    {error && <div className="login-error-msg">{error}</div>}

                    <div className="login-input-group">
                        <label className="login-label">Username or Email</label>
                        <input
                            type="text"
                            className="login-input"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="Username or Email"
                            required
                        />
                    </div>

                    <div className="login-input-group">
                        <label className="login-label">Password</label>
                        <input
                            type="password"
                            className="login-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-login-submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="login-footer-text">
                    Don't have an account? <Link to="/register" className="login-link">Click Here</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;