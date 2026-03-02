const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Import admin controllers (we'll create these next)
// const adminController = require('../../controllers/admins/adminController');

/**
 * @route   POST /api/admin/auth/register
 * @desc    Register a new admin
 * @access  Private (superadmin only)
 */
// router.post('/auth/register', auth, adminController.registerAdmin);

/**
 * @route   POST /api/admin/auth/login
 * @desc    Login admin
 * @access  Public
 */
// router.post('/auth/login', adminController.loginAdmin);

/**
 * @route   POST /api/admin/auth/logout
 * @desc    Logout admin
 * @access  Private
 */
// router.post('/auth/logout', auth, adminController.logoutAdmin);

/**
 * @route   POST /api/admin/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
// router.post('/auth/forgot-password', adminController.forgotPassword);

/**
 * @route   POST /api/admin/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
// router.post('/auth/reset-password', adminController.resetPassword);

/**
 * @route   GET /api/admin/profile
 * @desc    Get admin profile
 * @access  Private
 */
// router.get('/profile', auth, adminController.getProfile);

/**
 * @route   PUT /api/admin/profile
 * @desc    Update admin profile
 * @access  Private
 */
// router.put('/profile', auth, adminController.updateProfile);

/**
 * @route   GET /api/admin/list
 * @desc    List all admins
 * @access  Private (superadmin only)
 */
// router.get('/list', auth, adminController.listAdmins);

/**
 * @route   PUT /api/admin/:id
 * @desc    Update admin by id
 * @access  Private (superadmin only)
 */
// router.put('/:id', auth, adminController.updateAdmin);

/**
 * @route   DELETE /api/admin/:id
 * @desc    Delete admin by id
 * @access  Private (superadmin only)
 */
// router.delete('/:id', auth, adminController.deleteAdmin);

module.exports = router;
