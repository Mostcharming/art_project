const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/viewers/profileController');
const { verifyViewerToken } = require('../../middleware/auth');

/**
 * GET /api/viewers/profile
 * Get viewer profile (secured)
 */
router.get('/', verifyViewerToken, profileController.getProfile);

/**
 * PUT /api/viewers/profile
 * Update viewer profile (secured)
 * Body: { firstName, lastName, vibePreference, appUsage }
 */
router.put('/', verifyViewerToken, profileController.updateProfile);

/**
 * GET /api/viewers/profile/styles
 * Get viewer's selected styles (secured)
 */
router.get('/styles', verifyViewerToken, profileController.getStyles);

/**
 * PUT /api/viewers/profile/styles
 * Update viewer's selected styles (secured)
 * Body: { styleIds[] } - must have at least 3 styles
 */
router.put('/styles', verifyViewerToken, profileController.updateStyles);

/**
 * POST /api/viewers/profile/change-password
 * Change password (secured)
 * Body: { currentPassword, newPassword }
 */
router.post('/change-password', verifyViewerToken, profileController.changePassword);

module.exports = router;
