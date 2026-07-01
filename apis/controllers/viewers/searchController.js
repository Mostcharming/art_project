const db = require('../../models');
const { getCompleteImageUrl, sortArtworksByDisplayOrder } = require('../../utils/imageUrlHelper');

const { Op } = db.Sequelize;

const SEARCH_TYPES = ['artworks', 'artists'];
const DEFAULT_SEARCH_LIMIT = 24;
const MAX_SEARCH_LIMIT = 100;
const DEFAULT_HISTORY_LIMIT = 4;
const MAX_HISTORY_LIMIT = 20;
const MAX_QUERY_LENGTH = 255;

const activeCarouselWhere = {
    status: 'active',
    adminApproved: true,
    isDeleted: false,
};

const normalizeSearchQuery = (value) => {
    if (typeof value !== 'string') {
        return '';
    }

    return value.trim().replace(/\s+/g, ' ');
};

const parseLimit = (value, fallback, max) => {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) {
        return null;
    }

    return Math.min(parsed, max);
};

const validateOptionalQuery = (query) => {
    if (query.length > MAX_QUERY_LENGTH) {
        return `query must be ${MAX_QUERY_LENGTH} characters or fewer`;
    }

    return null;
};

const validateRequiredQuery = (query) => {
    if (!query) {
        return 'query is required';
    }

    return validateOptionalQuery(query);
};

const saveViewerSearch = async (viewerId, query) => {
    if (!viewerId) {
        return null;
    }

    const normalizedQuery = query.toLowerCase();
    const [history, created] = await db.ViewerSearchHistory.findOrCreate({
        where: {
            viewerId,
            normalizedQuery,
        },
        defaults: {
            viewerId,
            query,
            normalizedQuery,
            searchCount: 1,
        },
    });

    if (!created) {
        await history.increment('searchCount', { by: 1 });
        await history.update({ query });
        await history.reload();
    }

    return history;
};

const getCarouselArtworkMap = async (carouselIds) => {
    if (!carouselIds.length) {
        return new Map();
    }

    const artworks = await db.Artwork.findAll({
        where: {
            carouselId: { [Op.in]: carouselIds },
            isDeleted: false,
        },
        attributes: ['id', 'title', 'imageUrl', 'carouselId', 'displayOrder'],
        order: [['displayOrder', 'ASC'], ['id', 'ASC']],
    });

    return artworks.reduce((map, artwork) => {
        const existing = map.get(artwork.carouselId) || [];
        existing.push(artwork);
        map.set(artwork.carouselId, existing);
        return map;
    }, new Map());
};

const formatCarouselSummary = (carousel, carouselArtworks = []) => {
    if (!carousel) {
        return null;
    }

    const sortedCarouselArtworks = sortArtworksByDisplayOrder(carouselArtworks);
    const firstCarouselArtwork = sortedCarouselArtworks[0];
    const carouselImageUrl = firstCarouselArtwork
        ? getCompleteImageUrl(firstCarouselArtwork.imageUrl)
        : null;
    const heroImageUrl = carousel?.heroImageUrl
        ? getCompleteImageUrl(carousel.heroImageUrl)
        : carouselImageUrl;

    return {
        id: carousel.id,
        name: carousel.name,
        description: carousel.description,
        imageUrl: carouselImageUrl,
        heroImageUrl,
        views: carousel.views || 0,
        artworkCount: sortedCarouselArtworks.length,
        tag: carousel.tag,
        publisher: carousel.publisher ? {
            id: carousel.publisher.id,
            name: carousel.publisher.name,
            profilePicture: getCompleteImageUrl(carousel.publisher.profilePicture),
        } : null,
    };
};

const formatArtworkSearchResult = (artwork, carouselArtworks = []) => {
    return {
        id: artwork.id,
        type: 'artworks',
        title: artwork.title,
        artist: artwork.artist || artwork.carousel?.publisher?.name || null,
        artworkCount: carouselArtworks.length,
        imageUrl: getCompleteImageUrl(artwork.imageUrl),
        carouselId: artwork.carouselId,
        carousel: formatCarouselSummary(artwork.carousel, carouselArtworks),
    };
};

const formatArtistSearchResult = (publisher) => {
    const carousels = [...(publisher.carousels || [])].sort((a, b) => (
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    ));
    const primaryCarousel = carousels[0] || null;
    const primaryCarouselArtworks = sortArtworksByDisplayOrder(primaryCarousel?.artworks || []);
    const allArtworks = carousels.flatMap((carousel) => carousel.artworks || []);
    const primaryImageUrl = getCompleteImageUrl(publisher.profilePicture)
        || (primaryCarouselArtworks[0] ? getCompleteImageUrl(primaryCarouselArtworks[0].imageUrl) : null);
    const carousel = formatCarouselSummary(primaryCarousel, primaryCarouselArtworks);

    if (carousel) {
        carousel.publisher = {
            id: publisher.id,
            name: publisher.name,
            profilePicture: getCompleteImageUrl(publisher.profilePicture),
        };
    }

    return {
        id: publisher.id,
        type: 'artists',
        title: publisher.name,
        artist: publisher.name,
        artworkCount: allArtworks.length,
        imageUrl: primaryImageUrl,
        carouselId: primaryCarousel?.id || null,
        carousel,
    };
};

const buildArtworkSearchWhere = (query) => {
    const where = {
        isDeleted: false,
    };

    if (!query) {
        return where;
    }

    const likeQuery = `%${query}%`;

    return {
        ...where,
        [Op.or]: [
            { title: { [Op.iLike]: likeQuery } },
            { artist: { [Op.iLike]: likeQuery } },
            { '$carousel.name$': { [Op.iLike]: likeQuery } },
            { '$carousel.description$': { [Op.iLike]: likeQuery } },
            { '$carousel.tag$': { [Op.iLike]: likeQuery } },
            { '$carousel.publisher.name$': { [Op.iLike]: likeQuery } },
        ],
    };
};

const searchInclude = [
    {
        model: db.Carousel,
        as: 'carousel',
        required: true,
        where: activeCarouselWhere,
        attributes: ['id', 'name', 'description', 'tag', 'views', 'createdAt'],
        include: [
            {
                model: db.Publisher,
                as: 'publisher',
                attributes: ['id', 'name', 'profilePicture'],
            },
        ],
    },
];

const artistInclude = [
    {
        model: db.Carousel,
        as: 'carousels',
        required: true,
        where: activeCarouselWhere,
        attributes: ['id', 'name', 'description', 'tag', 'views', 'createdAt'],
        include: [
            {
                model: db.Artwork,
                as: 'artworks',
                where: { isDeleted: false },
                required: false,
                attributes: ['id', 'title', 'imageUrl', 'displayOrder'],
            },
        ],
    },
];

const searchArtworks = async ({ query, limit }) => {
    const { count, rows } = await db.Artwork.findAndCountAll({
        where: buildArtworkSearchWhere(query),
        include: searchInclude,
        attributes: ['id', 'title', 'artist', 'imageUrl', 'carouselId', 'createdAt'],
        distinct: true,
        subQuery: false,
        order: [['createdAt', 'DESC'], ['id', 'DESC']],
        limit,
    });

    const carouselIds = [...new Set(rows.map((artwork) => artwork.carouselId).filter(Boolean))];
    const carouselArtworkMap = await getCarouselArtworkMap(carouselIds);

    return {
        total: count,
        results: rows.map((artwork) => formatArtworkSearchResult(
            artwork,
            carouselArtworkMap.get(artwork.carouselId) || []
        )),
    };
};

const searchArtists = async ({ query, limit }) => {
    const publisherWhere = query
        ? { name: { [Op.iLike]: `%${query}%` } }
        : {};

    const { count, rows } = await db.Publisher.findAndCountAll({
        where: publisherWhere,
        include: artistInclude,
        attributes: ['id', 'name', 'profilePicture', 'createdAt'],
        distinct: true,
        order: [['createdAt', 'DESC'], ['id', 'DESC']],
        limit,
    });

    return {
        total: count,
        results: rows.map(formatArtistSearchResult),
    };
};

exports.search = async (req, res) => {
    try {
        const query = normalizeSearchQuery(req.query.query);
        const type = req.query.type || 'artworks';
        const limit = parseLimit(req.query.limit, DEFAULT_SEARCH_LIMIT, MAX_SEARCH_LIMIT);
        const queryError = validateOptionalQuery(query);

        if (queryError) {
            return res.status(400).json({
                success: false,
                message: queryError,
            });
        }

        if (!SEARCH_TYPES.includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'type must be "artworks" or "artists"',
            });
        }

        if (!limit) {
            return res.status(400).json({
                success: false,
                message: 'limit must be a positive integer',
            });
        }

        if (req.user?.id && query) {
            await saveViewerSearch(req.user.id, query).catch((error) => {
                console.warn('Failed to save viewer search history:', error.message);
            });
        }

        const searchResults = type === 'artists'
            ? await searchArtists({ query, limit })
            : await searchArtworks({ query, limit });

        res.json({
            success: true,
            query,
            type,
            total: searchResults.total,
            results: searchResults.results,
        });
    } catch (error) {
        console.error('Viewer search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching viewer content',
            error: error.message,
        });
    }
};

exports.getSearchHistory = async (req, res) => {
    try {
        const limit = parseLimit(req.query.limit, DEFAULT_HISTORY_LIMIT, MAX_HISTORY_LIMIT);

        if (!limit) {
            return res.status(400).json({
                success: false,
                message: 'limit must be a positive integer',
            });
        }

        if (!req.user?.id) {
            return res.json({
                success: true,
                recentSearches: [],
            });
        }

        const history = await db.ViewerSearchHistory.findAll({
            where: { viewerId: req.user.id },
            attributes: ['query'],
            order: [['updatedAt', 'DESC']],
            limit,
        });

        res.json({
            success: true,
            recentSearches: history.map((item) => item.query),
        });
    } catch (error) {
        console.error('Get viewer search history error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching search history',
            error: error.message,
        });
    }
};

exports.saveSearchHistory = async (req, res) => {
    try {
        const query = normalizeSearchQuery(req.body.query);
        const queryError = validateRequiredQuery(query);

        if (queryError) {
            return res.status(400).json({
                success: false,
                message: queryError,
            });
        }

        if (!req.user?.id) {
            return res.status(201).json({
                success: true,
                query,
                saved: false,
            });
        }

        const history = await saveViewerSearch(req.user.id, query);

        res.status(201).json({
            success: true,
            query: history.query,
            saved: true,
        });
    } catch (error) {
        console.error('Save viewer search history error:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving search history',
            error: error.message,
        });
    }
};
