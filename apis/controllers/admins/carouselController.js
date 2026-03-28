const db = require('../../models');
const { logActivity } = require('../../utils/adminActivityService');
const { getCompleteImageUrl } = require('../../utils/imageUrlHelper');

/**
 * Get single carousel details with publisher info and artworks
 */
exports.getCarouselDetails = async (req, res) => {
    try {
        const { carouselId } = req.params;

        const carousel = await db.Carousel.findOne({
            where: {
                id: carouselId,
                isDeleted: false
            },
            include: [
                {
                    model: db.Publisher,
                    as: 'publisher',
                    attributes: ['id', 'name', 'email', 'personaType', 'profilePicture', 'bio', 'country']
                },
                {
                    model: db.Artwork,
                    as: 'artworks',
                    where: { isDeleted: false },
                    required: false
                }
            ]
        });

        if (!carousel) {
            return res.status(404).json({
                success: false,
                message: 'Carousel not found'
            });
        }

        // Get publisher carousel count and total views
        const publisherStats = await db.Carousel.findOne({
            attributes: [
                [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'carouselCount'],
                [db.Sequelize.fn('SUM', db.Sequelize.col('views')), 'totalViews']
            ],
            where: {
                publisherId: carousel.publisherId,
                isDeleted: false
            },
            raw: true
        });

        // Calculate completion rate based on status
        const completionRate = carousel.status === 'scheduled' ? 70 : 100;

        // Calculate average view duration (views * frameTimingSeconds)
        const totalViews = carousel.views || 0;
        const averageViewDuration = Math.round((totalViews * carousel.frameTimingSeconds) / 60); // Convert to minutes

        // Format the response
        const carouselData = {
            id: carousel.id,
            name: carousel.name,
            description: carousel.description,
            tag: carousel.tag ? (typeof carousel.tag === 'string' ? [carousel.tag] : carousel.tag) : [],
            country: carousel.country,
            views: carousel.views || 0,
            numberOfFavorites: carousel.numberOfFavorites || 0,
            numberOfShares: carousel.numberOfShares || 0,
            completionRate: completionRate,
            averageViewDuration: averageViewDuration,
            status: carousel.status,
            createdAt: carousel.createdAt,
            frameTimingSeconds: carousel.frameTimingSeconds,
            publisher: {
                id: carousel.publisher.id,
                name: carousel.publisher.name,
                email: carousel.publisher.email,
                personaType: carousel.publisher.personaType || 'Artist',
                profilePicture: getCompleteImageUrl(carousel.publisher.profilePicture),
                bio: carousel.publisher.bio || '',
                region: carousel.publisher.country || '',
                carouselCount: parseInt(publisherStats?.carouselCount) || 0,
                totalViews: parseInt(publisherStats?.totalViews) || 0
            },
            artworks: (carousel.artworks || []).map(artwork => ({
                id: artwork.id,
                title: artwork.title,
                artist: artwork.artist,
                imageUrl: getCompleteImageUrl(artwork.imageUrl),
                heightInches: artwork.heightInches,
                widthInches: artwork.widthInches,
                yearOfCreation: artwork.yearOfCreation,
                purchasePrice: artwork.purchasePrice
            }))
        };

        res.json({
            success: true,
            carousel: carouselData
        });
    } catch (error) {
        console.error('Error fetching carousel details:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching carousel details',
            error: error.message
        });
    }
};

/**
 * Flag a carousel as inappropriate
 */
exports.flagCarousel = async (req, res) => {
    try {
        const { carouselId } = req.params;
        const { status, reason, additionalInfo } = req.body;
        const adminId = req.user?.id; // Assuming admin info is in req.user from auth middleware

        // Validate required fields
        if (!status || !reason) {
            return res.status(400).json({
                success: false,
                message: 'Status and reason are required'
            });
        }

        // Find the carousel
        const carousel = await db.Carousel.findOne({
            where: {
                id: carouselId,
                isDeleted: false
            }
        });

        if (!carousel) {
            return res.status(404).json({
                success: false,
                message: 'Carousel not found'
            });
        }

        // Update carousel with flag status and increment flagged count
        await carousel.update({
            status: status,
            isFlagged: true,
            flaggedReason: reason,
            additionalReason: additionalInfo || null,
            flaggedCount: carousel.flaggedCount + 1
        });

        await logActivity(req.user.id, 'FLAG_CAROUSEL', {
            entityType: 'Carousel',
            entityId: carouselId,
            details: {
                reason: reason,
                status: status,
                additionalInfo: additionalInfo || null
            }
        });



        res.json({
            success: true,
            message: 'Carousel flagged successfully',
            carousel: {
                id: carousel.id,
                status: carousel.status,
                isFlagged: true
            }
        });
    } catch (error) {
        console.error('Error flagging carousel:', error);
        res.status(500).json({
            success: false,
            message: 'Error flagging carousel',
            error: error.message
        });
    }
};

/**
 * Get pending approval carousels (adminApproved = false and status = active/published)
 */
exports.getPendingApprovalCarousels = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Build where clause
        const whereClause = {
            adminApproved: false,
            status: 'active',
            isDeleted: false
        };

        // Add date range filter if provided
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) {
                whereClause.createdAt[db.Sequelize.Op.gte] = new Date(startDate);
            }
            if (endDate) {
                whereClause.createdAt[db.Sequelize.Op.lte] = new Date(endDate);
            }
        }

        const rows = await db.Carousel.findAll({
            where: whereClause,
            include: [
                {
                    model: db.Publisher,
                    as: 'publisher',
                    attributes: ['id', 'name', 'personaType', 'profilePicture']
                },
                {
                    model: db.Artwork,
                    as: 'artworks',
                    where: { isDeleted: false },
                    required: false,
                    attributes: ['id', 'imageUrl']
                }
            ],
            order: [['createdAt', 'DESC']],
            raw: false,
            subQuery: false
        });

        const formattedCarousels = rows.map(carousel => ({
            id: carousel.id,
            title: carousel.name,
            img: carousel.artworks && carousel.artworks.length > 0
                ? getCompleteImageUrl(carousel.artworks[0].imageUrl)
                : null,
            creator: carousel.publisher?.name || 'Unknown',
            creatorType: carousel.publisher?.personaType || 'Artist',
            length: carousel.artworks?.length || 0,
            category: carousel.tag || 'Uncategorized',
            date: new Date(carousel.createdAt).toLocaleDateString('en-US'),
            status: carousel.status,
            adminApproved: carousel.adminApproved
        }));

        res.json({
            success: true,
            data: formattedCarousels
        });
    } catch (error) {
        console.error('Error fetching pending approval carousels:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching pending approval carousels',
            error: error.message
        });
    }
};

/**
 * Get flagged/reported carousels (status = flagged)
 */
exports.getFlaggedCarousels = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Build where clause
        const whereClause = {
            status: 'flagged',
            isDeleted: false
        };

        // Add date range filter if provided
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) {
                whereClause.createdAt[db.Sequelize.Op.gte] = new Date(startDate);
            }
            if (endDate) {
                whereClause.createdAt[db.Sequelize.Op.lte] = new Date(endDate);
            }
        }

        const rows = await db.Carousel.findAll({
            where: whereClause,
            include: [
                {
                    model: db.Publisher,
                    as: 'publisher',
                    attributes: ['id', 'name', 'personaType', 'profilePicture']
                },
                {
                    model: db.Artwork,
                    as: 'artworks',
                    where: { isDeleted: false },
                    required: false,
                    attributes: ['id', 'imageUrl']
                }
            ],
            order: [['createdAt', 'DESC']],
            raw: false,
            subQuery: false
        });

        const formattedCarousels = rows.map(carousel => ({
            id: carousel.id,
            title: carousel.name,
            img: carousel.artworks && carousel.artworks.length > 0
                ? getCompleteImageUrl(carousel.artworks[0].imageUrl)
                : null,
            creator: carousel.publisher?.name || 'Unknown',
            creatorType: carousel.publisher?.personaType || 'Artist',
            reportCount: carousel.flaggedCount || 0,
            dateReported: new Date(carousel.createdAt).toLocaleDateString('en-US'),
            reason: carousel.flaggedReason || 'Not specified',
            status: carousel.status
        }));

        res.json({
            success: true,
            data: formattedCarousels
        });
    } catch (error) {
        console.error('Error fetching flagged carousels:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching flagged carousels',
            error: error.message
        });
    }
};
