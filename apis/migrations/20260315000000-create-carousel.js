'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Carousels', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
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
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: 'Name of the carousel'
            },
            tag: {
                type: Sequelize.STRING,
                allowNull: true,
                comment: 'Optional tag for categorization'
            },
            country: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: 'Country where the carousel content is from'
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Description of the carousel'
            },
            frameTimingSeconds: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 10,
                    max: 300
                },
                comment: 'Frame timing per artwork in seconds'
            },
            status: {
                type: Sequelize.ENUM('active', 'draft', 'scheduled'),
                defaultValue: 'draft',
                comment: 'Status of the carousel'
            },
            scheduledPublishDate: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'Date when scheduled carousel should be published'
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                comment: 'Soft delete flag'
            },
            views: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: 'Number of views for the carousel'
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
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Carousels');
    }
};
