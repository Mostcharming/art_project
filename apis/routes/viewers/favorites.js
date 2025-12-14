const express = require('express');
const router = express.Router();
const favoritesController = require('../../controllers/viewers/favoritesController');
const { verifyViewerToken } = require('../../middleware/auth');

/**
 * POST /api/viewers/favorites
 * Add a favorite (secured)
 * Body: { artworkId OR artistId, favoriteType }
 */
router.post('/', verifyViewerToken, favoritesController.addFavorite);

/**
 * GET /api/viewers/favorites
 * Get all favorites for viewer (secured)
 * Query: { favoriteType } (optional: 'artwork' or 'artist')
 */
router.get('/', verifyViewerToken, favoritesController.getFavorites);

/**
 * GET /api/viewers/favorites/check
 * Check if an item is favorited (secured)
 * Query: { artworkId OR artistId, favoriteType }
 */
router.get('/check', verifyViewerToken, favoritesController.isFavorited);

/**
 * DELETE /api/viewers/favorites/:id
 * Remove a favorite (secured)
 */
router.delete('/:id', verifyViewerToken, favoritesController.removeFavorite);

/**
 * GET /api/viewers/favorites/count
 * Get favorite counts (secured)
 */
router.get('/count', verifyViewerToken, favoritesController.getFavoriteCounts);

module.exports = router;
