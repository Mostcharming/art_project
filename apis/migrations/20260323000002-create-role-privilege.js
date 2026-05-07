'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('RolePrivileges', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            roleId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Roles',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            privilegeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Privileges',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Add unique constraint on roleId and privilegeId combination
        await queryInterface.addConstraint('RolePrivileges', {
            fields: ['roleId', 'privilegeId'],
            type: 'unique',
            name: 'unique_role_privilege'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('RolePrivileges');
    }
};
