'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Viewers', 'profilePicture', {
            type: Sequelize.STRING,
            allowNull: true,
            comment: 'URL to viewer profile picture'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Viewers', 'profilePicture');
    }
};
