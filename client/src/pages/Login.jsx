import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const { login, isSubmitting, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Identifier can be username or email
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
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                
                <input 
                    type="text" 
                    value={identifier} 
                    onChange={(e) => setIdentifier(e.target.value)} 
                    placeholder="Username or Email"
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password"
                    required 
                />

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
            </form>
            
            <p>Dont have an account? <Link to="/register">Click Here</Link></p>
        </div>
    );
};

export default LoginPage;