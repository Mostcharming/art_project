/**
 * Global error handling middleware
 */
const multer = require('multer');
const { Publisher } = require('../models');
const emailMiddleware = require('./emailMiddleware');

const notifyPublisherUploadFailed = async (err, req) => {
    if (req.user?.type !== 'publisher' || !req.user?.id) return;

    const publisher = await Publisher.findByPk(req.user.id);
    if (!publisher?.email) return;

    await emailMiddleware.sendUploadFailedEmail(publisher.email, {
        firstName: publisher.name || publisher.email.split('@')[0],
        fileName: err.field || 'Artwork upload',
        reason: err.message || 'The upload could not be completed.',
    });
};

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if (err instanceof multer.MulterError) {
        notifyPublisherUploadFailed(err, req).catch(emailError => {
            console.warn('Upload failed email sending failed:', emailError);
        });

        return res.status(400).json({
            error: err.message,
        });
    }

    if (err.status) {
        if (req.path.includes('/carousels') && req.user?.type === 'publisher') {
            notifyPublisherUploadFailed(err, req).catch(emailError => {
                console.warn('Upload failed email sending failed:', emailError);
            });
        }

        return res.status(err.status).json({
            error: err.message,
        });
    }

    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            error: 'Validation error',
            details: err.errors.map(e => ({ field: e.path, message: e.message })),
        });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            error: 'This resource already exists',
            field: err.errors[0].path,
        });
    }

    res.status(err.status || 500).json({
        error: 'Internal server error',
    });
};

module.exports = errorHandler;
