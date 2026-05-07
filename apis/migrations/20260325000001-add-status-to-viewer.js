'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Viewers', 'status', {
            type: Sequelize.ENUM('active', 'suspended', 'banned'),
            defaultValue: 'active',
            allowNull: false,
            comment: 'Viewer account status: active, suspended, or banned'
        });

        await queryInterface.addColumn('Viewers', 'suspensionStartDate', {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'Start date of suspension'
        });

        await queryInterface.addColumn('Viewers', 'suspensionEndDate', {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'End date of suspension'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Viewers', 'suspensionEndDate');
        await queryInterface.removeColumn('Viewers', 'suspensionStartDate');
        await queryInterface.removeColumn('Viewers', 'status');
    }
};
