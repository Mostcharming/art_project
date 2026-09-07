const express = require('express');
const router = express.Router();
const adminRoutes = require('./admin');


router.use('/safety', require('./safety'));
router.use('/', adminRoutes);

module.exports = router;
