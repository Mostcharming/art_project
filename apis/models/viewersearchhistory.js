'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ViewerSearchHistory extends Model {
        static associate(models) {
            ViewerSearchHistory.belongsTo(models.Viewer, {
                foreignKey: 'viewerId',
                as: 'viewer'
            });
        }
    }

    ViewerSearchHistory.init({
        viewerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Viewers',
                key: 'id'
            }
        },
        query: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Viewer-facing search query'
        },
        normalizedQuery: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Normalized search query for de-duplication'
        },
        searchCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Number of times this viewer has searched this query'
        }
    }, {
        sequelize,
        modelName: 'ViewerSearchHistory',
    });

    return ViewerSearchHistory;
};
