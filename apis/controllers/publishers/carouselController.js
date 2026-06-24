const { Carousel, Artwork, Publisher, sequelize } = require('../../models');
const { Op } = require('sequelize');
const path = require('path');
const { processCarouselImages, processCarouselsImages } = require('../../utils/imageUrlHelper');

const parseOptionalInteger = (value) => {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? NaN : parsed;
};

const parseOptionalDecimal = (value) => {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? NaN : parsed;
};

const parseRequiredDecimal = (value) => {
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? NaN : parsed;
};

const parseArtworksPayload = (artworks) => {
    if (artworks === undefined || artworks === null || artworks === '') {
        return [];
    }

    if (typeof artworks === 'string') {
        try {
            return JSON.parse(artworks);
        } catch {
            const error = new Error('Invalid artworks payload');
            error.status = 400;
            throw error;
        }
    }

    return artworks;
};

const buildArtworkDraftRows = ({ artworks, files = [], carouselId, status = 'draft' }) => {
    if (!Array.isArray(artworks)) {
        const error = new Error('Artworks must be an array');
        error.status = 400;
        throw error;
    }

    return artworks.map((artwork, index) => {
        if (!artwork || typeof artwork !== 'object') {
            const error = new Error(`Artwork ${index + 1} must be an object`);
            error.status = 400;
            throw error;
        }

        const title = typeof artwork.title === 'string' ? artwork.title.trim() : '';
        const artist = typeof artwork.artist === 'string' ? artwork.artist.trim() : '';
        const heightInches = parseRequiredDecimal(artwork.height);
        const widthInches = parseRequiredDecimal(artwork.width);
        const yearOfCreation = parseOptionalInteger(artwork.yearOfCreation);
        const purchasePrice = parseOptionalDecimal(artwork.purchasePrice);

        if (!title || !artist || Number.isNaN(heightInches) || Number.isNaN(widthInches)) {
            const error = new Error(`Artwork ${index + 1} requires title, artist, height, and width`);
            error.status = 400;
            throw error;
        }

        if (Number.isNaN(yearOfCreation)) {
            const error = new Error(`Artwork ${index + 1} has an invalid year of creation`);
            error.status = 400;
            throw error;
        }

        if (Number.isNaN(purchasePrice)) {
            const error = new Error(`Artwork ${index + 1} has an invalid purchase price`);
            error.status = 400;
            throw error;
        }

        let imageUrl = null;
        if (files.length > index && files[index]) {
            imageUrl = `/uploads/artworks/${files[index].filename}`;
            console.log(`Artwork ${index} (${title}): File saved as ${files[index].filename}`);
        } else if (artwork.imageUrl) {
            imageUrl = artwork.imageUrl;
            console.log(`Artwork ${index} (${title}): Using provided imageUrl`);
        } else {
            console.log(`Artwork ${index} (${title}): No image or imageUrl found`);
        }

        return {
            carouselId,
            title,
            artist,
            heightInches,
            widthInches,
            yearOfCreation,
            purchasePrice,
            status,
            imageUrl
        };
    });
};

exports.createCarouselDraft = async (req, res, next) => {
    try {
        let { name, tag, country, description, frameTimingSeconds, artworks } = req.body;
        const publisherId = req.user.id;

        artworks = parseArtworksPayload(artworks);

        if (typeof frameTimingSeconds === 'string') {
            frameTimingSeconds = parseInt(frameTimingSeconds, 10);
        }

        name = typeof name === 'string' ? name.trim() : '';
        country = typeof country === 'string' ? country.trim() : '';

        if (!name || !country || !frameTimingSeconds || Number.isNaN(frameTimingSeconds)) {
            return res.status(400).json({
                error: 'Name, country, and frameTimingSeconds are required'
            });
        }

        if (frameTimingSeconds < 10 || frameTimingSeconds > 300) {
            return res.status(400).json({
                error: 'Frame timing must be between 10 and 300 seconds'
            });
        }

        const publisher = await Publisher.findByPk(publisherId);
        if (!publisher) {
            return res.status(404).json({ error: 'Publisher not found' });
        }

        const completeCarousel = await sequelize.transaction(async (transaction) => {
            const carousel = await Carousel.create({
                publisherId,
                name,
                tag: tag && typeof tag === 'string' ? tag.trim() || null : null,
                country,
                description: description && typeof description === 'string' ? description.trim() || null : null,
                frameTimingSeconds,
                status: 'draft'
            }, { transaction });

            if (artworks.length > 0) {
                const artworksToCreate = buildArtworkDraftRows({
                    artworks,
                    files: req.files || [],
                    carouselId: carousel.id,
                    status: 'draft'
                });

                await Artwork.bulkCreate(artworksToCreate, { transaction });
            }

            return Carousel.findByPk(carousel.id, {
                include: {
                    model: Artwork,
                    as: 'artworks'
                },
                transaction
            });
        });

        res.status(201).json({
            message: 'Carousel draft created successfully',
            carousel: processCarouselImages(completeCarousel)
        });
    } catch (error) {
        console.error('Create carousel draft error:', error);
        next(error);
    }
};

exports.updateCarouselDraft = async (req, res, next) => {
    try {
        const { carouselId } = req.params;
        const { name, tag, country, description, frameTimingSeconds, artworks } = req.body;
        const publisherId = req.user.id;

        const carousel = await Carousel.findOne({
            where: {
                id: carouselId,
                publisherId
            }
        });

        if (!carousel) {
            return res.status(404).json({ error: 'Carousel not found' });
        }

        if (carousel.status !== 'draft') {
            return res.status(400).json({
                error: 'Can only update carousel in draft status'
            });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (tag !== undefined) {
            const normalizedTag = typeof tag === 'string' ? tag.trim() : tag;
            updateData.tag = normalizedTag || null;
        }
        if (country) updateData.country = country;
        if (description !== undefined) {
            const normalizedDescription = typeof description === 'string' ? description.trim() : description;
            updateData.description = normalizedDescription || null;
        }
        if (frameTimingSeconds) {
            if (frameTimingSeconds < 10 || frameTimingSeconds > 300) {
                return res.status(400).json({
                    error: 'Frame timing must be between 10 and 300 seconds'
                });
            }
            updateData.frameTimingSeconds = frameTimingSeconds;
        }

        await carousel.update(updateData);

        if (artworks) {
            const artworksArray = typeof artworks === 'string' ? JSON.parse(artworks) : artworks;

            console.log('=== UPDATE CAROUSEL DEBUG ===');
            console.log('Total artworks in request:', artworksArray.length);
            console.log('Files uploaded:', req.files ? req.files.length : 0);
            artworksArray.forEach((art, idx) => {
                console.log(`Artwork ${idx}:`, {
                    id: art.id,
                    title: art.title,
                    hasUri: !!art.uri,
                    hasImageUrl: !!art.imageUrl
                });
            });

            // Get IDs of artworks being kept (filter out undefined/null IDs)
            const artworkIdsToKeep = artworksArray
                .filter(artwork => artwork.id && artwork.id !== 'undefined')
                .map(artwork => artwork.id);

            console.log('Artwork IDs to keep:', artworkIdsToKeep);

            // Delete artworks that are not in the new list (they were deleted by the user)
            if (artworkIdsToKeep.length > 0) {
                const deleteResult = await Artwork.destroy({
                    where: {
                        carouselId,
                        id: {
                            [Op.notIn]: artworkIdsToKeep
                        }
                    }
                });
                console.log('Deleted artworks count:', deleteResult);
            } else {
                // If no artworks with IDs are being kept, delete all existing artworks
                const deleteResult = await Artwork.destroy({
                    where: { carouselId }
                });
                console.log('Deleted all artworks count:', deleteResult);
            }

            // Keep track of file indices for new artworks
            let fileIndex = 0;
            const newArtworksToCreate = [];

            for (const artwork of artworksArray) {
                // Skip existing artworks (they have an ID)
                if (artwork.id && artwork.id !== 'undefined') {
                    console.log(`Skipping existing artwork ${artwork.id}`);
                    continue;
                }

                console.log(`Processing new artwork: ${artwork.title}`);
                let imageUrl = null;
                if (req.files && req.files.length > fileIndex) {
                    // New artwork - use the uploaded file
                    imageUrl = `/uploads/artworks/${req.files[fileIndex].filename}`;
                    console.log(`New artwork ${artwork.title} using file: ${imageUrl}`);
                    fileIndex++;
                } else {
                    console.log(`New artwork ${artwork.title} has no file uploaded`);
                }

                newArtworksToCreate.push({
                    carouselId,
                    title: artwork.title,
                    artist: artwork.artist,
                    heightInches: parseFloat(artwork.height),
                    widthInches: parseFloat(artwork.width),
                    yearOfCreation: artwork.yearOfCreation ? parseInt(artwork.yearOfCreation) : null,
                    purchasePrice: artwork.purchasePrice ? parseFloat(artwork.purchasePrice) : null,
                    status: 'draft',
                    imageUrl
                });
            }

            console.log('New artworks to create count:', newArtworksToCreate.length);

            // Create new artworks
            if (newArtworksToCreate.length > 0) {
                const createdArtworks = await Artwork.bulkCreate(newArtworksToCreate);
                console.log('Created artworks count:', createdArtworks.length);
            }
        }

        const updatedCarousel = await Carousel.findByPk(carouselId, {
            include: {
                model: Artwork,
                as: 'artworks'
            }
        });

        res.status(200).json({
            message: 'Carousel draft updated successfully',
            carousel: processCarouselImages(updatedCarousel)
        });
    } catch (error) {
        console.error('Update carousel draft error:', error);
        next(error);
    }
};

exports.publishCarouselDraft = async (req, res, next) => {
    try {
        const { carouselId } = req.params;
        const publisherId = req.user.id;

        const carousel = await Carousel.findOne({
            where: {
                id: carouselId,
                publisherId
            },
            include: {
                model: Artwork,
                as: 'artworks'
            }
        });

        if (!carousel) {
            return res.status(404).json({ error: 'Carousel not found' });
        }

        if (carousel.status !== 'draft') {
            return res.status(400).json({
                error: 'Can only publish carousels in draft status'
            });
        }

        // Validate carousel has at least one artwork
        if (!carousel.artworks || carousel.artworks.length === 0) {
            return res.status(400).json({
                error: 'Carousel must have at least one artwork to publish'
            });
        }

        // Update carousel status to active
        await carousel.update({
            status: 'active'
        });

        // Update all artworks status to active
        await Artwork.update(
            { status: 'active' },
            { where: { carouselId } }
        );

        const publishedCarousel = await Carousel.findByPk(carouselId, {
            include: {
                model: Artwork,
                as: 'artworks'
            }
        });

        res.status(200).json({
            message: 'Carousel published successfully',
            carousel: processCarouselImages(publishedCarousel)
        });
    } catch (error) {
        console.error('Publish carousel draft error:', error);
        next(error);
    }
};

exports.getCarouselDraft = async (req, res, next) => {
    try {
        const { carouselId } = req.params;
        const publisherId = req.user.id;

        const carousel = await Carousel.findOne({
            where: {
                id: carouselId,
                publisherId
            },
            include: {
                model: Artwork,
                as: 'artworks'
            }
        });

        if (!carousel) {
            return res.status(404).json({ error: 'Carousel not found' });
        }

        res.status(200).json({
            carousel: processCarouselImages(carousel)
        });
    } catch (error) {
        console.error('Get carousel draft error:', error);
        next(error);
    }
};

exports.getAllCarouselDrafts = async (req, res, next) => {
    try {
        const publisherId = req.user.id;

        const carousels = await Carousel.findAll({
            where: {
                publisherId,
                status: 'draft'
            },
            include: {
                model: Artwork,
                as: 'artworks'
            },
            order: [['updatedAt', 'DESC']]
        });

        res.status(200).json({
            carousels: processCarouselsImages(carousels)
        });
    } catch (error) {
        console.error('Get all carousel drafts error:', error);
        next(error);
    }
};

exports.deleteCarouselDraft = async (req, res, next) => {
    try {
        const { carouselId } = req.params;
        const publisherId = req.user.id;

        const carousel = await Carousel.findOne({
            where: {
                id: carouselId,
                publisherId
            }
        });

        if (!carousel) {
            return res.status(404).json({ error: 'Carousel not found' });
        }

        if (carousel.status !== 'draft') {
            return res.status(400).json({
                error: 'Can only delete carousel in draft status'
            });
        }

        await Artwork.destroy({
            where: { carouselId }
        });

        await carousel.destroy();

        res.status(200).json({
            message: 'Carousel draft deleted successfully'
        });
    } catch (error) {
        console.error('Delete carousel draft error:', error);
        next(error);
    }
};

exports.moveToDraft = async (req, res, next) => {
    try {
        const { carouselId } = req.params;
        const publisherId = req.user.id;

        const carousel = await Carousel.findOne({
            where: {
                id: carouselId,
                publisherId
            }
        });

        if (!carousel) {
            return res.status(404).json({ error: 'Carousel not found' });
        }

        // Only allow moving from active or scheduled to draft
        if (!['active', 'scheduled'].includes(carousel.status)) {
            return res.status(400).json({
                error: 'Can only move active or scheduled carousels to draft'
            });
        }

        // Update carousel status to draft and clear scheduled publish date if exists
        await carousel.update({
            status: 'draft',
            scheduledPublishDate: null,
            adminApproved: false
        });

        // Update all artworks status to draft
        await Artwork.update(
            { status: 'draft' },
            { where: { carouselId } }
        );

        const updatedCarousel = await Carousel.findByPk(carouselId, {
            include: {
                model: Artwork,
                as: 'artworks'
            }
        });

        res.status(200).json({
            message: 'Carousel moved to draft successfully',
            carousel: processCarouselImages(updatedCarousel)
        });
    } catch (error) {
        console.error('Move to draft error:', error);
        next(error);
    }
};

exports.getActiveCarousels = async (req, res, next) => {
    try {
        const publisherId = req.user.id;

        const carousels = await Carousel.findAll({
            where: {
                publisherId,
                status: 'active',
                isDeleted: false
            },
            include: {
                model: Artwork,
                as: 'artworks'
            },
            order: [['updatedAt', 'DESC']]
        });

        res.status(200).json({
            carousels: processCarouselsImages(carousels)
        });
    } catch (error) {
        console.error('Get active carousels error:', error);
        next(error);
    }
};

exports.getScheduledCarousels = async (req, res, next) => {
    try {
        const publisherId = req.user.id;
        const now = new Date();

        const scheduledCarousels = await Carousel.findAll({
            where: {
                publisherId,
                status: 'scheduled',
                isDeleted: false
            },
            include: {
                model: Artwork,
                as: 'artworks'
            },
            order: [['scheduledPublishDate', 'ASC']]
        });

        const carouselsToActivate = [];
        const carouselsToReturn = [];

        for (const carousel of scheduledCarousels) {
            if (carousel.scheduledPublishDate && carousel.scheduledPublishDate <= now) {
                carousel.status = 'active';
                carousel.scheduledPublishDate = null;
                carouselsToActivate.push(carousel.save());
                carouselsToReturn.push(carousel);
            } else {
                carouselsToReturn.push(carousel);
            }
        }

        if (carouselsToActivate.length > 0) {
            await Promise.all(carouselsToActivate);
        }

        res.status(200).json({
            carousels: processCarouselsImages(carouselsToReturn)
        });
    } catch (error) {
        console.error('Get scheduled carousels error:', error);
        next(error);
    }
};

exports.updateCarousel = async (req, res, next) => {
    try {
        const { carouselId } = req.params;
        const { name, tag, country, description, frameTimingSeconds, status, scheduledPublishDate, artworks } = req.body;
        const publisherId = req.user.id;

        const carousel = await Carousel.findOne({
            where: {
                id: carouselId,
                publisherId
            }
        });

        if (!carousel) {
            return res.status(404).json({ error: 'Carousel not found' });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (tag !== undefined) {
            const normalizedTag = typeof tag === 'string' ? tag.trim() : tag;
            updateData.tag = normalizedTag || null;
        }
        if (country) updateData.country = country;
        if (description !== undefined) {
            const normalizedDescription = typeof description === 'string' ? description.trim() : description;
            updateData.description = normalizedDescription || null;
        }
        if (frameTimingSeconds) {
            if (frameTimingSeconds < 10 || frameTimingSeconds > 300) {
                return res.status(400).json({
                    error: 'Frame timing must be between 10 and 300 seconds'
                });
            }
            updateData.frameTimingSeconds = frameTimingSeconds;
        }
        if (status && ['active', 'draft', 'scheduled'].includes(status)) {
            updateData.status = status;
        }
        if (scheduledPublishDate !== undefined) {
            if (scheduledPublishDate) {
                const publishDate = new Date(scheduledPublishDate);
                if (isNaN(publishDate.getTime())) {
                    return res.status(400).json({
                        error: 'Invalid scheduled publish date format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss)'
                    });
                }
                if (publishDate <= new Date()) {
                    return res.status(400).json({
                        error: 'Scheduled publish date must be in the future'
                    });
                }
                updateData.scheduledPublishDate = publishDate;
            } else {
                updateData.scheduledPublishDate = null;
            }
        }

        await carousel.update(updateData);

        if (artworks && Array.isArray(artworks)) {
            const artworksArray = typeof artworks === 'string' ? JSON.parse(artworks) : artworks;

            await Artwork.destroy({
                where: { carouselId }
            });

            if (artworksArray.length > 0) {
                const artworksToCreate = artworksArray.map((artwork, index) => {
                    let imageUrl = null;
                    if (req.files && req.files.length > index && req.files[index]) {
                        imageUrl = `/uploads/artworks/${req.files[index].filename}`;
                    } else if (artwork.imageUrl) {
                        imageUrl = artwork.imageUrl;
                    }

                    return {
                        carouselId,
                        title: artwork.title,
                        artist: artwork.artist,
                        heightInches: parseFloat(artwork.height),
                        widthInches: parseFloat(artwork.width),
                        yearOfCreation: artwork.yearOfCreation ? parseInt(artwork.yearOfCreation) : null,
                        purchasePrice: artwork.purchasePrice ? parseFloat(artwork.purchasePrice) : null,
                        status: carousel.status === 'draft' ? 'draft' : 'active',
                        imageUrl
                    };
                });

                await Artwork.bulkCreate(artworksToCreate);
            }
        }

        const updatedCarousel = await Carousel.findByPk(carouselId, {
            include: {
                model: Artwork,
                as: 'artworks'
            }
        });

        res.status(200).json({
            message: 'Carousel updated successfully',
            carousel: processCarouselImages(updatedCarousel)
        });
    } catch (error) {
        console.error('Update carousel error:', error);
        next(error);
    }
};

exports.deleteCarousel = async (req, res, next) => {
    try {
        const { carouselId } = req.params;
        const publisherId = req.user.id;

        const carousel = await Carousel.findOne({
            where: {
                id: carouselId,
                publisherId
            }
        });

        if (!carousel) {
            return res.status(404).json({ error: 'Carousel not found' });
        }

        await Artwork.destroy({
            where: { carouselId }
        });

        await carousel.destroy();

        res.status(200).json({
            message: 'Carousel deleted successfully'
        });
    } catch (error) {
        console.error('Delete carousel error:', error);
        next(error);
    }
};

exports.getOneCarousel = async (req, res, next) => {
    try {
        const { carouselId } = req.params;
        const publisherId = req.user.id;

        const carousel = await Carousel.findOne({
            where: {
                id: carouselId,
                publisherId,
                isDeleted: false
            },
            include: {
                model: Artwork,
                as: 'artworks'
            }
        });

        if (!carousel) {
            return res.status(404).json({ error: 'Carousel not found' });
        }

        res.status(200).json({
            carousel: processCarouselImages(carousel)
        });
    } catch (error) {
        console.error('Get one carousel error:', error);
        next(error);
    }
};

exports.scheduleCarouselForPublish = async (req, res, next) => {
    try {
        const { carouselId } = req.params;
        const { scheduledPublishDate } = req.body;
        const publisherId = req.user.id;

        if (!scheduledPublishDate) {
            return res.status(400).json({
                error: 'scheduledPublishDate is required'
            });
        }

        const publishDate = new Date(scheduledPublishDate);
        if (isNaN(publishDate.getTime())) {
            return res.status(400).json({
                error: 'Invalid scheduled publish date format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss)'
            });
        }

        if (publishDate <= new Date()) {
            return res.status(400).json({
                error: 'Scheduled publish date must be in the future'
            });
        }

        const carousel = await Carousel.findOne({
            where: {
                id: carouselId,
                publisherId
            },
            include: {
                model: Artwork,
                as: 'artworks'
            }
        });

        if (!carousel) {
            return res.status(404).json({ error: 'Carousel not found' });
        }

        // Only allow scheduling from draft or active status
        if (!['draft', 'active'].includes(carousel.status)) {
            return res.status(400).json({
                error: 'Can only schedule carousels in draft or active status'
            });
        }

        // Validate carousel has at least one artwork
        if (!carousel.artworks || carousel.artworks.length === 0) {
            return res.status(400).json({
                error: 'Carousel must have at least one artwork to schedule'
            });
        }

        // Update carousel status to scheduled with the publish date/time
        await carousel.update({
            status: 'scheduled',
            scheduledPublishDate: publishDate
        });

        // Update all artworks status to scheduled
        await Artwork.update(
            { status: 'scheduled' },
            { where: { carouselId } }
        );

        const scheduledCarousel = await Carousel.findByPk(carouselId, {
            include: {
                model: Artwork,
                as: 'artworks'
            }
        });

        res.status(200).json({
            message: 'Carousel scheduled for publish successfully',
            carousel: processCarouselImages(scheduledCarousel)
        });
    } catch (error) {
        console.error('Schedule carousel for publish error:', error);
        next(error);
    }
};

exports.getDashboardData = async (req, res, next) => {
    try {
        const publisherId = req.user.id;
        const { Subscriber } = require('../../models');

        const liveProjects = await Carousel.count({
            where: {
                publisherId,
                status: 'active',
                isDeleted: false
            }
        });

        const subscribers = await Subscriber.count({
            where: {
                publisherId,
                isActive: true
            }
        });

        const allCarousels = await Carousel.findAll({
            where: {
                publisherId,
                isDeleted: false
            },
            attributes: ['id', 'views']
        });
        const totalViews = allCarousels.reduce((sum, carousel) => sum + (carousel.views || 0), 0);
        const watchTimeInHours = Math.round((totalViews * 3) / 60);

        res.status(200).json({
            dashboardData: {
                liveProjects,
                subscribers,
                watchTimeInHours
            }
        });
    } catch (error) {
        console.error('Get dashboard data error:', error);
        next(error);
    }
};
