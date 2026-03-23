'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add a Custom role with no privileges attached yet
        await queryInterface.bulkInsert('Roles', [
            {
                name: 'Custom',
                description: 'Custom role for flexible permission assignment',
                isDefault: false,
                isCustom: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        // Remove the Custom role
        await queryInterface.bulkDelete('Roles', { name: 'Custom' });
    }
};
