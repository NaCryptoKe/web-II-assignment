import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import '../css/register-page.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, isSubmitting, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await register({ username, email, password });

            if (response.success || response.status === 'success') {
                navigate('/verify-otp', { state: { email: email } });
            }
        } catch (err) {
            console.error("Registration attempt failed:", err);
        }
    };

    return (
        <div className="register-page-wrapper">
            <div className="register-card">
                <form className="register-form" onSubmit={handleSubmit}>
                    <h2 className="register-title">Create Account</h2>

                    {error && <div className="register-error-msg">{error}</div>}

                    <div className="register-input-group">
                        <label className="register-label">Username</label>
                        <input
                            type="text"
                            className="register-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Pick a username"
                            required
                        />
                    </div>

                    <div className="register-input-group">
                        <label className="register-label">Email</label>
                        <input
                            type="email"
                            className="register-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="register-input-group">
                        <label className="register-label">Password</label>
                        <input
                            type="password"
                            className="register-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Strong password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-register-submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <p className="register-footer-text">
                    Already have an account? <Link to="/login" className="register-link">Log In Here</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;