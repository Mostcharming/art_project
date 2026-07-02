'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ViewerCarouselWatch extends Model {
        static associate(models) {
            ViewerCarouselWatch.belongsTo(models.Viewer, {
                foreignKey: 'viewerId',
                as: 'viewer',
                onDelete: 'CASCADE'
            });
            ViewerCarouselWatch.belongsTo(models.Carousel, {
                foreignKey: 'carouselId',
                as: 'carousel',
                onDelete: 'CASCADE'
            });
        }
    }

    ViewerCarouselWatch.init({
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
        lastWatchedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: 'Last time this viewer watched this carousel'
        },
        watchCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Number of watch events recorded for this viewer and carousel'
        },
        progressSeconds: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Optional playback progress in seconds'
        }
    }, {
        sequelize,
        modelName: 'ViewerCarouselWatch',
    });

    return ViewerCarouselWatch;
};
