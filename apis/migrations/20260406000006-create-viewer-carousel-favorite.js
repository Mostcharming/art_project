'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ViewerCarouselFavorites', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            viewerId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Viewers',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            carouselId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Carousels',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
        });

        await queryInterface.addConstraint('ViewerCarouselFavorites', {
            fields: ['viewerId', 'carouselId'],
            type: 'unique',
            name: 'unique_viewer_carousel_favorite',
        });

        await queryInterface.addIndex('ViewerCarouselFavorites', ['viewerId', 'createdAt'], {
            name: 'idx_viewer_carousel_favorites_viewer_created_at',
        });

        await queryInterface.addIndex('ViewerCarouselFavorites', ['carouselId'], {
            name: 'idx_viewer_carousel_favorites_carousel',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ViewerCarouselFavorites');
    },
};
