const express = require('express');
const router = express.Router();

// Import sub-routes
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const favoritesRoutes = require('./favorites');
const stylesRoutes = require('./styles');
const homeRoutes = require('./home');
const setupRoutes = require('./setup');
const searchRoutes = require('./search');
const settingsRoutes = require('./settings');

// Register sub-routes
router.use('/', authRoutes);
router.use('/profile', profileRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/styles', stylesRoutes);
router.use('/home', homeRoutes);
router.use('/setup', setupRoutes);
router.use('/search', searchRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;
