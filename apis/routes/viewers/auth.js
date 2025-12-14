const express = require('express');
const router = express.Router();
const authController = require('../../controllers/viewers/authController');

/**
 * POST /api/viewers/auth/register
 * Register a new viewer
 * Body: { email, password, firstName, lastName, vibePreference, appUsage, styles[] }
 */
router.post('/auth/register', authController.register);

/**
 * POST /api/viewers/auth/login
 * Login a viewer
 * Body: { email, password }
 */
router.post('/auth/login', authController.login);

/**
 * POST /api/viewers/auth/verify-email
 * Verify viewer email
 * Body: { token }
 */
router.post('/auth/verify-email', authController.verifyEmail);

/**
 * POST /api/viewers/auth/request-password-reset
 * Request password reset
 * Body: { email }
 */
router.post('/auth/request-password-reset', authController.requestPasswordReset);

/**
 * POST /api/viewers/auth/reset-password
 * Reset password
 * Body: { token, newPassword }
 */
router.post('/auth/reset-password', authController.resetPassword);

module.exports = router;
