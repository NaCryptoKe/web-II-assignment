const { verifyToken } = require('../utils/tokenUtils');

const auth = (req, res, next) => {
    let token;

    // Check if token exists in cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // If not in cookies, check Authorization header (for non-browser clients or alternatives)
    else if (req.header('Authorization')) {
        const authHeader = req.header('Authorization');
        const tokenParts = authHeader.split(' ');
        if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
            token = tokenParts[1];
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token, authorization denied'
        });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }

    req.user = decoded;
    next();
};

module.exports = auth;
