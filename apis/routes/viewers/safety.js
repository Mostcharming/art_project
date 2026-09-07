const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const db = require('../../models');
const { verifyViewerToken } = require('../../middleware/auth');
const { Op } = db.Sequelize;
const REASONS = ['Sexual or explicit content', 'Hate or harassment', 'Violence or dangerous content', 'Child safety', 'Copyright infringement', 'Spam or misleading content', 'Other'];
const idOf = value => Number.isSafeInteger(Number(value)) && Number(value) > 0 ? Number(value) : null;
router.use(verifyViewerToken);
router.use(rateLimit({ windowMs: 15 * 60000, limit: 60, keyGenerator: req => String(req.user.id), standardHeaders: true, legacyHeaders: false, message: { error: 'Too many requests. Please try again later.' } }));
router.get('/report-reasons', (req, res) => res.json({ reasons: REASONS }));

router.post('/reports', async (req, res, next) => {
    try {
        const publisherId = idOf(req.body.publisherId);
        const carouselId = req.body.carouselId == null ? null : idOf(req.body.carouselId);
        const reason = req.body.reason;
        const details = typeof req.body.details === 'string' ? req.body.details.trim() : '';
        if (!publisherId || !REASONS.includes(reason) || details.length > 2000 || (req.body.carouselId != null && !carouselId)) return res.status(400).json({ error: 'Choose a publisher, a valid report reason, and at most 2,000 characters of details.' });
        if (!await db.Publisher.findByPk(publisherId)) return res.status(404).json({ error: 'Publisher not found.' });
        if (carouselId && !await db.Carousel.findOne({ where: { id: carouselId, publisherId, isDeleted: false } })) return res.status(404).json({ error: 'Content not found.' });
        const report = await db.sequelize.transaction(async transaction => {
            await db.Viewer.findByPk(req.user.id, { transaction, lock: transaction.LOCK.UPDATE });
            const where = { viewerId: req.user.id, publisherId, carouselId, status: 'open' };
            const existing = await db.ContentReport.findOne({ where, transaction });
            if (existing) return existing;
            const created = await db.ContentReport.create({ ...where, reason, details }, { transaction });
            if (carouselId) await db.Carousel.increment('flaggedCount', { where: { id: carouselId }, transaction });
            return created;
        });
        res.status(201).json({ success: true, reference: report.id, message: 'Report received. Carsl moderators will review it.' });
    } catch (error) { next(error); }
});

router.get('/blocks', async (req, res, next) => {
    try {
        const blocks = await db.ViewerBlock.findAll({ where: { viewerId: req.user.id }, order: [['createdAt', 'DESC']] });
        const publishers = await db.Publisher.findAll({ where: { id: blocks.map(block => block.publisherId) }, attributes: ['id', 'name'] });
        res.json({ blocks: blocks.map(block => ({ publisherId: block.publisherId, name: publishers.find(item => item.id === block.publisherId)?.name || 'Publisher' })) });
    } catch (error) { next(error); }
});

router.post('/blocks', async (req, res, next) => {
    try {
        const publisherId = idOf(req.body.publisherId);
        if (!publisherId || !await db.Publisher.findByPk(publisherId)) return res.status(404).json({ error: 'Publisher not found.' });
        await db.sequelize.transaction(async transaction => {
            await db.Viewer.findByPk(req.user.id, { transaction, lock: transaction.LOCK.UPDATE });
            await db.ViewerBlock.findOrCreate({ where: { viewerId: req.user.id, publisherId }, transaction });
            const carousels = await db.Carousel.findAll({ where: { publisherId }, attributes: ['id'], transaction });
            const ids = carousels.map(item => item.id);
            const artworks = await db.Artwork.findAll({ where: { carouselId: ids }, attributes: ['id'], transaction });
            await db.Favorite.destroy({ where: { viewerId: req.user.id, [Op.or]: [{ artistId: publisherId }, { artworkId: artworks.map(item => item.id) }] }, transaction });
            await db.Subscriber.destroy({ where: { viewerId: req.user.id, publisherId }, transaction });
            for (const model of [db.ViewerCarouselFavorite, db.ViewerCarouselWatch]) await model.destroy({ where: { viewerId: req.user.id, carouselId: ids }, transaction });
        });
        res.json({ success: true, message: 'Publisher blocked. Their profile and content are hidden while you are signed in.' });
    } catch (error) { next(error); }
});

router.delete('/blocks/:publisherId', async (req, res, next) => {
    try {
        const publisherId = idOf(req.params.publisherId);
        if (!publisherId) return res.status(400).json({ error: 'Invalid publisher.' });
        await db.ViewerBlock.destroy({ where: { viewerId: req.user.id, publisherId } });
        res.json({ success: true, message: 'Publisher unblocked.' });
    } catch (error) { next(error); }
});
module.exports = router;
