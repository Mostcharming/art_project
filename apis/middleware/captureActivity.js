const { logActivity } = require('../utils/adminActivityService');

/**
 * Middleware to capture admin activities
 * Usage: Call this middleware in the route where you want to log activity
 * Pass options via req.adminActivity
 * 
 * Example:
 * req.adminActivity = {
 *   action: 'APPROVE_CONTENT',
 *   entityType: 'Carousel',
 *   entityId: 123,
 *   details: { reason: 'Good content' }
 * };
 */

const captureActivity = async (req, res, next) => {
    // Store original json method
    const originalJson = res.json;

    // Override json method to capture response
    res.json = function (data) {
        // Only log if activity info is provided and request was successful
        if (req.adminActivity && data.success !== false && res.statusCode < 400) {
            const options = {
                entityType: req.adminActivity.entityType || null,
                entityId: req.adminActivity.entityId || null,
                details: req.adminActivity.details || null,
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.get('user-agent'),
                status: 'success'
            };

            // Log activity asynchronously (don't wait for it)
            if (req.user && req.user.id) {
                logActivity(req.user.id, req.adminActivity.action, options).catch(err => {
                    console.error('Error logging activity:', err);
                });
            }
        }

        // Call original json method
        return originalJson.call(this, data);
    };

    next();
};

module.exports = captureActivity;
