'use strict';
module.exports = (sequelize, DataTypes) => sequelize.define('AccountDeletionRequest', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    email: { type: DataTypes.STRING, allowNull: true },
    accountType: { type: DataTypes.STRING, allowNull: false },
    codeHash: { type: DataTypes.STRING, allowNull: true },
    attempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    targets: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    pendingFiles: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
    completedAt: { type: DataTypes.DATE, allowNull: true },
});
