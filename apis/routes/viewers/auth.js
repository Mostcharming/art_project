const express = require('express');
const router = express.Router();
const authController = require('../../controllers/viewers/authController');
const { verifyViewerToken } = require('../../middleware/auth');

// Step 1: Register with email and password
router.post('/auth/register', authController.register);

// Step 2: Verify email with 4-digit code and receive JWT
router.post('/auth/verify-email', authController.verifyEmailAndIssueToken);

// Step 3: Submit preferred styles (requires JWT)
router.post('/auth/setup/styles', verifyViewerToken, authController.submitStyles);

// Step 4: Submit vibe preference (requires JWT)
router.post('/auth/setup/vibe', verifyViewerToken, authController.submitVibePreference);

// Step 5: Submit app usage and complete setup (requires JWT)
router.post('/auth/setup/complete', verifyViewerToken, authController.submitAppUsageAndCompleteSetup);

// Login (only works after setup is complete)
router.post('/auth/login', authController.login);

// Password reset endpoints (unchanged)
router.post('/auth/request-password-reset', authController.requestPasswordReset);
router.post('/auth/reset-password', authController.resetPassword);

module.exports = router;
