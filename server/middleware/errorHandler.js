/**
 * Centralized Error Handling Middleware
 * Ensures consistent API error responses across the platform
 */
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        // Only show stack trace in development mode
        errors: process.env.NODE_ENV === 'development' ? [err.stack] : []
    });
};

module.exports = errorHandler;