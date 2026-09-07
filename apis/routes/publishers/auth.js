const express = require('express');
const router = express.Router();
const authController = require('../../controllers/publishers/authController');
const { authenticatePublisher } = require('../../middleware/auth');
const { TERMS_VERSION, termsAccepted } = require('../../utils/legal');

router.post('/auth/accept-terms', authenticatePublisher, async (req, res, next) => {
    try {
        if (!termsAccepted(req.body)) return res.status(400).json({ error: 'Please accept the current Terms of Use.' });
        await req.account.update({ termsVersion: TERMS_VERSION, termsAcceptedAt: new Date() });
        res.json({ success: true, termsVersion: TERMS_VERSION });
    } catch (error) { next(error); }
});

router.post('/auth/signup', authController.signup);

router.post('/auth/verify-email', authController.verifyEmail);

router.post('/auth/resend-verification-code', authController.resendVerificationCode);

router.post('/auth/login', authController.login);

router.post('/auth/request-password-reset', authController.requestPasswordReset);

router.post('/auth/verify-reset-token', authController.verifyResetToken);

router.post('/auth/reset-password', authController.resetPassword);

router.post('/auth/complete-profile-setup', authenticatePublisher, authController.completeProfileSetup);

router.get('/auth/profile', authenticatePublisher, authController.getProfile);

router.patch('/update-profile', authenticatePublisher, authController.updateProfile);

module.exports = router;
