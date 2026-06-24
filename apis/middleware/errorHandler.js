/**
 * Global error handling middleware
 */
const multer = require('multer');

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            error: err.message,
        });
    }

    if (err.status) {
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
