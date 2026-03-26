'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Publisher extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Publisher.hasMany(models.Carousel, {
                foreignKey: 'publisherId',
                as: 'carousels'
            });
            Publisher.hasMany(models.Subscriber, {
                foreignKey: 'publisherId',
                as: 'subscribers'
            });
        }
    }
    Publisher.init({
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        verificationToken: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: '4-digit verification code'
        },
        verificationTokenExpires: {
            type: DataTypes.DATE,
            allowNull: true
        },
        isEmailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Email verification status'
        },
        accountSetupComplete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'Marks if profile setup (persona type, name, country, bio) is complete'
        },
        personaType: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Type of publisher persona (e.g., individual, gallery, institution)'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Publisher name or business name'
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Publisher country'
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Publisher bio'
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resetPasswordTokenExpires: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('active', 'suspended', 'banned'),
            defaultValue: 'active',
            allowNull: false,
            comment: 'Publisher account status: active, suspended, or banned'
        },
        suspensionStartDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Start date of suspension'
        },
        suspensionEndDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'End date of suspension'
        },
        reasonForSuspension: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for publisher account suspension'
        },
        reasonForBan: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for publisher account ban'
        },
        reasonForReactivation: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for reactivating publisher account'
        },
        profilePicture: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'URL to publisher profile picture'
        },
        website: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Publisher website URL'
        }
    }, {
        sequelize,
        modelName: 'Publisher',
    });
    return Publisher;
};
