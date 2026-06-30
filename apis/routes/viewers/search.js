const express = require('express');
const router = express.Router();
const searchController = require('../../controllers/viewers/searchController');
const { optionalVerifyViewerToken } = require('../../middleware/auth');

/**
 * GET /api/viewers/search/history
 * Get recent search history for the authenticated viewer when a token is present.
 */
router.get('/history', optionalVerifyViewerToken, searchController.getSearchHistory);

/**
 * POST /api/viewers/search/history
 * Save a search query for the authenticated viewer when a token is present.
 */
router.post('/history', optionalVerifyViewerToken, searchController.saveSearchHistory);

/**
 * GET /api/viewers/search
 * Search active artwork/carousel content.
 * Query: { query, type: 'artworks' | 'artists', limit }
 */
router.get('/', optionalVerifyViewerToken, searchController.search);

module.exports = router;
