const db = require('../../models');
const { getCompleteImageUrl } = require('../../utils/imageUrlHelper');

exports.getHomeCarousels = async (req, res) => {
    try {
        const featuredCarousel = await db.Carousel.findOne({
            where: {
                status: 'active',
                adminApproved: true,
                isDeleted: false,
            },
            include: [
                {
                    model: db.Publisher,
                    as: 'publisher',
                    attributes: ['id', 'name'],
                },
                {
                    model: db.Artwork,
                    as: 'artworks',
                    where: { isDeleted: false },
                    required: false,
                    attributes: ['id', 'title', 'imageUrl', 'artist'],
                    limit: 1,
                },
            ],
            order: [['views', 'DESC']],
            limit: 1,
        });

        const trendingCarousels = await db.Carousel.findAll({
            where: {
                status: 'active',
                adminApproved: true,
                isDeleted: false,
                ...(featuredCarousel && {
                    id: {
                        [db.Sequelize.Op.ne]: featuredCarousel.id,
                    }
                }),
            },
            include: [
                {
                    model: db.Publisher,
                    as: 'publisher',
                    attributes: ['id', 'name'],
                },
                {
                    model: db.Artwork,
                    as: 'artworks',
                    where: { isDeleted: false },
                    required: false,
                    attributes: ['id', 'title', 'imageUrl', 'artist'],
                    limit: 1,
                },
            ],
            order: [['views', 'DESC']],
            limit: 5,
        });

        const formatCarousel = (carousel) => {
            if (!carousel) return null;

            return {
                id: carousel.id,
                name: carousel.name,
                description: carousel.description,
                tag: carousel.tag,
                imageUrl: carousel.artworks && carousel.artworks.length > 0
                    ? getCompleteImageUrl(carousel.artworks[0].imageUrl)
                    : null,
                publisher: {
                    id: carousel.publisher.id,
                    name: carousel.publisher.name,
                },
                views: carousel.views || 0,
                artworks: (carousel.artworks || []).map(artwork => ({
                    id: artwork.id,
                    title: artwork.title,
                    imageUrl: getCompleteImageUrl(artwork.imageUrl),
                    artist: artwork.artist,
                })),
            };
        };

        res.json({
            success: true,
            featuredCarousel: formatCarousel(featuredCarousel),
            trendingCarousels: trendingCarousels.map(formatCarousel),
        });
    } catch (error) {
        console.error('Error fetching home carousels:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching carousels',
            error: error.message,
        });
    }
};

exports.getHomePublishers = async (req, res) => {
    try {
        const publishers = await db.Publisher.findAll({

            attributes: ['id', 'name', 'profilePicture', 'bio', 'personaType'],
            include: [
                {
                    model: db.Carousel,
                    as: 'carousels',
                    where: {
                        status: 'active',
                        adminApproved: true,
                        isDeleted: false,
                    },
                    required: false,
                    attributes: ['id', 'name', 'description', 'tag', 'views'],
                    include: [
                        {
                            model: db.Artwork,
                            as: 'artworks',
                            where: { isDeleted: false },
                            required: false,
                            attributes: ['id', 'title', 'imageUrl', 'artist'],
                        },
                    ],
                    order: [['views', 'DESC']],
                },
            ],
            limit: 20,
        });

        const formatCarousel = (carousel) => {
            if (!carousel) return null;

            return {
                id: carousel.id,
                name: carousel.name,
                description: carousel.description,
                tag: carousel.tag,
                imageUrl: carousel.artworks && carousel.artworks.length > 0
                    ? getCompleteImageUrl(carousel.artworks[0].imageUrl)
                    : null,
                publisher: {
                    id: carousel.publisher?.id,
                    name: carousel.publisher?.name,
                },
                views: carousel.views || 0,
                artworks: (carousel.artworks || []).map(artwork => ({
                    id: artwork.id,
                    title: artwork.title,
                    imageUrl: getCompleteImageUrl(artwork.imageUrl),
                    artist: artwork.artist,
                })),
            };
        };

        const formattedPublishers = publishers
            .filter(pub => pub.carousels && pub.carousels.length > 0)
            .map(publisher => ({
                id: publisher.id,
                name: publisher.name,
                profilePicture: getCompleteImageUrl(publisher.profilePicture),
                bio: publisher.bio || '',
                personaType: publisher.personaType,
                carousels: publisher.carousels.map(carousel => ({
                    ...formatCarousel(carousel),
                    publisher: {
                        id: publisher.id,
                        name: publisher.name,
                    },
                })),
            }));

        res.json({
            success: true,
            publishers: formattedPublishers,
        });
    } catch (error) {
        console.error('Error fetching home publishers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching publishers',
            error: error.message,
        });
    }
};
