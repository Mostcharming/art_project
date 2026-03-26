'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Publishers', 'profilePicture', {
            type: Sequelize.STRING,
            allowNull: true,
            comment: 'URL to publisher profile picture'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Publishers', 'profilePicture');
    }
};
