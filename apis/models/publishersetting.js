"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class PublisherSetting extends Model {
        static associate(models) {
            PublisherSetting.belongsTo(models.Publisher, {
                foreignKey: "publisherId",
                as: "publisher"
            });
        }
    }
    PublisherSetting.init(
        {
            publisherId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Publishers",
                    key: "id"
                },
                onDelete: "CASCADE"
            },
            carouselFrameTiming: {
                type: DataTypes.INTEGER, // store seconds
                allowNull: false,
                validate: {
                    min: 10,
                    max: 300
                }
            },
            pushNotifications: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        },
        {
            sequelize,
            modelName: "PublisherSetting",
            tableName: "PublisherSettings"
        }
    );
    return PublisherSetting;
};
