const express = require('express');
const router = express.Router();
const {
    getHomeCarouselById,
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

// Get the 3 most recently watched carousels for the viewer
router.get('/carousels/watching', verifyViewerToken, getRecentlyWatchedCarousels);

// Get one active carousel for the viewer home experience
router.get('/carousels/:carouselId', getHomeCarouselById);

// Get publishers with their top carousel
router.get('/publishers', getHomePublishers);

module.exports = router;
