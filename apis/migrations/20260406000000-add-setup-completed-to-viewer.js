'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Viewers', 'setupCompleted', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
            comment: 'Indicates if profile setup (styles, vibe preference, app usage) is complete'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Viewers', 'setupCompleted');
    }
};
