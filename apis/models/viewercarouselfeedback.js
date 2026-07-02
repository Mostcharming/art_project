'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ViewerCarouselFeedback extends Model {
        static associate(models) {
            ViewerCarouselFeedback.belongsTo(models.Viewer, {
                foreignKey: 'viewerId',
                as: 'viewer',
                onDelete: 'CASCADE'
            });
            ViewerCarouselFeedback.belongsTo(models.Carousel, {
                foreignKey: 'carouselId',
                as: 'carousel',
                onDelete: 'CASCADE'
            });
        }
    }

    ViewerCarouselFeedback.init({
        viewerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Viewers',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        carouselId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Carousels',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        rating: {
            type: DataTypes.ENUM('dislike', 'like', 'love'),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'ViewerCarouselFeedback',
    });

    return ViewerCarouselFeedback;
};
