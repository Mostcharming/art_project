const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/viewers/profileController');
const { verifyViewerToken } = require('../../middleware/auth');

/**
 * POST /api/viewers/setup
 * Complete viewer setup (secured)
 * Body: { styles[], vibe, usage, usageLabel }
 */
router.post('/', verifyViewerToken, profileController.setup);

module.exports = router;
