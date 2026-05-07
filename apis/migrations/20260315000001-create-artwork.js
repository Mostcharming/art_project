'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Artworks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            carouselId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Carousels',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: 'Title of the artwork'
            },
            artist: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: 'Name of the artist'
            },
            heightInches: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                comment: 'Height of the artwork in inches'
            },
            widthInches: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                comment: 'Width of the artwork in inches'
            },
            yearOfCreation: {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: 'Year the artwork was created'
            },
            purchasePrice: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
                comment: 'Purchase price of the artwork'
            },
            status: {
                type: Sequelize.ENUM('active', 'draft', 'scheduled'),
                defaultValue: 'draft',
                comment: 'Status of the artwork'
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                comment: 'Soft delete flag'
            },
            views: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: 'Number of views for the artwork'
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
        await queryInterface.dropTable('Artworks');
    }
};
