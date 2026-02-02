const express = require('express');
const router = express.Router();
const authController = require('../../controllers/viewers/authController');

router.post('/auth/register', authController.register);

router.post('/auth/login', authController.login);

router.post('/auth/verify-email', authController.verifyEmail);

router.post('/auth/request-password-reset', authController.requestPasswordReset);

router.post('/auth/reset-password', authController.resetPassword);

module.exports = router;
