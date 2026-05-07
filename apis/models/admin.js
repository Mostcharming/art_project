'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Belongs to Role
            Admin.belongsTo(models.Role, {
                foreignKey: 'roleId',
                as: 'roleDetails'
            });

            // One-to-Many relationship with AdminActivityLog
            Admin.hasMany(models.AdminActivityLog, {
                foreignKey: 'adminId',
                as: 'activityLogs'
            });
        }
    }
    Admin.init({
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
        firstName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Whether the admin account is active'
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resetPasswordTokenExpires: {
            type: DataTypes.DATE,
            allowNull: true
        },
        lastLoginAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Timestamp of last login'
        },
        loginToken: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: '4-digit login token sent to email'
        },
        loginTokenExpires: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Expiration time for login token'
        },
        profilePicture: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'URL or path to admin profile picture'
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Roles',
                key: 'id'
            },
            comment: 'Foreign key to Role table'
        }
    }, {
        sequelize,
        modelName: 'Admin',
    });
    return Admin;
};
