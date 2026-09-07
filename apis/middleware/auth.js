const jwt = require('jsonwebtoken');
const db = require('../models');
const { SECRET_FIELDS } = require('../utils/safeAccount');
const { JWT_SECRET } = require('../utils/jwtSecret');

const authenticate = (type, optional = false) => async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token && optional) return next();
    if (!token) return res.status(401).json({ error: 'Please sign in.' });
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'], maxAge: '30d' });
        if (!Number.isSafeInteger(decoded.id) || decoded.id < 1) throw new Error('Invalid account');
        if (type === 'admin' ? (decoded.type !== undefined && decoded.type !== 'admin') : decoded.type !== type) throw new Error('Wrong account type');
    } catch {
        return res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
    }
    try {
        const model = type === 'publisher' ? db.Publisher : type === 'viewer' ? db.Viewer : db.Admin;
        const account = await model.findByPk(decoded.id, { attributes: { exclude: SECRET_FIELDS } });
        if (!account) return res.status(401).json({ error: 'This account no longer exists. Please sign in again.' });
        if (type === 'admin' ? !account.isActive : account.status !== 'active') {
            if (type !== 'admin' && account.status === 'suspended' && account.suspensionEndDate && account.suspensionEndDate <= new Date()) {
                await account.update({ status: 'active', suspensionStartDate: null, suspensionEndDate: null });
            } else return res.status(403).json({ error: 'This account is not active.' });
        }
        req.user = { ...decoded, roleId: type === 'admin' ? account.roleId : decoded.roleId };
        req.account = account;
        next();
    } catch (error) { next(error); }
};

const verifyViewerToken = authenticate('viewer');
const verifyPublisherToken = authenticate('publisher');
module.exports = {
    verifyToken: authenticate('admin'),
    verifyViewerToken,
    optionalVerifyViewerToken: authenticate('viewer', true),
    verifyPublisherToken,
    authenticateViewer: verifyViewerToken,
    authenticatePublisher: verifyPublisherToken,
};
