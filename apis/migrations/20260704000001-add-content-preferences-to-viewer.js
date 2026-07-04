'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Viewers', 'contentPreferences', {
            type: Sequelize.JSONB,
            allowNull: true,
            comment: 'Viewer content preference settings',
        });

        await queryInterface.addColumn('Viewers', 'contentPreferencesUpdatedAt', {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'Timestamp when content preferences were last saved',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Viewers', 'contentPreferencesUpdatedAt');
        await queryInterface.removeColumn('Viewers', 'contentPreferences');
    },
};
