'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Artworks', 'imageUrl', {
            type: Sequelize.STRING,
            allowNull: true,
            comment: 'URL or path to the artwork image file'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Artworks', 'imageUrl');
    }
};
