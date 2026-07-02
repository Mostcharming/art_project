'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ViewerCarouselFeedbacks', {
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
            rating: {
                type: Sequelize.ENUM('dislike', 'like', 'love'),
                allowNull: false,
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

        await queryInterface.addConstraint('ViewerCarouselFeedbacks', {
            fields: ['viewerId', 'carouselId'],
            type: 'unique',
            name: 'unique_viewer_carousel_feedback',
        });

        await queryInterface.addIndex('ViewerCarouselFeedbacks', ['viewerId', 'updatedAt'], {
            name: 'idx_viewer_carousel_feedbacks_viewer_updated_at',
        });

        await queryInterface.addIndex('ViewerCarouselFeedbacks', ['carouselId', 'rating'], {
            name: 'idx_viewer_carousel_feedbacks_carousel_rating',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ViewerCarouselFeedbacks');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_ViewerCarouselFeedbacks_rating";');
    },
};
