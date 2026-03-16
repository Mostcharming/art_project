const { Carousel, Artwork } = require('../../models');
const { Publisher } = require('../../models');
const path = require('path');
const { processCarouselImages, processCarouselsImages } = require('../../utils/imageUrlHelper');

exports.createCarouselDraft = async (req, res, next) => {
    try {
        let { name, tag, country, description, frameTimingSeconds, artworks } = req.body;
        const publisherId = req.user.id;

        if (typeof artworks === 'string') {
            artworks = JSON.parse(artworks);
        }

        if (typeof frameTimingSeconds === 'string') {
            frameTimingSeconds = parseInt(frameTimingSeconds);
        }

        if (!name || !country || !frameTimingSeconds) {
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

        const carousel = await Carousel.create({
            publisherId,
            name,
            tag: tag && typeof tag === 'string' ? tag : null,
            country,
            description: description && typeof description === 'string' ? description : null,
            frameTimingSeconds,
            status: 'draft'
        });

        if (artworks && Array.isArray(artworks) && artworks.length > 0) {
            const artworksToCreate = artworks.map((artwork, index) => {
                let imageUrl = null;
                if (req.files && req.files.length > index && req.files[index]) {
                    imageUrl = `/uploads/artworks/${req.files[index].filename}`;
                    console.log(`Artwork ${index} (${artwork.title}): File saved as ${req.files[index].filename}`);
                } else if (artwork.imageUrl) {
                    imageUrl = artwork.imageUrl;
                    console.log(`Artwork ${index} (${artwork.title}): Using provided imageUrl`);
                } else {
                    console.log(`Artwork ${index} (${artwork.title}): No image or imageUrl found`);
                }

                return {
                    carouselId: carousel.id,
                    title: artwork.title,
                    artist: artwork.artist,
                    heightInches: parseFloat(artwork.height),
                    widthInches: parseFloat(artwork.width),
                    yearOfCreation: artwork.yearOfCreation ? parseInt(artwork.yearOfCreation) : null,
                    purchasePrice: artwork.purchasePrice ? parseFloat(artwork.purchasePrice) : null,
                    status: 'draft',
                    imageUrl
                };
            });

            await Artwork.bulkCreate(artworksToCreate);
        }

        const completeCarousel = await Carousel.findByPk(carousel.id, {
            include: {
                model: Artwork,
                as: 'artworks'
            }
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
        if (tag !== undefined) updateData.tag = tag;
        if (country) updateData.country = country;
        if (description !== undefined) updateData.description = description;
        if (frameTimingSeconds) {
            if (frameTimingSeconds < 10 || frameTimingSeconds > 300) {
                return res.status(400).json({
                    error: 'Frame timing must be between 10 and 300 seconds'
                });
            }
            updateData.frameTimingSeconds = frameTimingSeconds;
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
                        status: 'draft',
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
            message: 'Carousel draft updated successfully',
            carousel: processCarouselImages(updatedCarousel)
        });
    } catch (error) {
        console.error('Update carousel draft error:', error);
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
        if (tag !== undefined) updateData.tag = tag;
        if (country) updateData.country = country;
        if (description !== undefined) updateData.description = description;
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
            updateData.scheduledPublishDate = scheduledPublishDate;
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
        const watchTimeInHours = Math.round((totalViews * 10) / 60);

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
