import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

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

            // Based on your authController.js, success returns a message 
            // asking to check email for OTP
            if (response.success || response.status === 'success') {
                navigate('/verify-otp', { state: { email: email } });
            }
        } catch (err) {
            // Error is handled by the useAuth hook state
            console.error("Registration attempt failed:", err);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
                
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Username"
                    required 
                />
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email"
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
                    {isSubmitting ? "Creating Account..." : "Register"}
                </button>
            </form>
            
            <p>Already have an account? <Link to="/login">Click Here</Link></p>
        </div>
    );
};

export default RegisterPage;