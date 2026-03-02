'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Admins', {
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
      firstName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      role: {
        type: Sequelize.ENUM('superadmin', 'admin', 'moderator'),
        defaultValue: 'admin',
        comment: 'Role of the admin user'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Whether the admin account is active'
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      resetPasswordTokenExpires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      lastLoginAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Timestamp of last login'
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
    await queryInterface.dropTable('Admins');
  }
};
