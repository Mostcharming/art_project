'use strict';
module.exports = (sequelize, DataTypes) => sequelize.define('ViewerBlock', {
    viewerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Viewers', key: 'id' }, onDelete: 'CASCADE' },
    publisherId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Publishers', key: 'id' }, onDelete: 'CASCADE' },
}, { indexes: [{ unique: true, fields: ['viewerId', 'publisherId'] }] });
