const express = require('express');
const router = express.Router();

// Import sub-routes
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const favoritesRoutes = require('./favorites');
const stylesRoutes = require('./styles');
const homeRoutes = require('./home');

// Register sub-routes
router.use('/', authRoutes);
router.use('/profile', profileRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/styles', stylesRoutes);
router.use('/home', homeRoutes);

module.exports = router;
