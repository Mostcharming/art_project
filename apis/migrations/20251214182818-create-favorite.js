'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Favorites', {
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
      artworkId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      artistId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      favoriteType: {
        type: Sequelize.ENUM('artwork', 'artist'),
        allowNull: false
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
    await queryInterface.dropTable('Favorites');
  }
};