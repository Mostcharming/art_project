const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const settingsRoutes = require('./settings');
const carouselRoutes = require('./carousel');

router.use('/', authRoutes);
router.use('/settings', settingsRoutes);
router.use('/carousels', carouselRoutes);

module.exports = router;
