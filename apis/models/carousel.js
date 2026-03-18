'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Carousel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Carousel.belongsTo(models.Publisher, {
                foreignKey: 'publisherId',
                as: 'publisher'
            });
            Carousel.hasMany(models.Artwork, {
                foreignKey: 'carouselId',
                as: 'artworks'
            });
        }
    }

    Carousel.init({
        publisherId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Publishers',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Name of the carousel'
        },
        tag: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Optional tag for categorization'
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Country where the carousel content is from'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Description of the carousel'
        },
        frameTimingSeconds: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 10,
                max: 300
            },
            comment: 'Frame timing per artwork in seconds'
        },
        status: {
            type: DataTypes.ENUM('active', 'draft', 'scheduled'),
            defaultValue: 'draft',
            comment: 'Status of the carousel'
        },
        scheduledPublishDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Date and time when scheduled carousel should be published'
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Soft delete flag'
        },
        views: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Number of views for the carousel'
        },
        numberOfFavorites: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Number of times this carousel has been favorited'
        },
        numberOfShares: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Number of times this carousel has been shared'
        }
    }, {
        sequelize,
        modelName: 'Carousel',
    });

    return Carousel;
};
