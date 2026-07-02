'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ViewerCarouselFavorite extends Model {
        static associate(models) {
            ViewerCarouselFavorite.belongsTo(models.Viewer, {
                foreignKey: 'viewerId',
                as: 'viewer',
                onDelete: 'CASCADE'
            });
            ViewerCarouselFavorite.belongsTo(models.Carousel, {
                foreignKey: 'carouselId',
                as: 'carousel',
                onDelete: 'CASCADE'
            });
        }
    }

    ViewerCarouselFavorite.init({
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
        }
    }, {
        sequelize,
        modelName: 'ViewerCarouselFavorite',
    });

    return ViewerCarouselFavorite;
};
