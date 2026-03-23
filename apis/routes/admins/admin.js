const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const profilePictureUpload = require('../../middleware/profilePictureUpload');

// Import controllers
const adminController = require('../../controllers/admins/adminController');
const roleController = require('../../controllers/admins/roleController');
const privilegeController = require('../../controllers/admins/privilegeController');
const activityLogController = require('../../controllers/admins/activityLogController');

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
 * @route   POST /api/admin/auth/resend-forgot-password-code
 * @desc    Resend forgot password code (email only)
 * @access  Public
 */
router.post('/auth/resend-forgot-password-code', adminController.resendForgotPasswordCode);

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
 * @route   PUT /api/admin/profile-picture
 * @desc    Change admin profile picture
 * @access  Private
 */
router.put('/profile-picture', verifyToken, profilePictureUpload.single('profilePicture'), adminController.changeProfilePicture);

/**
 * @route   POST /api/admin/change-password
 * @desc    Change admin password
 * @access  Private
 */
router.post('/change-password', verifyToken, adminController.changePassword);

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

/**
 * ==========================================
 * ROLE ROUTES
 * ==========================================
 */

/**
 * @route   GET /api/admin/roles
 * @desc    Get all roles with privileges
 * @access  Private
 */
router.get('/roles', verifyToken, roleController.getAllRoles);

/**
 * @route   GET /api/admin/roles/:id
 * @desc    Get single role with privileges
 * @access  Private
 */
router.get('/roles/:id', verifyToken, roleController.getRole);

/**
 * @route   POST /api/admin/roles
 * @desc    Create a new custom role
 * @access  Private (superadmin only)
 */
router.post('/roles', verifyToken, roleController.createRole);

/**
 * @route   PUT /api/admin/roles/:id
 * @desc    Update a custom role
 * @access  Private (superadmin only)
 */
router.put('/roles/:id', verifyToken, roleController.updateRole);

/**
 * @route   DELETE /api/admin/roles/:id
 * @desc    Delete a custom role
 * @access  Private (superadmin only)
 */
router.delete('/roles/:id', verifyToken, roleController.deleteRole);

/**
 * ==========================================
 * PRIVILEGE ROUTES
 * ==========================================
 */

/**
 * @route   GET /api/admin/privileges
 * @desc    Get all privileges grouped by category
 * @access  Private
 */
router.get('/privileges', verifyToken, privilegeController.getAllPrivileges);

/**
 * @route   GET /api/admin/privileges/:id
 * @desc    Get single privilege
 * @access  Private
 */
router.get('/privileges/:id', verifyToken, privilegeController.getPrivilege);

/**
 * @route   POST /api/admin/privileges
 * @desc    Create a new privilege
 * @access  Private (superadmin only)
 */
router.post('/privileges', verifyToken, privilegeController.createPrivilege);

/**
 * @route   PUT /api/admin/privileges/:id
 * @desc    Update a privilege
 * @access  Private (superadmin only)
 */
router.put('/privileges/:id', verifyToken, privilegeController.updatePrivilege);

/**
 * @route   DELETE /api/admin/privileges/:id
 * @desc    Delete a privilege
 * @access  Private (superadmin only)
 */
router.delete('/privileges/:id', verifyToken, privilegeController.deletePrivilege);

/**
 * ==========================================
 * ACTIVITY LOG ROUTES
 * ==========================================
 */

/**
 * @route   GET /api/admin/activity-logs/me
 * @desc    Get current admin's activity logs
 * @access  Private
 */
router.get('/activity-logs/me', verifyToken, activityLogController.getMyActivityLogs);

/**
 * @route   GET /api/admin/activity-logs/stats/me
 * @desc    Get current admin's activity statistics
 * @access  Private
 */
router.get('/activity-logs/stats/me', verifyToken, activityLogController.getMyActivityStats);

/**
 * @route   GET /api/admin/activity-logs
 * @desc    Get all admins' activity logs (admin only)
 * @access  Private (admin only)
 */
router.get('/activity-logs', verifyToken, activityLogController.getAllActivityLogs);

/**
 * @route   GET /api/admin/activity-logs/stats
 * @desc    Get activity statistics (admin only)
 * @access  Private (admin only)
 */
router.get('/activity-logs/stats', verifyToken, activityLogController.getAllActivityStats);

/**
 * @route   GET /api/admin/activity-logs/:id
 * @desc    Get activity log detail
 * @access  Private
 */
router.get('/activity-logs/:id', verifyToken, activityLogController.getActivityLogDetail);

module.exports = router;
