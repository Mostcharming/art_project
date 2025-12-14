'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ViewerStyles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      viewerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Viewers',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      styleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Styles',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('ViewerStyles');
  }
};