'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class AdminActivityLog extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Belongs to Admin
            AdminActivityLog.belongsTo(models.Admin, {
                foreignKey: 'adminId',
                as: 'admin'
            });
        }
    }
    AdminActivityLog.init({
        adminId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Admins',
                key: 'id'
            }
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Type of action performed (e.g., LOGIN, APPROVE_CONTENT, REJECT_CONTENT, etc.)'
        },
        entityType: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Type of entity affected (e.g., Carousel, Artwork, Admin, etc.)'
        },
        entityId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'ID of the entity that was affected'
        },
        details: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'Additional details about the action in JSON format'
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'IP address of the admin when performing the action'
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'User agent of the browser/client'
        },
        status: {
            type: DataTypes.ENUM('success', 'failed', 'pending'),
            defaultValue: 'success',
            comment: 'Status of the action'
        }
    }, {
        sequelize,
        modelName: 'AdminActivityLog',
        tableName: 'AdminActivityLogs'
    });
    return AdminActivityLog;
};
