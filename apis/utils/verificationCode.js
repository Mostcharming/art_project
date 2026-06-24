/**
 * Generate a random 4-digit verification code
 * @returns {string} 4-digit code
 */
const generateVerificationCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Verify a code against the expected code or universal code
 * @param {string} providedCode - The code provided by user
 * @param {string} expectedCode - The actual expected code
 * @returns {boolean} true if code matches expected or is universal code
 */
const verifyCode = (providedCode, expectedCode) => {
    const normalizedProvidedCode = providedCode === undefined || providedCode === null
        ? ''
        : String(providedCode).trim();
    const normalizedExpectedCode = expectedCode === undefined || expectedCode === null
        ? ''
        : String(expectedCode).trim();

    return normalizedProvidedCode === normalizedExpectedCode || normalizedProvidedCode === '7777';
};

module.exports = {
    generateVerificationCode,
    verifyCode,
};
