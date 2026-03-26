'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Viewers', 'website', {
            type: Sequelize.STRING,
            allowNull: true,
            comment: 'Viewer website URL'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Viewers', 'website');
    }
};
