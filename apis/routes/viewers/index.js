const express = require('express');
const router = express.Router();

// Import sub-routes
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const favoritesRoutes = require('./favorites');
const stylesRoutes = require('./styles');
const homeRoutes = require('./home');
const setupRoutes = require('./setup');

// Register sub-routes
router.use('/', authRoutes);
router.use('/profile', profileRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/styles', stylesRoutes);
router.use('/home', homeRoutes);
router.use('/setup', setupRoutes);

module.exports = router;
