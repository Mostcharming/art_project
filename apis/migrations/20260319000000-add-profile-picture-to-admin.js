'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Admins', 'profilePicture', {
            type: Sequelize.STRING,
            allowNull: true,
            comment: 'URL or path to admin profile picture'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Admins', 'profilePicture');
    }
};
