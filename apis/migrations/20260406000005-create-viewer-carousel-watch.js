'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ViewerCarouselWatches', {
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
            lastWatchedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
                comment: 'Last time this viewer watched this carousel',
            },
            watchCount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
                comment: 'Number of watch events recorded for this viewer and carousel',
            },
            progressSeconds: {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: 'Optional playback progress in seconds',
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

        await queryInterface.addConstraint('ViewerCarouselWatches', {
            fields: ['viewerId', 'carouselId'],
            type: 'unique',
            name: 'unique_viewer_carousel_watch',
        });

        await queryInterface.addIndex('ViewerCarouselWatches', ['viewerId', 'lastWatchedAt'], {
            name: 'idx_viewer_carousel_watches_viewer_last_watched',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ViewerCarouselWatches');
    },
};
