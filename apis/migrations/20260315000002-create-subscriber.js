'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Subscribers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            viewerId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Viewers',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            publisherId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Publishers',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                comment: 'Whether the subscription is still active'
            },
            subscribedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                comment: 'Timestamp when the viewer subscribed'
            },
            removedAt: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'Timestamp when the viewer unsubscribed or subscription was removed'
            },
            subscriptionType: {
                type: Sequelize.STRING,
                defaultValue: 'free',
                comment: 'Type of subscription (e.g., free, premium)'
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

        // Create a unique constraint on viewerId and publisherId to prevent duplicate subscriptions
        await queryInterface.addConstraint('Subscribers', {
            fields: ['viewerId', 'publisherId'],
            type: 'unique',
            name: 'unique_viewer_publisher'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Subscribers');
    }
};
