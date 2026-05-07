'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Change scheduledPublishDate from DATE to DATETIME to include time
        await queryInterface.changeColumn('Carousels', 'scheduledPublishDate', {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'Date and time when scheduled carousel should be published'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('Carousels', 'scheduledPublishDate', {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'Date when scheduled carousel should be published'
        });
    }
};
