const db = require('../../models');
const { Op, Sequelize } = require('sequelize');
const { getCompleteImageUrl } = require('../../utils/imageUrlHelper');

/**
 * Get dashboard statistics (total users, carousels, views, favorites)
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const { startDate, endDate, period = '12 months' } = req.query;

        // Parse dates
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                }
            };
        } else {
            // Default date ranges based on period
            const now = new Date();
            let periodStartDate = new Date();

            switch (period) {
                case '24 hours':
                    periodStartDate.setHours(periodStartDate.getHours() - 24);
                    break;
                case '7 days':
                    periodStartDate.setDate(periodStartDate.getDate() - 7);
                    break;
                case '30 days':
                    periodStartDate.setDate(periodStartDate.getDate() - 30);
                    break;
                case '12 months':
                default:
                    periodStartDate.setFullYear(periodStartDate.getFullYear() - 1);
            }

            dateFilter = {
                createdAt: {
                    [Op.gte]: periodStartDate
                }
            };
        }

        // Count total active users (Publishers + Viewers)
        const activePublishers = await db.Publisher.count({
            where: { status: 'active' }
        });

        const activeViewers = await db.Viewer.count({
            where: { status: 'active' }
        });

        const totalActiveUsers = activePublishers + activeViewers;

        // Count new users in the period
        const newPublishers = await db.Publisher.count({
            where: dateFilter
        });

        const newViewers = await db.Viewer.count({
            where: dateFilter
        });

        const newUsers = newPublishers + newViewers;

        // Count total carousels
        const totalCarousels = await db.Carousel.count({
            where: { isDeleted: false }
        });

        // Count new carousels in the period
        const newCarousels = await db.Carousel.count({
            where: {
                ...dateFilter,
                isDeleted: false
            }
        });

        // Sum total views
        const viewsData = await db.Carousel.findOne({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('views')), 'totalViews']
            ],
            where: { isDeleted: false }
        });

        const totalViews = parseInt(viewsData?.dataValues?.totalViews) || 0;

        // Sum views for the period
        const periodViewsData = await db.Carousel.findOne({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('views')), 'totalViews']
            ],
            where: {
                ...dateFilter,
                isDeleted: false
            }
        });

        const periodViews = parseInt(periodViewsData?.dataValues?.totalViews) || 0;

        // Sum total favorites
        const favoritesData = await db.Carousel.findOne({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('numberOfFavorites')), 'totalFavorites']
            ],
            where: { isDeleted: false }
        });

        const totalFavorites = parseInt(favoritesData?.dataValues?.totalFavorites) || 0;

        // Calculate percentages (simple growth calculation)
        const newUsersPercentage = totalActiveUsers > 0 ? ((newUsers / totalActiveUsers) * 100).toFixed(1) : 0;
        const newCarouselsPercentage = totalCarousels > 0 ? ((newCarousels / totalCarousels) * 100).toFixed(1) : 0;
        const newViewsPercentage = totalViews > 0 ? ((periodViews / totalViews) * 100).toFixed(1) : 0;

        res.json({
            success: true,
            data: {
                totalActiveUsers,
                newUsers,
                newUsersPercentage: parseFloat(newUsersPercentage),
                totalCarousels,
                totalCarouselsPercentage: parseFloat(newCarouselsPercentage),
                totalViews,
                totalViewsPercentage: parseFloat(newViewsPercentage),
                totalFavorites,
                totalFavoritesPercentage: 5.2 // Placeholder
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message
        });
    }
};

/**
 * Get monthly data for chart (12 months or custom date range)
 */
exports.getMonthlyData = async (req, res) => {
    try {
        const { startDate, endDate, period = '12 months' } = req.query;

        // Determine date range
        let periodStartDate = new Date();
        let periodEndDate = new Date();

        if (startDate && endDate) {
            periodStartDate = new Date(startDate);
            periodEndDate = new Date(endDate);
        } else {
            switch (period) {
                case '24 hours':
                    periodStartDate.setHours(periodStartDate.getHours() - 24);
                    break;
                case '7 days':
                    periodStartDate.setDate(periodStartDate.getDate() - 7);
                    break;
                case '30 days':
                    periodStartDate.setDate(periodStartDate.getDate() - 30);
                    break;
                case '12 months':
                default:
                    periodStartDate.setFullYear(periodStartDate.getFullYear() - 1);
            }
        }

        // Get monthly aggregated user data
        const monthlyData = await db.Publisher.findAll({
            attributes: [
                [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt')), 'month'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            where: {
                createdAt: {
                    [Op.between]: [periodStartDate, periodEndDate]
                }
            },
            group: [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt'))],
            order: [['month', 'ASC']],
            raw: true,
            subQuery: false
        });

        // Format the data
        const formattedData = monthlyData.map(item => ({
            month: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
            value: parseInt(item.count) || 0
        }));

        // If no data or less than expected months, fill with zeros
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const completeData = months.map(month => {
            const found = formattedData.find(d => d.month === month);
            return found || { month, value: 0 };
        });

        res.json({
            success: true,
            data: completeData
        });
    } catch (error) {
        console.error('Error fetching monthly data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching monthly data',
            error: error.message
        });
    }
};

/**
 * Get top performing carousels
 */
exports.getTopCarousels = async (req, res) => {
    try {
        const { startDate, endDate, period = '12 months', limit = 10 } = req.query;

        // Parse dates
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                }
            };
        } else {
            const now = new Date();
            let periodStartDate = new Date();

            switch (period) {
                case '24 hours':
                    periodStartDate.setHours(periodStartDate.getHours() - 24);
                    break;
                case '7 days':
                    periodStartDate.setDate(periodStartDate.getDate() - 7);
                    break;
                case '30 days':
                    periodStartDate.setDate(periodStartDate.getDate() - 30);
                    break;
                case '12 months':
                default:
                    periodStartDate.setFullYear(periodStartDate.getFullYear() - 1);
            }

            dateFilter = {
                createdAt: {
                    [Op.gte]: periodStartDate
                }
            };
        }

        const carousels = await db.Carousel.findAll({
            attributes: [
                'id',
                'name',
                'tag',
                'status',
                'createdAt',
                'views',
                'numberOfFavorites',
                'numberOfShares'
            ],
            include: [
                {
                    model: db.Publisher,
                    as: 'publisher',
                    attributes: ['id', 'name', 'personaType', 'profilePicture']
                },
                {
                    model: db.Artwork,
                    as: 'artworks',
                    attributes: ['id', 'imageUrl'],
                    where: { isDeleted: false, },
                    required: false
                }
            ],
            where: {
                ...dateFilter,
                isDeleted: false
            },
            order: [['views', 'DESC']],
            limit: parseInt(limit),
            raw: false
        });

        console.log('Fetched carousels:', carousels);

        // Transform the data
        const transformedCarousels = carousels.map(carousel => {
            // Count active artworks
            const activeArtworks = carousel.artworks || [];

            return {
                id: carousel.id,
                name: carousel.name,
                publisherName: carousel.publisher?.name || 'Unknown',
                publisherType: carousel.publisher?.personaType || 'Unknown',
                carouselLength: activeArtworks.length,
                artCategory: carousel.tag || 'Uncategorized',
                status: carousel.status,
                createdAt: new Date(carousel.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                }),
                views: carousel.views || 0,
                numberOfFavorites: carousel.numberOfFavorites || 0,
                numberOfShares: carousel.numberOfShares || 0,
                publisherImage: getCompleteImageUrl(carousel.publisher?.profilePicture) || null,
                artworkImage: activeArtworks.length > 0 ? getCompleteImageUrl(activeArtworks[0].imageUrl) : null
            };
        });

        res.json({
            success: true,
            data: transformedCarousels
        });
    } catch (error) {
        console.error('Error fetching top carousels:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching top carousels',
            error: error.message
        });
    }
};
