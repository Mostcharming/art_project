"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("PublisherSettings", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            publisherId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Publishers",
                    key: "id"
                },
                onDelete: "CASCADE"
            },
            carouselFrameTiming: {
                type: Sequelize.INTEGER, // seconds
                allowNull: false,
                validate: {
                    min: 10,
                    max: 300
                }
            },
            pushNotifications: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("PublisherSettings");
    }
};
