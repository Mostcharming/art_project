const db = require('../../models');
const { getCompleteImageUrl } = require('../../utils/imageUrlHelper');

const activeCarouselWhere = {
    status: 'active',
    adminApproved: true,
    isDeleted: false,
};

const parseCarouselId = (value) => {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    const carouselId = Number(value);
    return Number.isInteger(carouselId) && carouselId > 0 ? carouselId : null;
};

const carouselInclude = [
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
];

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
        numberOfFavorites: carousel.numberOfFavorites || 0,
        artworks: (carousel.artworks || []).map(artwork => ({
            id: artwork.id,
            title: artwork.title,
            imageUrl: getCompleteImageUrl(artwork.imageUrl),
            artist: artwork.artist,
        })),
    };
};

const formatCarouselFavorite = (favorite) => ({
    id: favorite.id,
    carouselId: favorite.carouselId,
    createdAt: favorite.createdAt,
    carousel: formatCarousel(favorite.carousel),
});

const getFavoriteWithCarousel = (viewerId, carouselId) => db.ViewerCarouselFavorite.findOne({
    where: { viewerId, carouselId },
    include: [
        {
            model: db.Carousel,
            as: 'carousel',
            required: true,
            where: activeCarouselWhere,
            include: carouselInclude,
        },
    ],
});

exports.addCarouselFavorite = async (req, res, next) => {
    try {
        const viewerId = req.user.id;
        const carouselId = parseCarouselId(req.body.carouselId);

        if (!carouselId) {
            return res.status(400).json({
                success: false,
                message: 'carouselId must be a valid positive integer',
            });
        }

        const carousel = await db.Carousel.findOne({
            where: {
                id: carouselId,
                ...activeCarouselWhere,
            },
            attributes: ['id'],
        });

        if (!carousel) {
            return res.status(404).json({
                success: false,
                message: 'Carousel not found',
            });
        }

        const { created } = await db.sequelize.transaction(async (transaction) => {
            const [favorite, wasCreated] = await db.ViewerCarouselFavorite.findOrCreate({
                where: { viewerId, carouselId },
                defaults: { viewerId, carouselId },
                transaction,
            });

            if (wasCreated) {
                await db.Carousel.increment('numberOfFavorites', {
                    by: 1,
                    where: { id: carouselId },
                    transaction,
                });
            }

            return { favorite, created: wasCreated };
        });

        const favorite = await getFavoriteWithCarousel(viewerId, carouselId);

        res.status(created ? 201 : 200).json({
            success: true,
            message: created ? 'Carousel added to favorites' : 'Carousel is already in favorites',
            favorite: formatCarouselFavorite(favorite),
        });
    } catch (error) {
        console.error('Add carousel favorite error:', error);
        next(error);
    }
};

exports.getCarouselFavorites = async (req, res, next) => {
    try {
        const viewerId = req.user.id;

        const favorites = await db.ViewerCarouselFavorite.findAll({
            where: { viewerId },
            include: [
                {
                    model: db.Carousel,
                    as: 'carousel',
                    required: true,
                    where: activeCarouselWhere,
                    include: carouselInclude,
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json({
            success: true,
            favorites: favorites.map(formatCarouselFavorite),
        });
    } catch (error) {
        console.error('Get carousel favorites error:', error);
        next(error);
    }
};

exports.isCarouselFavorite = async (req, res, next) => {
    try {
        const viewerId = req.user.id;
        const carouselId = parseCarouselId(req.params.carouselId);

        if (!carouselId) {
            return res.status(400).json({
                success: false,
                message: 'carouselId must be a valid positive integer',
            });
        }

        const carousel = await db.Carousel.findOne({
            where: {
                id: carouselId,
                ...activeCarouselWhere,
            },
            attributes: ['id'],
        });

        if (!carousel) {
            return res.status(404).json({
                success: false,
                message: 'Carousel not found',
            });
        }

        const favorite = await db.ViewerCarouselFavorite.findOne({
            where: { viewerId, carouselId },
            attributes: ['id', 'carouselId', 'createdAt'],
        });

        res.json({
            success: true,
            carouselId,
            isFavorite: !!favorite,
            favorite: favorite || null,
        });
    } catch (error) {
        console.error('Check carousel favorite error:', error);
        next(error);
    }
};
