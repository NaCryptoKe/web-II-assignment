import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyOtpPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { verifyOtp, generateOtp, isSubmitting, error } = useAuth();
    
    // Get the email passed from Register or Login state
    const [email] = useState(location.state?.email || '');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await verifyOtp({ email, otp });

            if (response.success || response.status === 'success') {
                // Backend logs user in automatically on success
                // Redirect to home or dashboard
                navigate('/');
            }
        } catch (err) {
            console.error("Verification failed:", err);
        }
    };

    const handleResendOtp = async () => {
        try {
            const response = await generateOtp({ email });
            if (response.success) {
                setMessage("A new code has been sent to your email.");
            }
        } catch (err) {
            console.error("Resend failed:", err);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Verify Account</h2>
                <p>Enter the code sent to: <strong>{email}</strong></p>
                
                <input 
                    type="text" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    placeholder="6-Digit OTP"
                    maxLength="6"
                    required 
                />

                {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
                {message && <p className="success-message" style={{ color: 'green' }}>{message}</p>}

                <button type="submit" disabled={isSubmitting || !otp}>
                    {isSubmitting ? "Verifying..." : "Verify Code"}
                </button>
            </form>
            
            <p>
                Didn't receive a code? 
                <button 
                    onClick={handleResendOtp} 
                    style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Resend OTP
                </button>
            </p>
        </div>
    );
};

export default VerifyOtpPage;