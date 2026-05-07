'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Publishers', 'website', {
            type: Sequelize.STRING,
            allowNull: true,
            comment: 'Publisher website URL'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Publishers', 'website');
    }
};
