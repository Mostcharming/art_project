'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Carousels', 'flaggedCount', {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: 'Number of times this carousel has been flagged'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Carousels', 'flaggedCount');
    }
};
