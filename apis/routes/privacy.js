const express = require('express');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const db = require('../models');
const { sendPlainEmail } = require('../utils/emailService');
const { hashCode, eraseAccounts, processDeletionFiles } = require('../utils/accountDeletion');
const { TERMS_VERSION } = require('../utils/legal');
const { Op } = db.Sequelize;
const router = express.Router();
router.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
router.use(rateLimit({ windowMs: 15 * 60000, limit: 30, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many privacy requests. Please try again later.' } }));
router.get('/terms-version', (req, res) => res.json({ termsVersion: TERMS_VERSION }));

router.post('/deletion/request', async (req, res, next) => {
    try {
        const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
        const accountType = req.body.accountType;
        if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['publisher', 'viewer', 'both'].includes(accountType)) {
            return res.status(400).json({ error: 'Enter a valid email and select publisher, TV viewer, or both.' });
        }
        const recent = await db.AccountDeletionRequest.count({ where: { email, createdAt: { [Op.gt]: new Date(Date.now() - 15 * 60000) } } });
        if (recent >= 3) return res.status(429).json({ error: 'Please wait 15 minutes before requesting another code.' });
        const targets = [];
        for (const [type, model] of [['publisher', db.Publisher], ['viewer', db.Viewer]]) {
            if (accountType !== 'both' && type !== accountType) continue;
            const account = await model.findOne({ where: db.Sequelize.where(db.Sequelize.fn('lower', db.Sequelize.col('email')), email), attributes: ['id'] });
            if (account) targets.push({ type, id: account.id });
        }
        const id = crypto.randomUUID();
        const code = crypto.randomInt(10000000, 100000000).toString();
        await db.AccountDeletionRequest.create({ id, email, accountType, targets, codeHash: hashCode(id, code), expiresAt: new Date(Date.now() + 15 * 60000) });
        if (targets.length) {
            try {
                await sendPlainEmail(email, 'Confirm your Carsl account deletion request', `Your Carsl account deletion code is ${code}. It expires in 15 minutes.\n\nRequested account type: ${accountType}. Enter this code only in the Carsl deletion form you opened. Confirming permanently deletes the selected accounts and associated data.\n\nIf you did not request this, ignore this email. No account is deleted without confirmation. Never share this code.\n\nSupport: carsl.ssfo@gmail.com`);
            } catch {
                await db.AccountDeletionRequest.destroy({ where: { id } });
                return res.status(503).json({ error: 'Email delivery is unavailable. Please try again later or contact carsl.ssfo@gmail.com.' });
            }
        }
        res.status(202).json({ requestId: id, message: 'If a matching account exists, an 8-digit deletion code has been emailed. The code expires in 15 minutes.' });
    } catch (error) { next(error); }
});

router.post('/deletion/confirm', async (req, res, next) => {
    try {
        const { requestId, code, confirm } = req.body;
        if (typeof requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId) || typeof code !== 'string' || !/^\d{8}$/.test(code) || confirm !== true) {
            return res.status(400).json({ error: 'Enter the 8-digit code and confirm permanent deletion.' });
        }
        const accepted = await db.sequelize.transaction(async transaction => {
            const request = await db.AccountDeletionRequest.findByPk(requestId, { transaction, lock: transaction.LOCK.UPDATE });
            if (!request || request.status !== 'pending' || request.expiresAt <= new Date() || request.attempts >= 5) return false;
            const expected = Buffer.from(request.codeHash, 'hex');
            const actual = Buffer.from(hashCode(requestId, code), 'hex');
            if (!crypto.timingSafeEqual(expected, actual) || !request.targets.length) {
                await request.increment('attempts', { transaction });
                return false;
            }
            await eraseAccounts(request, transaction);
            return true;
        });
        if (!accepted) return res.status(400).json({ error: 'Invalid, expired, or already used code. Request a new code if needed.' });
        let status = 'files_pending';
        try { status = await processDeletionFiles(requestId); } catch { /* Durable worker retries file removal. */ }
        res.json({ success: true, status, reference: requestId, message: status === 'complete'
            ? 'Your selected accounts and their data have been removed from the active Carsl service.'
            : 'Your selected accounts have been removed. Uploaded-file cleanup is pending; Carsl will retry it automatically. Keep this reference if you contact support.' });
    } catch (error) { next(error); }
});
module.exports = router;
