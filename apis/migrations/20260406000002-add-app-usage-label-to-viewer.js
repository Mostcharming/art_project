'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Viewers', 'appUsageLabel', {
            type: Sequelize.STRING,
            allowNull: true,
            comment: 'Display label for viewer app usage preference',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Viewers', 'appUsageLabel');
    },
};
