const db = require('../../models');
const { getCompleteImageUrl } = require('../../utils/imageUrlHelper');

/**
 * Get all users (Publishers and Viewers combined) for the users management page
 */
exports.getAllUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            category = 'all',
            status = 'all',
            sortBy = 'createdAt',
            sortOrder = 'DESC'
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const pageSize = parseInt(limit);

        // Build Sequelize query for Publishers
        const publisherWhere = {};
        const viewerWhere = {};

        // Add search filter
        if (search) {
            const searchCondition = db.Sequelize.where(
                db.Sequelize.fn('CONCAT', db.Sequelize.col('name'), ' ', db.Sequelize.col('email')),
                db.Sequelize.Op.like,
                `%${search}%`
            );
            publisherWhere[db.Sequelize.Op.or] = [
                db.Sequelize.where(db.Sequelize.col('name'), db.Sequelize.Op.like, `%${search}%`),
                db.Sequelize.where(db.Sequelize.col('email'), db.Sequelize.Op.like, `%${search}%`)
            ];

            viewerWhere[db.Sequelize.Op.or] = [
                db.Sequelize.where(
                    db.Sequelize.fn('CONCAT', db.Sequelize.col('firstName'), ' ', db.Sequelize.col('lastName')),
                    db.Sequelize.Op.like,
                    `%${search}%`
                ),
                db.Sequelize.where(db.Sequelize.col('email'), db.Sequelize.Op.like, `%${search}%`)
            ];
        }

        // Add category filter - only applies to publishers
        if (category !== 'all' && category !== 'Viewer') {
            publisherWhere.personaType = category;
        }

        // Add status filter
        if (status !== 'all') {
            publisherWhere.status = status;
            viewerWhere.status = status;
        }

        // Fetch Publishers
        const publishers = await db.Publisher.findAll({
            where: publisherWhere,
            attributes: ['id', 'email', 'name', 'personaType', 'status', 'createdAt'],
            raw: true
        });

        // Fetch Viewers - only if category filter includes viewers
        const viewers = category === 'all' || category === 'Viewer'
            ? await db.Viewer.findAll({
                where: viewerWhere,
                attributes: ['id', 'email', 'firstName', 'lastName', 'status', 'createdAt'],
                raw: true
            })
            : [];

        // Transform and combine data
        const publisherUsers = publishers.map(pub => ({
            id: pub.id,
            userId: `PUB-${pub.id}`,
            name: pub.name || pub.email,
            email: pub.email,
            category: pub.personaType || 'Unknown',
            dateJoined: pub.createdAt ? new Date(pub.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
            }) : 'N/A',
            status: pub.status === 'active' ? 'Active' : pub.status === 'suspended' ? 'Suspended' : 'Banned',
            avatar: getCompleteImageUrl(pub.profilePicture) || null,
            type: 'Publisher'
        }));

        const viewerUsers = viewers.map(viewer => ({
            id: viewer.id,
            userId: `VIE-${viewer.id}`,
            name: `${viewer.firstName || ''} ${viewer.lastName || ''}`.trim() || viewer.email,
            email: viewer.email,
            category: 'Viewer',
            dateJoined: viewer.createdAt ? new Date(viewer.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
            }) : 'N/A',
            status: viewer.status === 'active' ? 'Active' : viewer.status === 'suspended' ? 'Suspended' : 'Banned',
            avatar: getCompleteImageUrl(viewer.profilePicture) || null,
            type: 'Viewer'
        }));

        // Combine all users
        let allUsers = [...publisherUsers, ...viewerUsers];

        // Sort users
        allUsers.sort((a, b) => {
            let aValue, bValue;

            if (sortBy === 'name') {
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
            } else if (sortBy === 'dateJoined') {
                aValue = new Date(a.dateJoined).getTime();
                bValue = new Date(b.dateJoined).getTime();
            } else {
                // Default to id
                aValue = a.id;
                bValue = b.id;
            }

            if (sortOrder === 'ASC') {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            } else {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            }
        });

        // Calculate total and get paginated results
        const total = allUsers.length;
        const paginatedUsers = allUsers.slice(offset, offset + pageSize);

        res.json({
            success: true,
            data: paginatedUsers,
            pagination: {
                total,
                page: parseInt(page),
                limit: pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

/**
 * Get user statistics (total users by category and status)
 */
exports.getUsersStatistics = async (req, res) => {
    try {
        // Count Publishers by personaType
        const publishersByCategory = await db.Publisher.findAll({
            attributes: [
                'personaType',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']
            ],
            group: ['personaType'],
            raw: true,
            subQuery: false
        });

        // Count Viewers
        const viewersCount = await db.Viewer.count();

        // Count total active users
        const activePublishers = await db.Publisher.count({ where: { status: 'active' } });
        const activeViewers = await db.Viewer.count({ where: { status: 'active' } });
        const totalActiveUsers = activePublishers + activeViewers;

        // Count by status
        const publishersByStatus = await db.Publisher.findAll({
            attributes: [
                'status',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']
            ],
            group: ['status'],
            raw: true,
            subQuery: false
        });

        const viewersByStatus = await db.Viewer.findAll({
            attributes: [
                'status',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']
            ],
            group: ['status'],
            raw: true,
            subQuery: false
        });

        // Format category distribution
        const categoryData = [
            {
                name: 'Artists',
                value: parseInt(publishersByCategory.find(p => p.personaType === 'Artist')?.count || 0),
                color: '#475467'
            },
            {
                name: 'Art Galleries',
                value: parseInt(publishersByCategory.find(p => p.personaType === 'Gallery')?.count || 0),
                color: '#D8522E'
            },
            {
                name: 'Collectors',
                value: parseInt(publishersByCategory.find(p => p.personaType === 'Collector')?.count || 0),
                color: '#BA24D5'
            },
            {
                name: 'Viewers',
                value: viewersCount,
                color: '#444CE7'
            }
        ];

        res.json({
            success: true,
            data: {
                totalActiveUsers,
                categoryDistribution: categoryData,
                statusBreakdown: {
                    publishers: publishersByStatus,
                    viewers: viewersByStatus
                }
            }
        });
    } catch (error) {
        console.error('Error fetching user statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user statistics',
            error: error.message
        });
    }
};

/**
 * Get monthly user growth data for the last 12 months
 */
exports.getMonthlyUserGrowth = async (req, res) => {
    try {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        // Get current date and calculate 12 months back
        const now = new Date();
        const startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);

        const monthlyData = [];

        for (let i = 0; i < 12; i++) {
            const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
            const nextMonthDate = new Date(startDate.getFullYear(), startDate.getMonth() + i + 1, 1);
            const monthIndex = monthDate.getMonth();
            const monthName = months[monthIndex];

            // Count publishers created up to end of this month
            const publishersCount = await db.Publisher.count({
                where: {
                    createdAt: {
                        [db.Sequelize.Op.lt]: nextMonthDate
                    }
                }
            });

            // Count viewers created up to end of this month
            const viewersCount = await db.Viewer.count({
                where: {
                    createdAt: {
                        [db.Sequelize.Op.lt]: nextMonthDate
                    }
                }
            });

            const totalUsers = publishersCount + viewersCount;

            monthlyData.push({
                month: monthName,
                users: totalUsers
            });
        }

        res.json({
            success: true,
            data: monthlyData
        });
    } catch (error) {
        console.error('Error fetching monthly user growth:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching monthly user growth',
            error: error.message
        });
    }
};
