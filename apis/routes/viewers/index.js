const express = require('express');
const router = express.Router();

// Import sub-routes
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const favoritesRoutes = require('./favorites');
const stylesRoutes = require('./styles');

// Register sub-routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/styles', stylesRoutes);

module.exports = router;
