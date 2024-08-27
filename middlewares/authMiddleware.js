const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Middleware to protect routes
const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
        
        try {
            if (token) {
                // Verify the token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                // Fetch user based on decoded token
                const user = await User.findById(decoded.id);
                
                if (!user) {
                    return res.status(401).json({
                        message: 'Not authorized, user not found',
                    });
                }
                
                // Attach user to request object
                req.user = user;
                next(); // Move to the next middleware
            }
        } catch (error) {
            res.status(401).json({
                message: 'Not authorized, token failed',
                stack: error.stack,
            });
        }
    } else {
        res.status(401).json({
            message: 'Not authorized, token required',
        });
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    // Check if req.user is set and destructure email from it
    if (!req.user) {
        return res.status(401).json({
            message: 'Not authorized, no user found',
        });
    }

    const { email } = req.user;
    const adminUser = await User.findOne({ email });

    if (!adminUser || adminUser.role !== 'admin') {
        return res.status(403).json({
            message: 'Not authorized as admin',
        });
    } else {
        next();
    }
});

module.exports = { authMiddleware, isAdmin };


