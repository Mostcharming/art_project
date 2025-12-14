const { Favorite, Viewer } = require('../../models');

/**
 * Add a favorite (artwork or artist)
 */
exports.addFavorite = async (req, res, next) => {
    try {
        const viewerId = req.user.id;
        const { artworkId, artistId, favoriteType } = req.body;

        if (!favoriteType) {
            return res.status(400).json({ error: 'favoriteType is required' });
        }

        if (!['artwork', 'artist'].includes(favoriteType)) {
            return res.status(400).json({ error: 'favoriteType must be "artwork" or "artist"' });
        }

        if (favoriteType === 'artwork' && !artworkId) {
            return res.status(400).json({ error: 'artworkId is required for artwork favorites' });
        }

        if (favoriteType === 'artist' && !artistId) {
            return res.status(400).json({ error: 'artistId is required for artist favorites' });
        }

        // Check if favorite already exists
        const existingFavorite = await Favorite.findOne({
            where: {
                viewerId,
                artworkId: favoriteType === 'artwork' ? artworkId : null,
                artistId: favoriteType === 'artist' ? artistId : null,
                favoriteType,
            },
        });

        if (existingFavorite) {
            return res.status(409).json({ error: 'This item is already in your favorites' });
        }

        // Create favorite
        const favorite = await Favorite.create({
            viewerId,
            artworkId: favoriteType === 'artwork' ? artworkId : null,
            artistId: favoriteType === 'artist' ? artistId : null,
            favoriteType,
        });

        res.status(201).json({
            message: 'Added to favorites',
            favorite,
        });
    } catch (error) {
        console.error('Add favorite error:', error);
        next(error);
    }
};

/**
 * Get all favorites for a viewer
 */
exports.getFavorites = async (req, res, next) => {
    try {
        const viewerId = req.user.id;
        const { favoriteType } = req.query;

        const where = { viewerId };
        if (favoriteType) {
            if (!['artwork', 'artist'].includes(favoriteType)) {
                return res.status(400).json({ error: 'favoriteType must be "artwork" or "artist"' });
            }
            where.favoriteType = favoriteType;
        }

        const favorites = await Favorite.findAll({
            where,
            order: [['createdAt', 'DESC']],
        });

        res.json(favorites);
    } catch (error) {
        console.error('Get favorites error:', error);
        next(error);
    }
};

/**
 * Check if a specific item is favorited
 */
exports.isFavorited = async (req, res, next) => {
    try {
        const viewerId = req.user.id;
        const { artworkId, artistId, favoriteType } = req.query;

        if (!favoriteType) {
            return res.status(400).json({ error: 'favoriteType is required' });
        }

        if (!['artwork', 'artist'].includes(favoriteType)) {
            return res.status(400).json({ error: 'favoriteType must be "artwork" or "artist"' });
        }

        const favorite = await Favorite.findOne({
            where: {
                viewerId,
                artworkId: favoriteType === 'artwork' ? artworkId : null,
                artistId: favoriteType === 'artist' ? artistId : null,
                favoriteType,
            },
        });

        res.json({
            isFavorited: !!favorite,
            favorite: favorite || null,
        });
    } catch (error) {
        console.error('Check favorite error:', error);
        next(error);
    }
};

/**
 * Remove a favorite
 */
exports.removeFavorite = async (req, res, next) => {
    try {
        const viewerId = req.user.id;
        const { id } = req.params;

        const favorite = await Favorite.findByPk(id);
        if (!favorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        // Verify the favorite belongs to the authenticated viewer
        if (favorite.viewerId !== viewerId) {
            return res.status(403).json({ error: 'Not authorized to delete this favorite' });
        }

        await favorite.destroy();

        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        console.error('Delete favorite error:', error);
        next(error);
    }
};

/**
 * Get favorite counts for a viewer
 */
exports.getFavoriteCounts = async (req, res, next) => {
    try {
        const viewerId = req.user.id;

        const artworkCount = await Favorite.count({
            where: { viewerId, favoriteType: 'artwork' },
        });

        const artistCount = await Favorite.count({
            where: { viewerId, favoriteType: 'artist' },
        });

        res.json({
            viewerId,
            totalFavorites: artworkCount + artistCount,
            artworks: artworkCount,
            artists: artistCount,
        });
    } catch (error) {
        console.error('Get favorite counts error:', error);
        next(error);
    }
};
