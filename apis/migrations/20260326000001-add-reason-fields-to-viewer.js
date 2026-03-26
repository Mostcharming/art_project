'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Viewers', 'reasonForSuspension', {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Reason for viewer account suspension'
        });

        await queryInterface.addColumn('Viewers', 'reasonForBan', {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Reason for viewer account ban'
        });

        await queryInterface.addColumn('Viewers', 'reasonForReactivation', {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Reason for reactivating viewer account'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Viewers', 'reasonForReactivation');
        await queryInterface.removeColumn('Viewers', 'reasonForBan');
        await queryInterface.removeColumn('Viewers', 'reasonForSuspension');
    }
};
