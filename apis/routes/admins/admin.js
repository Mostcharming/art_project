const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');

// Import admin controllers
const adminController = require('../../controllers/admins/adminController');

/**
 * @route   POST /api/admin/auth/register
 * @desc    Register a new admin
 * @access  Private (superadmin only)
 */
router.post('/auth/register',
    verifyToken,
    adminController.registerAdmin);

/**
 * @route   POST /api/admin/auth/request-login-token
 * @desc    Request login token (Step 1: email + password)
 * @access  Public
 */
router.post('/auth/request-login-token', adminController.requestLoginToken);

/**
 * @route   POST /api/admin/auth/resend-login-token
 * @desc    Resend login token (email only)
 * @access  Public
 */
router.post('/auth/resend-login-token', adminController.resendLoginToken);

/**
 * @route   POST /api/admin/auth/verify-login-token
 * @desc    Verify login token and authenticate (Step 2: email + token)
 * @access  Public
 */
router.post('/auth/verify-login-token', adminController.verifyLoginToken);

/**
 * @route   POST /api/admin/auth/login
 * @desc    Login admin (redirects to request-login-token for two-step auth)
 * @access  Public
 */
router.post('/auth/login', adminController.loginAdmin);

/**
 * @route   POST /api/admin/auth/logout
 * @desc    Logout admin
 * @access  Private
 */
router.post('/auth/logout', verifyToken, adminController.logoutAdmin);

/**
 * @route   POST /api/admin/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/auth/forgot-password', adminController.forgotPassword);

/**
 * @route   POST /api/admin/auth/verify-reset-code
 * @desc    Verify reset code
 * @access  Public
 */
router.post('/auth/verify-reset-code', adminController.verifyResetCode);

/**
 * @route   POST /api/admin/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/auth/reset-password', adminController.resetPassword);

/**
 * @route   GET /api/admin/profile
 * @desc    Get admin profile
 * @access  Private
 */
router.get('/profile', verifyToken, adminController.getProfile);

/**
 * @route   PUT /api/admin/profile
 * @desc    Update admin profile
 * @access  Private
 */
router.put('/profile', verifyToken, adminController.updateProfile);

/**
 * @route   GET /api/admin/list
 * @desc    List all admins
 * @access  Private (superadmin only)
 */
router.get('/list', verifyToken, adminController.listAdmins);

/**
 * @route   PUT /api/admin/:id
 * @desc    Update admin by id
 * @access  Private (superadmin only)
 */
router.put('/:id', verifyToken, adminController.updateAdmin);

/**
 * @route   DELETE /api/admin/:id
 * @desc    Delete admin by id
 * @access  Private (superadmin only)
 */
router.delete('/:id', verifyToken, adminController.deleteAdmin);

module.exports = router;
