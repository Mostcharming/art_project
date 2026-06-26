'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ViewerCarouselFavorite extends Model {
        static associate(models) {
            ViewerCarouselFavorite.belongsTo(models.Viewer, {
                foreignKey: 'viewerId',
                as: 'viewer'
            });
            ViewerCarouselFavorite.belongsTo(models.Carousel, {
                foreignKey: 'carouselId',
                as: 'carousel'
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
            }
        },
        carouselId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Carousels',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'ViewerCarouselFavorite',
    });

    return ViewerCarouselFavorite;
};
