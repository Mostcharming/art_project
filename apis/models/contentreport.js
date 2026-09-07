'use strict';
module.exports = (sequelize, DataTypes) => sequelize.define('ContentReport', {
    viewerId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Viewers', key: 'id' }, onDelete: 'SET NULL' },
    publisherId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Publishers', key: 'id' }, onDelete: 'CASCADE' },
    carouselId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Carousels', key: 'id' }, onDelete: 'CASCADE' },
    reason: { type: DataTypes.STRING, allowNull: false },
    details: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'open' },
    resolution: { type: DataTypes.TEXT, allowNull: true },
    reviewedAt: { type: DataTypes.DATE, allowNull: true },
    reviewedBy: { type: DataTypes.INTEGER, allowNull: true },
}, { indexes: [{ fields: ['status', 'createdAt'] }] });
