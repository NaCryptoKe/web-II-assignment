const express = require('express');
const router = express.Router();
const { register, login, otpGenerator, verifyOtp, authenticate, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/generate-otp', otpGenerator);
router.post('/verify-otp', verifyOtp);
router.get('/authenticate', auth, authenticate);
router.post('/logout', logout);

module.exports = router;
