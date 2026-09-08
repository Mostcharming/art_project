'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(async transaction => {
            // Development sync may have created these tables/indexes before migrations ran.
            const existingTables = new Set(await queryInterface.showAllTables({ transaction }));
            const ensureTable = async (table, attributes) => {
                if (!existingTables.has(table)) {
                    await queryInterface.createTable(table, attributes, { transaction });
                }
            };
            const ensureIndex = async (table, fields, options = {}) => {
                const indexes = await queryInterface.showIndex(table, { transaction });
                const exists = indexes.some(index =>
                    Boolean(index.unique) === Boolean(options.unique) &&
                    index.fields.length === fields.length &&
                    index.fields.every((field, position) => field.attribute === fields[position])
                );
                if (!exists) {
                    await queryInterface.addIndex(table, fields, { ...options, transaction });
                }
            };
            const timestamps = () => ({
                createdAt: { type: Sequelize.DATE, allowNull: false },
                updatedAt: { type: Sequelize.DATE, allowNull: false },
            });
            for (const table of ['Publishers', 'Viewers']) {
                const columns = await queryInterface.describeTable(table, { transaction });
                if (!columns.termsVersion) {
                    await queryInterface.addColumn(table, 'termsVersion', { type: Sequelize.STRING, allowNull: true }, { transaction });
                }
                if (!columns.termsAcceptedAt) {
                    await queryInterface.addColumn(table, 'termsAcceptedAt', { type: Sequelize.DATE, allowNull: true }, { transaction });
                }
            }
            await ensureTable('AccountDeletionRequests', {
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
            });
            await ensureIndex('AccountDeletionRequests', ['email', 'createdAt']);
            await ensureTable('ViewerBlocks', {
                id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
                viewerId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Viewers', key: 'id' }, onDelete: 'CASCADE' },
                publisherId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Publishers', key: 'id' }, onDelete: 'CASCADE' },
                ...timestamps(),
            });
            await ensureIndex('ViewerBlocks', ['viewerId', 'publisherId'], { unique: true });
            await ensureTable('ContentReports', {
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
            });
            await ensureIndex('ContentReports', ['status', 'createdAt']);
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
