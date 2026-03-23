'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('AdminActivityLogs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            adminId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Admins',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            action: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: 'Type of action performed'
            },
            entityType: {
                type: Sequelize.STRING,
                allowNull: true,
                comment: 'Type of entity affected'
            },
            entityId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: 'ID of the entity that was affected'
            },
            details: {
                type: Sequelize.JSON,
                allowNull: true,
                comment: 'Additional details about the action'
            },
            ipAddress: {
                type: Sequelize.STRING,
                allowNull: true,
                comment: 'IP address of the admin'
            },
            userAgent: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'User agent of the browser/client'
            },
            status: {
                type: Sequelize.ENUM('success', 'failed', 'pending'),
                defaultValue: 'success',
                comment: 'Status of the action'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // Add index on adminId for faster queries
        await queryInterface.addIndex('AdminActivityLogs', ['adminId']);

        // Add index on action for filtering
        await queryInterface.addIndex('AdminActivityLogs', ['action']);

        // Add index on createdAt for sorting
        await queryInterface.addIndex('AdminActivityLogs', ['createdAt']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('AdminActivityLogs');
    }
};
