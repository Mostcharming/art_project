const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const settingsRoutes = require('./settings');

router.use('/', authRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;
