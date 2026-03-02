'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Admins', 'loginToken', {
            type: Sequelize.STRING,
            allowNull: true,
            comment: '4-digit login token sent to email'
        });

        await queryInterface.addColumn('Admins', 'loginTokenExpires', {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'Expiration time for login token'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Admins', 'loginToken');
        await queryInterface.removeColumn('Admins', 'loginTokenExpires');
    }
};
