'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Carousels', 'unflaggedReason', {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Reason for removing flagged status'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Carousels', 'unflaggedReason');
    }
};
