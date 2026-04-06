'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Viewers', 'emailVerifiedAt', {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'Timestamp when email was verified'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Viewers', 'emailVerifiedAt');
    }
};
