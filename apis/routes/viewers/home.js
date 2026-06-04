const express = require('express');
const router = express.Router();
const {
    getHomeCarousels,
    getHomePublishers,
    getRecentlyWatchedCarousels,
    saveWatchingCarousel,
} = require('../../controllers/viewers/homeController');
const { verifyViewerToken } = require('../../middleware/auth');

// Get featured carousel and trending carousels
router.get('/carousels', getHomeCarousels);

// Save/update the carousel the viewer is currently watching
router.post('/carousels/watching', verifyViewerToken, saveWatchingCarousel);

// Get top 5 previously watched carousels for the viewer
router.get('/carousels/watching', verifyViewerToken, getRecentlyWatchedCarousels);

// Get publishers with their top carousel
router.get('/publishers', getHomePublishers);

module.exports = router;
