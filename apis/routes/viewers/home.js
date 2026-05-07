const express = require('express');
const router = express.Router();
const { getHomeCarousels, getHomePublishers } = require('../../controllers/viewers/homeController');

// Get featured carousel and trending carousels
router.get('/carousels', getHomeCarousels);

// Get publishers with their top carousel
router.get('/publishers', getHomePublishers);

module.exports = router;
