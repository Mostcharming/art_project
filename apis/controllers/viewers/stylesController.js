const { Style } = require('../../models');

/**
 * Get all available styles
 */
exports.getAllStyles = async (req, res, next) => {
    try {
        const styles = await Style.findAll({
            attributes: ['id', 'name', 'description'],
            order: [['name', 'ASC']],
        });

        res.json(styles);
    } catch (error) {
        console.error('Get all styles error:', error);
        next(error);
    }
};

/**
 * Get a specific style
 */
exports.getStyle = async (req, res, next) => {
    try {
        const { id } = req.params;

        const style = await Style.findByPk(id, {
            attributes: ['id', 'name', 'description'],
        });

        if (!style) {
            return res.status(404).json({ error: 'Style not found' });
        }

        res.json(style);
    } catch (error) {
        console.error('Get style error:', error);
        next(error);
    }
};
