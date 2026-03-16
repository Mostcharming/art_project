'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Artwork extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Artwork.belongsTo(models.Carousel, {
                foreignKey: 'carouselId',
                as: 'carousel'
            });
        }
    }

    Artwork.init({
        carouselId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Carousels',
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Title of the artwork'
        },
        artist: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Name of the artist'
        },
        heightInches: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Height of the artwork in inches'
        },
        widthInches: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Width of the artwork in inches'
        },
        yearOfCreation: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Year the artwork was created'
        },
        purchasePrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Purchase price of the artwork'
        },
        status: {
            type: DataTypes.ENUM('active', 'draft', 'scheduled'),
            defaultValue: 'draft',
            comment: 'Status of the artwork'
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Soft delete flag'
        },
        views: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Number of views for the artwork'
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'URL or path to the artwork image file'
        }
    }, {
        sequelize,
        modelName: 'Artwork',
    });

    return Artwork;
};
