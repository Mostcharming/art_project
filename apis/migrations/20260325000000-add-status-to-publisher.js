'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Publishers', 'status', {
            type: Sequelize.ENUM('active', 'suspended', 'banned'),
            defaultValue: 'active',
            allowNull: false,
            comment: 'Publisher account status: active, suspended, or banned'
        });

        await queryInterface.addColumn('Publishers', 'suspensionStartDate', {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'Start date of suspension'
        });

        await queryInterface.addColumn('Publishers', 'suspensionEndDate', {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'End date of suspension'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Publishers', 'suspensionEndDate');
        await queryInterface.removeColumn('Publishers', 'suspensionStartDate');
        await queryInterface.removeColumn('Publishers', 'status');
    }
};
