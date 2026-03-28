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
            type: DataTypes.ENUM('active', 'draft', 'scheduled', 'flagged'),
            defaultValue: 'draft',
            comment: 'Status of the carousel'
        },
        flaggedReason: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Reason why the carousel was flagged'
        },
        additionalReason: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Additional details about the flagged content'
        },
        adminApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Whether the carousel has been approved by admin'
        },
        scheduledPublishDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Date and time when scheduled carousel should be published'
        },
        temporaryUnpublishStatus: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Flag to indicate if carousel is temporarily unpublished'
        },
        temporaryUnpublishStartDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Start date for temporary unpublish'
        },
        temporaryUnpublishEndDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'End date for temporary unpublish'
        },
        temporaryUnpublishReason: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for temporary unpublishing'
        },
        removalReason: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for removal of the carousel'
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
        },
        flaggedCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Number of times this carousel has been flagged'
        },
        unflaggedReason: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for removing flagged status'
        }
    }, {
        sequelize,
        modelName: 'Carousel',
    });

    return Carousel;
};
