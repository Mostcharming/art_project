const db = require('../../models');
const { getActivityLogs, getAllActivityLogs, getActivityStats } = require('../../utils/adminActivityService');
const { getCompleteImageUrl } = require('../../utils/imageUrlHelper');

/**
 * Get activity logs for current admin
 */
exports.getMyActivityLogs = async (req, res) => {
    try {
        const { limit = 50, offset = 0, action } = req.query;
        const adminId = req.user.id;

        const result = await getActivityLogs(adminId, {
            limit: parseInt(limit),
            offset: parseInt(offset),
            action
        });

        res.json({
            success: true,
            data: result.rows,
            pagination: {
                total: result.count,
                limit: parseInt(limit),
                offset: parseInt(offset),
                pages: Math.ceil(result.count / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching activity logs',
            error: error.message
        });
    }
};

/**
 * Get activity logs for all admins (admin only)
 */
exports.getAllActivityLogs = async (req, res) => {
    try {
        const { action, adminId } = req.query;

        const where = {};
        if (action) {
            where.action = action;
        }
        if (adminId) {
            where.adminId = parseInt(adminId);
        }

        const logs = await db.AdminActivityLog.findAll({
            where,
            order: [['createdAt', 'DESC']],
            include: [{
                model: db.Admin,
                as: 'admin',
                attributes: ['id', 'email', 'firstName', 'lastName', 'profilePicture']
            }]
        });

        // Process profile pictures to include complete URLs
        const processedLogs = logs.map(log => {
            const logData = log.toJSON ? log.toJSON() : log;
            if (logData.admin && logData.admin.profilePicture) {
                logData.admin.profilePicture = getCompleteImageUrl(logData.admin.profilePicture);
            }
            return logData;
        });

        res.json({
            success: true,
            data: processedLogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching activity logs',
            error: error.message
        });
    }
};

/**
 * Get activity statistics for current admin
 */
exports.getMyActivityStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const adminId = req.user.id;

        const options = {};
        if (startDate) options.startDate = new Date(startDate);
        if (endDate) options.endDate = new Date(endDate);

        const stats = await getActivityStats(adminId, options);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching activity statistics',
            error: error.message
        });
    }
};

/**
 * Get activity statistics for all admins (admin only)
 */
exports.getAllActivityStats = async (req, res) => {
    try {
        const { startDate, endDate, adminId } = req.query;

        // Get stats for specific admin if provided
        if (adminId) {
            const options = {};
            if (startDate) options.startDate = new Date(startDate);
            if (endDate) options.endDate = new Date(endDate);

            const stats = await getActivityStats(parseInt(adminId), options);
            return res.json({
                success: true,
                data: stats
            });
        }

        // Get overall stats for all admins
        const whereClause = {};
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt[db.Sequelize.Op.gte] = new Date(startDate);
            if (endDate) whereClause.createdAt[db.Sequelize.Op.lte] = new Date(endDate);
        }

        const stats = await db.AdminActivityLog.findAll({
            where: whereClause,
            attributes: [
                'action',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']
            ],
            group: ['action'],
            raw: true
        });

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching activity statistics',
            error: error.message
        });
    }
};

/**
 * Get activity logs for a specific admin
 */
exports.getAdminActivityLogs = async (req, res) => {
    try {
        const { adminId } = req.params;
        const { action } = req.query;

        const where = {
            adminId: parseInt(adminId)
        };

        if (action) {
            where.action = action;
        }

        const logs = await db.AdminActivityLog.findAll({
            where,
            order: [['createdAt', 'DESC']],
            include: [{
                model: db.Admin,
                as: 'admin',
                attributes: ['id', 'email', 'firstName', 'lastName', 'profilePicture']
            }]
        });

        // Process profile pictures to include complete URLs
        const processedLogs = logs.map(log => {
            const logData = log.toJSON ? log.toJSON() : log;
            if (logData.admin && logData.admin.profilePicture) {
                logData.admin.profilePicture = getCompleteImageUrl(logData.admin.profilePicture);
            }
            return logData;
        });

        res.json({
            success: true,
            data: processedLogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching activity logs',
            error: error.message
        });
    }
};

/**
 * Get detailed activity log
 */
exports.getActivityLogDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const log = await db.AdminActivityLog.findByPk(id, {
            include: [{
                model: db.Admin,
                as: 'admin',
                attributes: ['id', 'email', 'firstName', 'lastName']
            }]
        });

        if (!log) {
            return res.status(404).json({
                success: false,
                message: 'Activity log not found'
            });
        }

        res.json({
            success: true,
            data: log
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching activity log',
            error: error.message
        });
    }
};

module.exports = exports;
