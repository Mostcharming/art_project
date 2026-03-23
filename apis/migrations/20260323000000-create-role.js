'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Roles', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                comment: 'Name of the role'
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Description of the role'
            },
            isDefault: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                comment: 'Whether this is a default system role'
            },
            isCustom: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                comment: 'Whether this is a custom role'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Roles');
    }
};
