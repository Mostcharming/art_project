const express = require('express');
const router = express.Router();
const stylesController = require('../../controllers/viewers/stylesController');

/**
 * GET /api/viewers/styles
 * Get all available styles (public)
 */
router.get('/', stylesController.getAllStyles);

/**
 * GET /api/viewers/styles/:id
 * Get a specific style (public)
 */
router.get('/:id', stylesController.getStyle);

module.exports = router;
