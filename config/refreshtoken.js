// config/refreshtoken.js

const jwt = require('jsonwebtoken');

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '3d', // Example expiration time
    });
};

module.exports = {generateRefreshToken};
