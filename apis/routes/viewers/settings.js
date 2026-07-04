const express = require('express');
const router = express.Router();
const settingsController = require('../../controllers/viewers/settingsController');
const { verifyViewerToken } = require('../../middleware/auth');

/**
 * GET /api/viewers/settings/accessibility
 * Get viewer accessibility settings (secured)
 */
router.get('/accessibility', verifyViewerToken, settingsController.getAccessibilitySettings);

/**
 * PUT /api/viewers/settings/accessibility
 * Replace viewer accessibility settings (secured)
 * Body: { preferences: { voiceCommand, highContrast, screenReader, closedCaptions, largeText, audioDescriptions } }
 */
router.put('/accessibility', verifyViewerToken, settingsController.replaceAccessibilitySettings);

/**
 * PATCH /api/viewers/settings/accessibility
 * Update one or more viewer accessibility settings (secured)
 * Body: { preferences: { [preferenceKey]: boolean } }
 */
router.patch('/accessibility', verifyViewerToken, settingsController.updateAccessibilitySettings);

/**
 * GET /api/viewers/settings/content-preferences
 * Get viewer content preferences (secured)
 */
router.get('/content-preferences', verifyViewerToken, settingsController.getContentPreferences);

/**
 * PUT /api/viewers/settings/content-preferences
 * Replace viewer content preferences (secured)
 * Body: { preferences: { language, matureContent, highResolutionImages } }
 */
router.put('/content-preferences', verifyViewerToken, settingsController.replaceContentPreferences);

/**
 * PATCH /api/viewers/settings/content-preferences
 * Update one or more viewer content preferences (secured)
 * Body: { preferences: { [preferenceKey]: string|boolean } }
 */
router.patch('/content-preferences', verifyViewerToken, settingsController.updateContentPreferences);

module.exports = router;
