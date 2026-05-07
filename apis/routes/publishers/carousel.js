const express = require('express');
const router = express.Router();
const carouselController = require('../../controllers/publishers/carouselController');
const { authenticatePublisher } = require('../../middleware/auth');
const upload = require('../../middleware/uploadMiddleware');

router.post('/draft', authenticatePublisher, upload.array('artworkImages'), carouselController.createCarouselDraft);

router.get('/drafts', authenticatePublisher, carouselController.getAllCarouselDrafts);

router.get('/draft/:carouselId', authenticatePublisher, carouselController.getCarouselDraft);

router.patch('/draft/:carouselId', authenticatePublisher, upload.array('artworkImages'), carouselController.updateCarouselDraft);

router.patch('/draft/:carouselId/publish', authenticatePublisher, carouselController.publishCarouselDraft);

router.delete('/draft/:carouselId', authenticatePublisher, carouselController.deleteCarouselDraft);

router.get('/dashboard-data', authenticatePublisher, carouselController.getDashboardData);

router.get('/active', authenticatePublisher, carouselController.getActiveCarousels);

router.get('/scheduled', authenticatePublisher, carouselController.getScheduledCarousels);

router.patch('/:carouselId/move-to-draft', authenticatePublisher, carouselController.moveToDraft);

router.patch('/:carouselId/schedule', authenticatePublisher, carouselController.scheduleCarouselForPublish);

router.get('/:carouselId', authenticatePublisher, carouselController.getOneCarousel);

router.patch('/:carouselId', authenticatePublisher, upload.array('artworkImages'), carouselController.updateCarousel);

router.delete('/:carouselId', authenticatePublisher, carouselController.deleteCarousel);

module.exports = router;
