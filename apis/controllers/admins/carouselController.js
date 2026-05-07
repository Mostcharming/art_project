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
            flaggedReason: carousel.flaggedReason || null,
            additionalReason: carousel.additionalReason || null,
            flaggedCount: carousel.flaggedCount || 0,
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

/**
 * Approve a pending carousel (set adminApproved = true)
 */
exports.approveCarousel = async (req, res) => {
    try {
        const { carouselId } = req.params;
        const adminId = req.user?.id;

        // Validate admin ID
        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
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

        // Update carousel to approved
        await carousel.update({
            adminApproved: true
        });

        // Log the activity
        await logActivity(adminId, 'APPROVE_CAROUSEL', {
            entityType: 'Carousel',
            entityId: carouselId,
            details: {
                action: 'approved',
                previousStatus: carousel.adminApproved
            }
        });

        res.json({
            success: true,
            message: 'Carousel approved successfully',
            carousel: {
                id: carousel.id,
                adminApproved: true
            }
        });
    } catch (error) {
        console.error('Error approving carousel:', error);
        res.status(500).json({
            success: false,
            message: 'Error approving carousel',
            error: error.message
        });
    }
};

/**
 * Reject a pending carousel (set status = flagged and reason = admin rejected)
 */
exports.rejectCarousel = async (req, res) => {
    try {
        const { carouselId } = req.params;
        const adminId = req.user?.id;

        // Validate admin ID
        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
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

        // Update carousel with rejected status
        await carousel.update({
            status: 'flagged',
            isFlagged: true,
            flaggedReason: 'Admin rejected',
            flaggedCount: carousel.flaggedCount + 1
        });

        // Log the activity
        await logActivity(adminId, 'REJECT_CAROUSEL', {
            entityType: 'Carousel',
            entityId: carouselId,
            details: {
                action: 'rejected',
                reason: 'Admin rejected',
                previousStatus: carousel.status
            }
        });

        res.json({
            success: true,
            message: 'Carousel rejected successfully',
            carousel: {
                id: carousel.id,
                status: 'flagged',
                isFlagged: true
            }
        });
    } catch (error) {
        console.error('Error rejecting carousel:', error);
        res.status(500).json({
            success: false,
            message: 'Error rejecting carousel',
            error: error.message
        });
    }
};

/**
 * Dismiss a flagged carousel report (set status = active)
 */
exports.dismissReport = async (req, res) => {
    try {
        const { carouselId } = req.params;
        const { unflaggedReason } = req.body;
        const adminId = req.user?.id;

        // Validate admin ID
        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
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

        // Store previous status for logging
        const previousStatus = carousel.status;

        // Update carousel to active status and clear flag, save unflaggedReason
        await carousel.update({
            status: 'active',
            isFlagged: false,
            unflaggedReason: unflaggedReason || 'Report dismissed by admin'
        });

        // Log the activity
        await logActivity(adminId, 'DISMISS_REPORT', {
            entityType: 'Carousel',
            entityId: carouselId,
            details: {
                action: 'dismissed',
                previousStatus: previousStatus,
                newStatus: 'active',
                reason: unflaggedReason || 'Report dismissed by admin'
            }
        });

        res.json({
            success: true,
            message: 'Report dismissed successfully',
            carousel: {
                id: carousel.id,
                status: 'active',
                isFlagged: false
            }
        });
    } catch (error) {
        console.error('Error dismissing report:', error);
        res.status(500).json({
            success: false,
            message: 'Error dismissing report',
            error: error.message
        });
    }
};

/**
 * Remove a carousel content (set isDeleted = true)
 */
exports.removeCarousel = async (req, res) => {
    try {
        const { carouselId } = req.params;
        const { removalReason } = req.body;
        const adminId = req.user?.id;

        // Validate admin ID
        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
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

        // Store previous status for logging
        const previousStatus = carousel.status;

        // Update carousel to deleted with removalReason
        await carousel.update({
            isDeleted: true,
            removalReason: removalReason || 'Content removed by admin'
        });

        // Log the activity
        await logActivity(adminId, 'REMOVE_CAROUSEL', {
            entityType: 'Carousel',
            entityId: carouselId,
            details: {
                action: 'removed',
                previousStatus: previousStatus,
                reason: removalReason || 'Content removed by admin'
            }
        });

        res.json({
            success: true,
            message: 'Carousel removed successfully',
            carousel: {
                id: carousel.id,
                isDeleted: true
            }
        });
    } catch (error) {
        console.error('Error removing carousel:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing carousel',
            error: error.message
        });
    }
};
