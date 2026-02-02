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
            // define association here if needed
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
        }
    }, {
        sequelize,
        modelName: 'Publisher',
    });
    return Publisher;
};
