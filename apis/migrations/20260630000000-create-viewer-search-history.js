'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ViewerSearchHistories', {
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
            query: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: 'Viewer-facing search query',
            },
            normalizedQuery: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: 'Normalized search query for de-duplication',
            },
            searchCount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
                comment: 'Number of times this viewer has searched this query',
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

        await queryInterface.addConstraint('ViewerSearchHistories', {
            fields: ['viewerId', 'normalizedQuery'],
            type: 'unique',
            name: 'unique_viewer_search_history_query',
        });

        await queryInterface.addIndex('ViewerSearchHistories', ['viewerId', 'updatedAt'], {
            name: 'idx_viewer_search_histories_viewer_recent',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ViewerSearchHistories');
    },
};
