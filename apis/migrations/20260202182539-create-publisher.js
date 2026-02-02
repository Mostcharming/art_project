'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Publishers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            verificationToken: {
                type: Sequelize.STRING,
                allowNull: true,
                comment: '4-digit verification code'
            },
            verificationTokenExpires: {
                type: Sequelize.DATE,
                allowNull: true
            },
            isEmailVerified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                comment: 'Email verification status'
            },
            accountSetupComplete: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                comment: 'Marks if profile setup is complete'
            },
            personaType: {
                type: Sequelize.STRING,
                allowNull: true,
                comment: 'Type of publisher persona'
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true,
                comment: 'Publisher name or business name'
            },
            country: {
                type: Sequelize.STRING,
                allowNull: true,
                comment: 'Publisher country'
            },
            bio: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Publisher bio'
            },
            resetPasswordToken: {
                type: Sequelize.STRING,
                allowNull: true
            },
            resetPasswordTokenExpires: {
                type: Sequelize.DATE,
                allowNull: true
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
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Publishers');
    }
};
