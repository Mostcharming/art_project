const router = require('express').Router();
const db = require('../../models');
const { verifyToken } = require('../../middleware/auth');
const { processDeletionFiles } = require('../../utils/accountDeletion');
const { Op } = db.Sequelize;
router.use(verifyToken);
router.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });

router.get('/reports', async (req, res, next) => {
    try {
        const status = req.query.status === 'resolved' ? 'resolved' : 'open';
        const reports = await db.ContentReport.findAll({ where: { status }, order: [[db.Sequelize.literal("CASE WHEN reason = 'Child safety' THEN 0 ELSE 1 END"), 'ASC'], ['createdAt', 'ASC']], limit: 100 });
        const publishers = await db.Publisher.findAll({ where: { id: [...new Set(reports.map(item => item.publisherId))] }, attributes: ['id', 'name'] });
        const carousels = await db.Carousel.findAll({ where: { id: reports.map(item => item.carouselId).filter(Boolean) }, attributes: ['id', 'name'] });
        res.json({ reports: reports.map(report => ({ ...report.toJSON(), publisherName: publishers.find(item => item.id === report.publisherId)?.name, carouselName: carousels.find(item => item.id === report.carouselId)?.name })) });
    } catch (error) { next(error); }
});

router.post('/reports/:id/resolve', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { action } = req.body;
        const resolution = typeof req.body.resolution === 'string' ? req.body.resolution.trim() : '';
        if (!Number.isSafeInteger(id) || id < 1 || !['dismiss', 'remove_content', 'ban_publisher'].includes(action) || resolution.length < 5 || resolution.length > 2000) return res.status(400).json({ error: 'Choose an action and explain the moderation decision (5–2,000 characters).' });
        const result = await db.sequelize.transaction(async transaction => {
            const report = await db.ContentReport.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
            if (!report || report.status !== 'open') return false;
            if (action === 'remove_content') {
                if (!report.carouselId) return false;
                await db.Carousel.update({ status: 'flagged', adminApproved: false, flaggedReason: report.reason, additionalReason: resolution }, { where: { id: report.carouselId }, transaction });
            }
            if (action === 'ban_publisher') await db.Publisher.update({ status: 'banned', reasonForBan: resolution }, { where: { id: report.publisherId }, transaction });
            await report.update({ status: 'resolved', resolution: `${action}: ${resolution}`, reviewedBy: req.user.id, reviewedAt: new Date() }, { transaction });
            await db.AdminActivityLog.create({ adminId: req.user.id, action: 'REVIEW_REPORT', entityType: 'ContentReport', entityId: report.id, details: { action }, status: 'success' }, { transaction });
            return true;
        });
        if (!result) return res.status(409).json({ error: 'The report is no longer open, or the action does not apply.' });
        res.json({ success: true });
    } catch (error) { next(error); }
});

router.get('/deletions', async (req, res, next) => {
    try {
        const requests = await db.AccountDeletionRequest.findAll({ where: { status: { [Op.ne]: 'pending' } }, attributes: ['id', 'accountType', 'status', 'pendingFiles', 'targets', 'createdAt', 'completedAt'], order: [['createdAt', 'DESC']], limit: 100 });
        res.json({ requests });
    } catch (error) { next(error); }
});
router.post('/deletions/:id/retry', async (req, res, next) => {
    try {
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(req.params.id)) return res.status(400).json({ error: 'Invalid reference.' });
        const status = await processDeletionFiles(req.params.id);
        if (!status) return res.status(404).json({ error: 'Request not found.' });
        res.json({ status });
    } catch (error) { next(error); }
});
module.exports = router;
