const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');

// Mount auth routes
router.use('/', authRoutes);

module.exports = router;
