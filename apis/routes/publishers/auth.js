const express = require('express');
const router = express.Router();
const authController = require('../../controllers/publishers/authController');
const { authenticatePublisher } = require('../../middleware/auth');

// Public routes (no authentication required)
router.post('/auth/signup', authController.signup);

router.post('/auth/verify-email', authController.verifyEmail);

router.post('/auth/resend-verification-code', authController.resendVerificationCode);

router.post('/auth/login', authController.login);

router.post('/auth/request-password-reset', authController.requestPasswordReset);

router.post('/auth/reset-password', authController.resetPassword);

// Protected routes (authentication required)
router.post('/auth/complete-profile-setup', authenticatePublisher, authController.completeProfileSetup);

router.get('/auth/profile', authenticatePublisher, authController.getProfile);

module.exports = router;
