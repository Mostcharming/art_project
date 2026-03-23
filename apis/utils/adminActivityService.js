const db = require('../models');
const AdminActivityLog = db.AdminActivityLog;

/**
 * Log an admin activity
 * @param {number} adminId - ID of the admin
 * @param {string} action - Action performed (e.g., 'LOGIN', 'APPROVE_CONTENT')
 * @param {Object} options - Additional options
 * @param {string} options.entityType - Type of entity affected (e.g., 'Carousel', 'Artwork')
 * @param {number} options.entityId - ID of the affected entity
 * @param {Object} options.details - Additional JSON details
 * @param {string} options.ipAddress - IP address of the request
 * @param {string} options.userAgent - User agent string
 * @param {string} options.status - Status of the action (success, failed, pending)
 * @returns {Promise<AdminActivityLog>}
 */
async function logActivity(adminId, action, options = {}) {
    try {
        const {
            entityType = null,
            entityId = null,
            details = null,
            ipAddress = null,
            userAgent = null,
            status = 'success'
        } = options;

        const log = await AdminActivityLog.create({
            adminId,
            action,
            entityType,
            entityId,
            details,
            ipAddress,
            userAgent,
            status
        });

        return log;
    } catch (error) {
        console.error('Error logging admin activity:', error);
        // Don't throw error to prevent activity logging from breaking main operations
        return null;
    }
}

/**
 * Get activity logs for an admin
 * @param {number} adminId - ID of the admin
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of records to fetch
 * @param {number} options.offset - Offset for pagination
 * @param {string} options.action - Filter by action
 * @returns {Promise<{rows: AdminActivityLog[], count: number}>}
 */
async function getActivityLogs(adminId, options = {}) {
    try {
        const {
            limit = 50,
            offset = 0,
            action = null
        } = options;

        const where = { adminId };
        if (action) {
            where.action = action;
        }

        const result = await AdminActivityLog.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [{
                model: db.Admin,
                as: 'admin',
                attributes: ['id', 'email', 'firstName', 'lastName']
            }]
        });

        return result;
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        throw error;
    }
}

/**
 * Get activity logs for all admins (admin only)
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of records to fetch
 * @param {number} options.offset - Offset for pagination
 * @param {string} options.action - Filter by action
 * @param {number} options.adminId - Filter by admin ID
 * @returns {Promise<{rows: AdminActivityLog[], count: number}>}
 */
async function getAllActivityLogs(options = {}) {
    try {
        const {
            limit = 50,
            offset = 0,
            action = null,
            adminId = null
        } = options;

        const where = {};
        if (action) {
            where.action = action;
        }
        if (adminId) {
            where.adminId = adminId;
        }

        const result = await AdminActivityLog.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [{
                model: db.Admin,
                as: 'admin',
                attributes: ['id', 'email', 'firstName', 'lastName']
            }]
        });

        return result;
    } catch (error) {
        console.error('Error fetching all activity logs:', error);
        throw error;
    }
}

/**
 * Get admin activity statistics
 * @param {number} adminId - ID of the admin
 * @param {Object} options - Query options
 * @param {Date} options.startDate - Start date for the period
 * @param {Date} options.endDate - End date for the period
 * @returns {Promise<Object>}
 */
async function getActivityStats(adminId, options = {}) {
    try {
        const {
            startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            endDate = new Date()
        } = options;

        const result = await AdminActivityLog.findAll({
            where: {
                adminId,
                createdAt: {
                    [db.Sequelize.Op.between]: [startDate, endDate]
                }
            },
            attributes: [
                'action',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']
            ],
            group: ['action'],
            raw: true
        });

        return result;
    } catch (error) {
        console.error('Error getting activity stats:', error);
        throw error;
    }
}

module.exports = {
    logActivity,
    getActivityLogs,
    getAllActivityLogs,
    getActivityStats
};
