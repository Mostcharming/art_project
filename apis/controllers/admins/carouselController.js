const db = require('../../models');
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
