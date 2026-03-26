'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add new columns to Carousel table
        await queryInterface.addColumn('Carousels', 'flaggedReason', {
            type: Sequelize.STRING,
            allowNull: true,
            comment: 'Reason why the carousel was flagged'
        });

        await queryInterface.addColumn('Carousels', 'additionalReason', {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Additional details about the flagged content'
        });

        await queryInterface.addColumn('Carousels', 'adminApproved', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            comment: 'Whether the carousel has been approved by admin'
        });

        await queryInterface.addColumn('Carousels', 'temporaryUnpublishStatus', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            comment: 'Flag to indicate if carousel is temporarily unpublished'
        });

        await queryInterface.addColumn('Carousels', 'temporaryUnpublishStartDate', {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'Start date for temporary unpublish'
        });

        await queryInterface.addColumn('Carousels', 'temporaryUnpublishEndDate', {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'End date for temporary unpublish'
        });

        await queryInterface.addColumn('Carousels', 'temporaryUnpublishReason', {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Reason for temporary unpublishing'
        });

        await queryInterface.addColumn('Carousels', 'removalReason', {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Reason for removal of the carousel'
        });

        // Update the status ENUM to include 'flagged'
        // Drop the old enum type and create a new one
        //  await queryInterface.sequelize.query('ALTER TYPE "enum_Carousels_status" ADD VALUE \'flagged\';');
    },

    async down(queryInterface, Sequelize) {
        // Remove all added columns first
        await queryInterface.removeColumn('Carousels', 'flaggedReason');
        await queryInterface.removeColumn('Carousels', 'additionalReason');
        await queryInterface.removeColumn('Carousels', 'adminApproved');
        await queryInterface.removeColumn('Carousels', 'temporaryUnpublishStatus');
        await queryInterface.removeColumn('Carousels', 'temporaryUnpublishStartDate');
        await queryInterface.removeColumn('Carousels', 'temporaryUnpublishEndDate');
        await queryInterface.removeColumn('Carousels', 'temporaryUnpublishReason');
        await queryInterface.removeColumn('Carousels', 'removalReason');

        // Note: Removing a value from a PostgreSQL ENUM is complex
        // If you need to fully revert, you would need to recreate the ENUM type
        // For now, the old enum values can coexist
    }
};
