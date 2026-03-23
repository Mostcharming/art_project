'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Admins', 'roleId', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Roles',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            comment: 'Foreign key to Role table'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Admins', 'roleId');
    }
};
