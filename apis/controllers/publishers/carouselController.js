const { Carousel, Artwork } = require('../../models');
const { Publisher } = require('../../models');
const path = require('path');

exports.createCarouselDraft = async (req, res, next) => {
    try {
        let { name, tag, country, description, frameTimingSeconds, artworks } = req.body;
        const publisherId = req.user.id;

        console.log("Creating carousel draft:");
        console.log("- Files received:", req.files ? req.files.length : 0);
        console.log("- Body fields:", { name, tag, country, frameTimingSeconds });

        // Parse artworks if it's a string (from FormData)
        if (typeof artworks === 'string') {
            artworks = JSON.parse(artworks);
        }
        console.log("- Artworks count:", artworks ? artworks.length : 0);

        // Parse frameTimingSeconds if it's a string (from FormData)
        if (typeof frameTimingSeconds === 'string') {
            frameTimingSeconds = parseInt(frameTimingSeconds);
        }

        // Validation
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

        // Verify publisher exists
        const publisher = await Publisher.findByPk(publisherId);
        if (!publisher) {
            return res.status(404).json({ error: 'Publisher not found' });
        }

        // Create carousel as draft
        const carousel = await Carousel.create({
            publisherId,
            name,
            tag: tag && typeof tag === 'string' ? tag : null,
            country,
            description: description && typeof description === 'string' ? description : null,
            frameTimingSeconds,
            status: 'draft'
        });

        // Add artworks if provided
        if (artworks && Array.isArray(artworks) && artworks.length > 0) {
            const artworksToCreate = artworks.map((artwork, index) => {
                // Handle file from multer or image data
                let imageUrl = null;
                if (req.files && req.files.length > index && req.files[index]) {
                    // If file was uploaded via multer
                    imageUrl = `/uploads/artworks/${req.files[index].filename}`;
                    console.log(`Artwork ${index} (${artwork.title}): File saved as ${req.files[index].filename}`);
                } else if (artwork.imageUrl) {
                    // If imageUrl was provided in request body
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

        // Fetch the complete carousel with artworks
        const completeCarousel = await Carousel.findByPk(carousel.id, {
            include: {
                model: Artwork,
                as: 'artworks'
            }
        });

        res.status(201).json({
            message: 'Carousel draft created successfully',
            carousel: completeCarousel
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

        // Verify carousel exists and belongs to publisher
        const carousel = await Carousel.findOne({
            where: {
                id: carouselId,
                publisherId
            }
        });

        if (!carousel) {
            return res.status(404).json({ error: 'Carousel not found' });
        }

        // Only allow updates if carousel is in draft status
        if (carousel.status !== 'draft') {
            return res.status(400).json({
                error: 'Can only update carousel in draft status'
            });
        }

        // Update carousel fields
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

        // Handle artworks if provided
        if (artworks && Array.isArray(artworks)) {
            // Parse artworks if it's a string (from FormData)
            const artworksArray = typeof artworks === 'string' ? JSON.parse(artworks) : artworks;

            // Delete existing artworks
            await Artwork.destroy({
                where: { carouselId }
            });

            // Create new artworks
            if (artworksArray.length > 0) {
                const artworksToCreate = artworksArray.map((artwork, index) => {
                    // Handle file from multer or image data
                    let imageUrl = null;
                    if (req.files && req.files.length > index && req.files[index]) {
                        // If file was uploaded via multer
                        imageUrl = `/uploads/artworks/${req.files[index].filename}`;
                    } else if (artwork.imageUrl) {
                        // If imageUrl was provided in request body
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

        // Fetch the updated carousel with artworks
        const updatedCarousel = await Carousel.findByPk(carouselId, {
            include: {
                model: Artwork,
                as: 'artworks'
            }
        });

        res.status(200).json({
            message: 'Carousel draft updated successfully',
            carousel: updatedCarousel
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
            carousel
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
            carousels
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

        // Only allow deletion if carousel is in draft status
        if (carousel.status !== 'draft') {
            return res.status(400).json({
                error: 'Can only delete carousel in draft status'
            });
        }

        // Delete associated artworks
        await Artwork.destroy({
            where: { carouselId }
        });

        // Delete carousel
        await carousel.destroy();

        res.status(200).json({
            message: 'Carousel draft deleted successfully'
        });
    } catch (error) {
        console.error('Delete carousel draft error:', error);
        next(error);
    }
};
