'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Publishers', 'reasonForSuspension', {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Reason for publisher account suspension'
        });

        await queryInterface.addColumn('Publishers', 'reasonForBan', {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Reason for publisher account ban'
        });

        await queryInterface.addColumn('Publishers', 'reasonForReactivation', {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Reason for reactivating publisher account'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Publishers', 'reasonForReactivation');
        await queryInterface.removeColumn('Publishers', 'reasonForBan');
        await queryInterface.removeColumn('Publishers', 'reasonForSuspension');
    }
};
