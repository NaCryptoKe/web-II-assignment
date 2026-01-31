const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const otpModel = require('../models/otpModel');
const { sendEmail } = require('../utils/emailUtil');
const { generateToken } = require('../utils/tokenUtils');

const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Username, email, and password are required.",
            errors: []
        });
    }

    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = await userModel.register(username, email, passwordHash);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

        await otpModel.createOTP(email, otp, expiresAt);

        await sendEmail({
            to: email,
            subject: 'Verify Your Account',
            text: `Your OTP is: ${otp}`,
            html: `<p>Your OTP is: <strong>${otp}</strong></p>`
        });

        res.status(201).json({
            success: true,
            message: "Registration successful. Please check your email for the OTP to verify your account.",
            data: {
                userId: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                isVerified: newUser.isVerified
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);
        if (error.code === '23505') { // PostgreSQL unique violation error code
            if (error.detail.includes('email')) {
                return res.status(409).json({
                    success: false,
                    message: "Email address already in use.",
                    errors: []
                });
            } else if (error.detail.includes('username')) {
                return res.status(409).json({
                    success: false,
                    message: "Username already taken.",
                    errors: []
                });
            }
        }
        res.status(500).json({
            success: false,
            message: "An error occurred during registration.",
            errors: [error.message]
        });
    }
};

const login = async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({
            success: false,
            message: "Username/email and password are required.",
            errors: []
        });
    }

    try {
        const user = await userModel.login(identifier);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
                errors: []
            });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
                errors: []
            });
        }

        if (!user.isVerified) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

            await otpModel.deleteOTPByEmail(user.email); // Delete any existing OTP
            await otpModel.createOTP(user.email, otp, expiresAt);

            await sendEmail({
                to: user.email,
                subject: 'Verify Your Account',
                text: `Your OTP is: ${otp}`,
                html: `<p>Your OTP is: <strong>${otp}</strong></p>`
            });

            return res.status(401).json({
                success: false,
                message: "Account not verified. A new OTP has been sent to your email.",
                errors: []
            });
        }

        const tokenPayload = {
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified
        };

        const token = generateToken(tokenPayload);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            partitioned: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).status(200).json({
            success: true,
            message: "Logged in successfully.",
            data: {
                user: tokenPayload
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during login.",
            errors: [error.message]
        });
    }
};

const otpGenerator = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required.",
            errors: []
        });
    }

    try {
        const user = await userModel.login(email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
                errors: []
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "This account is already verified.",
                errors: []
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

        await otpModel.deleteOTPByEmail(email);
        await otpModel.createOTP(email, otp, expiresAt);

        await sendEmail({
            to: email,
            subject: 'Your New OTP',
            text: `Your new OTP is: ${otp}`,
            html: `<p>Your new OTP is: <strong>${otp}</strong></p>`
        });

        res.status(200).json({
            success: true,
            message: "A new OTP has been sent to your email address."
        });

    } catch (error) {
        console.error("Resend OTP Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while resending the OTP.",
            errors: [error.message]
        });
    }
}

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: "Email and OTP are required.",
            errors: []
        });
    }

    try {
        const storedOtp = await otpModel.getOTPByEmail(email);

        if (!storedOtp) {
            return res.status(400).json({
                success: false,
                message: "No OTP found for this email. Please request a new one.",
                errors: []
            });
        }

        if (storedOtp.code !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
                errors: []
            });
        }

        if (new Date() > new Date(storedOtp.expiresAt)) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one.",
                errors: []
            });
        }

        const user = await userModel.verifyUser(email);

        await otpModel.deleteOTPByEmail(email);

        const tokenPayload = {
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified
        };

        const token = generateToken(tokenPayload);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            partitioned: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).status(200).json({
            success: true,
            message: "Account verified successfully.",
            data: {
                user: tokenPayload
            }
        });

    } catch (error) {
        console.error("OTP Verification Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during OTP verification.",
            errors: [error.message]
        });
    }
};

const authenticate = async (req, res) => {
    try {
        const user = req.user;

        res.status(200).json({
            success: true,
            message: "Authenticated user retrieved successfully.",
            data: user
        });
    } catch (error) {
        console.error("Get Authenticated User Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving user data.",
            errors: [error.message]
        });
    }
};

const logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        partitioned: true,
        // path: '/' // Ensure this matches too if you set it manually during login
    }).status(200).json({
        success: true,
        message: "Logged out successfully."
    });
};

module.exports = {
    register,
    login,
    otpGenerator,
    verifyOtp,
    authenticate,
    logout
};