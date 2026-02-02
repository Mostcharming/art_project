/**
 * Generate a random 4-digit verification code
 * @returns {string} 4-digit code
 */
const generateVerificationCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

module.exports = {
    generateVerificationCode,
};
