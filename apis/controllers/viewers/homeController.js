const db = require('../../models');
const { getCompleteImageUrl } = require('../../utils/imageUrlHelper');
const emailMiddleware = require('../../middleware/emailMiddleware');

const isViewMilestone = (views) => (
    [100, 500, 1000, 5000].includes(views) || (views >= 10000 && views % 10000 === 0)
);

const getFrontendUrl = () => (process.env.FRONTEND_URL || 'https://joincarsl.com').replace(/\/$/, '');

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
        publisher: carousel.publisher ? {
            id: carousel.publisher.id,
            name: carousel.publisher.name,
        } : null,
        views: carousel.views || 0,
        artworks: (carousel.artworks || []).map(artwork => ({
            id: artwork.id,
            title: artwork.title,
            imageUrl: getCompleteImageUrl(artwork.imageUrl),
            artist: artwork.artist,
        })),
    };
};

const getArtworkAspectDetails = (artwork) => {
    const width = parseFloat(artwork.widthInches);
    const height = parseFloat(artwork.heightInches);

    if (!width || !height || Number.isNaN(width) || Number.isNaN(height)) {
        return {
            orientation: null,
            aspectRatio: null,
        };
    }

    let orientation = 'landscape';
    if (width > height) {
        orientation = 'landscape';
    } else if (height > width) {
        orientation = 'landscape';
    }

    return {
        orientation,
        aspectRatio: Math.round((width / height) * 1000) / 1000,
    };
};

const formatCarouselDetail = (carousel) => {
    if (!carousel) return null;

    const artworks = carousel.artworks || [];

    return {
        id: carousel.id,
        name: carousel.name,
        description: carousel.description,
        imageUrl: artworks.length > 0 ? getCompleteImageUrl(artworks[0].imageUrl) : null,
        heroImageUrl: carousel.heroImageUrl ? getCompleteImageUrl(carousel.heroImageUrl) : null,
        artworkCount: artworks.length,
        views: carousel.views || 0,
        publisher: carousel.publisher ? {
            id: carousel.publisher.id,
            name: carousel.publisher.name,
            profilePicture: getCompleteImageUrl(carousel.publisher.profilePicture),
        } : null,
        artworks: artworks.map((artwork) => ({
            id: artwork.id,
            title: artwork.title,
            imageUrl: getCompleteImageUrl(artwork.imageUrl),
            ...getArtworkAspectDetails(artwork),
        })),
    };
};

exports.getHomeCarouselById = async (req, res) => {
    try {
        const { carouselId } = req.params;

        if (!/^\d+$/.test(carouselId)) {
            return res.status(400).json({
                success: false,
                message: 'carouselId must be a valid numeric id',
            });
        }

        const carousel = await db.Carousel.findOne({
            where: {
                id: carouselId,
                status: 'active',
                adminApproved: true,
                isDeleted: false,
            },
            include: [
                {
                    model: db.Publisher,
                    as: 'publisher',
                    attributes: ['id', 'name', 'profilePicture'],
                },
                {
                    model: db.Artwork,
                    as: 'artworks',
                    where: { isDeleted: false },
                    required: false,
                    separate: true,
                    attributes: ['id', 'title', 'imageUrl', 'heightInches', 'widthInches'],
                    order: [['createdAt', 'ASC']],
                },
            ],
        });

        if (!carousel) {
            return res.status(404).json({
                success: false,
                message: 'Carousel not found',
            });
        }

        res.json({
            carousel: formatCarouselDetail(carousel),
        });
    } catch (error) {
        console.error('Error fetching home carousel:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching carousel',
            error: error.message,
        });
    }
};

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

exports.saveWatchingCarousel = async (req, res) => {
    try {
        const viewerId = req.user.id;
        const { carouselId, progressSeconds } = req.body;

        if (!carouselId) {
            return res.status(400).json({
                success: false,
                message: 'carouselId is required',
            });
        }

        if (progressSeconds !== undefined && (!Number.isInteger(progressSeconds) || progressSeconds < 0)) {
            return res.status(400).json({
                success: false,
                message: 'progressSeconds must be a non-negative integer',
            });
        }

        const carousel = await db.Carousel.findOne({
            where: {
                id: carouselId,
                status: 'active',
                // adminApproved: true,
                isDeleted: false,
            },
        });

        if (!carousel) {
            return res.status(404).json({
                success: false,
                message: 'Carousel not found',
            });
        }

        await carousel.increment('views', { by: 1 });
        await carousel.reload({ attributes: ['id', 'name', 'views', 'publisherId'] });

        if (isViewMilestone(carousel.views)) {
            try {
                const publisher = await db.Publisher.findByPk(carousel.publisherId);
                if (publisher?.email) {
                    await emailMiddleware.sendMilestoneAlertEmail(publisher.email, {
                        firstName: publisher.name || publisher.email.split('@')[0],
                        carouselName: carousel.name,
                        itemName: carousel.name,
                        views: carousel.views,
                        milestoneLabel: `${carousel.views.toLocaleString()} views`,
                        actionUrl: `${getFrontendUrl()}/publisher/dashboard`,
                    });
                }
            } catch (emailError) {
                console.warn('Milestone email sending failed:', emailError);
            }
        }

        const existingWatch = await db.ViewerCarouselWatch.findOne({
            where: {
                viewerId,
                carouselId,
            },
        });

        if (existingWatch) {
            await existingWatch.increment('watchCount', { by: 1 });
            await existingWatch.update({
                lastWatchedAt: new Date(),
                progressSeconds: progressSeconds !== undefined ? progressSeconds : existingWatch.progressSeconds,
            });
            await existingWatch.reload({
                attributes: ['id', 'carouselId', 'lastWatchedAt', 'watchCount', 'progressSeconds'],
            });

            return res.json({
                success: true,
                message: 'Watching carousel updated successfully',
                watch: {
                    id: existingWatch.id,
                    carouselId: existingWatch.carouselId,
                    lastWatchedAt: existingWatch.lastWatchedAt,
                    watchCount: existingWatch.watchCount,
                    progressSeconds: existingWatch.progressSeconds,
                },
                views: carousel.views,
            });
        }

        const watch = await db.ViewerCarouselWatch.create({
            viewerId,
            carouselId,
            progressSeconds: progressSeconds !== undefined ? progressSeconds : null,
        });

        res.status(201).json({
            success: true,
            message: 'Watching carousel saved successfully',
            watch: {
                id: watch.id,
                carouselId: watch.carouselId,
                lastWatchedAt: watch.lastWatchedAt,
                watchCount: watch.watchCount,
                progressSeconds: watch.progressSeconds,
            },
            views: carousel.views,
        });
    } catch (error) {
        console.error('Error saving watching carousel:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving watching carousel',
            error: error.message,
        });
    }
};

exports.getRecentlyWatchedCarousels = async (req, res) => {
    try {
        const viewerId = req.user.id;

        const watches = await db.ViewerCarouselWatch.findAll({
            where: { viewerId },
            attributes: ['id', 'carouselId', 'lastWatchedAt', 'watchCount', 'progressSeconds'],
            include: [
                {
                    model: db.Carousel,
                    as: 'carousel',
                    required: true,
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
                },
            ],
            order: [['lastWatchedAt', 'DESC']],
            limit: 3,
        });

        res.json({
            success: true,
            carousels: watches.map(watch => ({
                ...formatCarousel(watch.carousel),
                lastWatchedAt: watch.lastWatchedAt,
                watchCount: watch.watchCount,
                progressSeconds: watch.progressSeconds,
            })),
        });
    } catch (error) {
        console.error('Error fetching recently watched carousels:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recently watched carousels',
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
