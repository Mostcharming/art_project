'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(async transaction => {
            const timestamps = () => ({
                createdAt: { type: Sequelize.DATE, allowNull: false },
                updatedAt: { type: Sequelize.DATE, allowNull: false },
            });
            for (const table of ['Publishers', 'Viewers']) {
                await queryInterface.addColumn(table, 'termsVersion', { type: Sequelize.STRING, allowNull: true }, { transaction });
                await queryInterface.addColumn(table, 'termsAcceptedAt', { type: Sequelize.DATE, allowNull: true }, { transaction });
            }
            await queryInterface.createTable('AccountDeletionRequests', {
                id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
                email: { type: Sequelize.STRING, allowNull: true },
                accountType: { type: Sequelize.STRING, allowNull: false },
                codeHash: { type: Sequelize.STRING, allowNull: true },
                attempts: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
                expiresAt: { type: Sequelize.DATE, allowNull: false },
                targets: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
                pendingFiles: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
                status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'pending' },
                completedAt: { type: Sequelize.DATE, allowNull: true },
                ...timestamps(),
            }, { transaction });
            await queryInterface.addIndex('AccountDeletionRequests', ['email', 'createdAt'], { transaction });
            await queryInterface.createTable('ViewerBlocks', {
                id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
                viewerId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Viewers', key: 'id' }, onDelete: 'CASCADE' },
                publisherId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Publishers', key: 'id' }, onDelete: 'CASCADE' },
                ...timestamps(),
            }, { transaction });
            await queryInterface.addIndex('ViewerBlocks', ['viewerId', 'publisherId'], { unique: true, transaction });
            await queryInterface.createTable('ContentReports', {
                id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
                viewerId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'Viewers', key: 'id' }, onDelete: 'SET NULL' },
                publisherId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Publishers', key: 'id' }, onDelete: 'CASCADE' },
                carouselId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'Carousels', key: 'id' }, onDelete: 'CASCADE' },
                reason: { type: Sequelize.STRING, allowNull: false },
                details: { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
                status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'open' },
                resolution: { type: Sequelize.TEXT, allowNull: true },
                reviewedAt: { type: Sequelize.DATE, allowNull: true },
                reviewedBy: { type: Sequelize.INTEGER, allowNull: true },
                ...timestamps(),
            }, { transaction });
            await queryInterface.addIndex('ContentReports', ['status', 'createdAt'], { transaction });
        });
    },
    async down(queryInterface) {
        return queryInterface.sequelize.transaction(async transaction => {
            await queryInterface.dropTable('ContentReports', { transaction });
            await queryInterface.dropTable('ViewerBlocks', { transaction });
            await queryInterface.dropTable('AccountDeletionRequests', { transaction });
            for (const table of ['Publishers', 'Viewers']) {
                await queryInterface.removeColumn(table, 'termsAcceptedAt', { transaction });
                await queryInterface.removeColumn(table, 'termsVersion', { transaction });
            }
        });
    },
};
