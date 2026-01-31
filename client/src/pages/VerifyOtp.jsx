import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/verify-otp-page.css';

const VerifyOtpPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { verifyOtp, generateOtp, isSubmitting, error } = useAuth();

    const [email] = useState(location.state?.email || '');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await verifyOtp({ email, otp });
            if (response.success || response.status === 'success') {
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
                setTimeout(() => setMessage(''), 5000); // Clear message after 5s
            }
        } catch (err) {
            console.error("Resend failed:", err);
        }
    };

    return (
        <div className="otp-page-wrapper">
            <div className="otp-card">
                <form className="otp-form" onSubmit={handleSubmit}>
                    <h2 className="otp-title">Verify Account</h2>
                    <p className="otp-instructions">
                        Enter the code sent to: <br/>
                        <span className="otp-email-display">{email}</span>
                    </p>

                    <div className="otp-input-group">
                        <input
                            type="text"
                            className="otp-digit-input"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="000000"
                            maxLength="6"
                            required
                        />
                    </div>

                    {error && <div className="otp-error-banner">{error}</div>}
                    {message && <div className="otp-success-banner">{message}</div>}

                    <button
                        type="submit"
                        className="btn-otp-verify"
                        disabled={isSubmitting || !otp}
                    >
                        {isSubmitting ? "Verifying..." : "Verify Code"}
                    </button>
                </form>

                <div className="otp-footer">
                    <p>Didn't receive a code?</p>
                    <button
                        onClick={handleResendOtp}
                        className="btn-otp-resend"
                    >
                        Resend OTP
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtpPage;