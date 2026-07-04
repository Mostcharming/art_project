'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Viewers', 'accessibilityPreferences', {
            type: Sequelize.JSONB,
            allowNull: true,
            comment: 'Viewer accessibility preference settings',
        });

        await queryInterface.addColumn('Viewers', 'accessibilityPreferencesUpdatedAt', {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'Timestamp when accessibility preferences were last saved',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Viewers', 'accessibilityPreferencesUpdatedAt');
        await queryInterface.removeColumn('Viewers', 'accessibilityPreferences');
    },
};
