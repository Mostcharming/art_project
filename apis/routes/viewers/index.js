const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/viewers/profileController');
const { verifyViewerToken } = require('../../middleware/auth');
const profilePictureUpload = require('../../middleware/profilePictureUpload');

// Import sub-routes
const authRoutes = require('./auth');
const profileRoutes = require('./profile');
const favoritesRoutes = require('./favorites');
const stylesRoutes = require('./styles');
const homeRoutes = require('./home');
const setupRoutes = require('./setup');
const searchRoutes = require('./search');
const settingsRoutes = require('./settings');

const uploadViewerProfilePicture = (req, res, next) => {
    profilePictureUpload.single('profilePicture')(req, res, (error) => {
        if (!error) {
            return next();
        }

        const message = error.code === 'LIMIT_FILE_SIZE'
            ? 'File size must be less than 5MB'
            : 'Please select a valid image file';

        return res.status(422).json({
            success: false,
            message,
        });
    });
};

// Register sub-routes
router.use('/', authRoutes);
router.put('/profile-picture', verifyViewerToken, uploadViewerProfilePicture, profileController.uploadProfilePicture);
router.use('/profile', profileRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/styles', stylesRoutes);
router.use('/home', homeRoutes);
router.use('/setup', setupRoutes);
router.use('/search', searchRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;
