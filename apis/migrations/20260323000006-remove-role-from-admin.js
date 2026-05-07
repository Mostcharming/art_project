'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Remove the role ENUM column from Admins table
        await queryInterface.removeColumn('Admins', 'role');
    },

    async down(queryInterface, Sequelize) {
        // Restore the role ENUM column if migration is rolled back
        await queryInterface.addColumn('Admins', 'role', {
            type: Sequelize.ENUM('superadmin', 'admin', 'moderator'),
            defaultValue: 'admin',
            comment: 'Role of the admin user'
        });
    }
};
