const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Generate a random token for email verification and password reset
 * @returns {string} Random token
 */
const generateToken = (data) => {
    // If data is provided, generate JWT token
    if (data) {
        return jwt.sign(data, process.env.JWT_SECRET || 'your-secret-key', {
            expiresIn: process.env.JWT_EXPIRATION || '7d'
        });
    }
    // Otherwise, generate random token for verification/reset
    return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate expiration time (24 hours from now)
 * @returns {Date} Expiration date
 */
const generateTokenExpiration = (hoursFromNow = 24) => {
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + hoursFromNow);
    return expirationTime;
};

module.exports = {
    generateToken,
    generateTokenExpiration,
};
