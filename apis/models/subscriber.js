'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Subscriber extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Subscriber.belongsTo(models.Viewer, {
                foreignKey: 'viewerId',
                as: 'viewer'
            });
            Subscriber.belongsTo(models.Publisher, {
                foreignKey: 'publisherId',
                as: 'publisher'
            });
        }
    }

    Subscriber.init({
        viewerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Viewers',
                key: 'id'
            }
        },
        publisherId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Publishers',
                key: 'id'
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Whether the subscription is still active'
        },
        subscribedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            comment: 'Timestamp when the viewer subscribed'
        },
        removedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Timestamp when the viewer unsubscribed or subscription was removed'
        },
        subscriptionType: {
            type: DataTypes.STRING,
            defaultValue: 'free',
            comment: 'Type of subscription (e.g., free, premium)'
        }
    }, {
        sequelize,
        modelName: 'Subscriber',
    });

    return Subscriber;
};
