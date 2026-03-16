const express = require('express');
const router = express.Router();
const carouselController = require('../../controllers/publishers/carouselController');
const { authenticatePublisher } = require('../../middleware/auth');
const upload = require('../../middleware/uploadMiddleware');

// Save carousel as draft with optional image uploads
router.post('/draft', authenticatePublisher, upload.array('artworkImages'), carouselController.createCarouselDraft);

// Get all carousel drafts for a publisher
router.get('/drafts', authenticatePublisher, carouselController.getAllCarouselDrafts);

// Get a specific carousel draft
router.get('/draft/:carouselId', authenticatePublisher, carouselController.getCarouselDraft);

// Update carousel draft with optional image uploads
router.patch('/draft/:carouselId', authenticatePublisher, upload.array('artworkImages'), carouselController.updateCarouselDraft);

// Delete carousel draft
router.delete('/draft/:carouselId', authenticatePublisher, carouselController.deleteCarouselDraft);

module.exports = router;
