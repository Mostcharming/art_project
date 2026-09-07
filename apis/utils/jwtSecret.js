require('dotenv').config();
if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key')) {
    throw new Error('A private JWT_SECRET must be configured in production.');
}
module.exports = { JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key' };
