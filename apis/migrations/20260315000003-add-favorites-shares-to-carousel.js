'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Carousels', 'numberOfFavorites', {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: 'Number of times this carousel has been favorited'
        });
        await queryInterface.addColumn('Carousels', 'numberOfShares', {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: 'Number of times this carousel has been shared'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Carousels', 'numberOfFavorites');
        await queryInterface.removeColumn('Carousels', 'numberOfShares');
    }
};
