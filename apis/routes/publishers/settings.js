const express = require('express');
const router = express.Router();
const settingsController = require('../../controllers/publishers/settingsController');
const { authenticatePublisher } = require('../../middleware/auth');

router.get('/', authenticatePublisher, settingsController.getSettings);
router.patch('/', authenticatePublisher, settingsController.updateSettings);

module.exports = router;
