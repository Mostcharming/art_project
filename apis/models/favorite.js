'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Favorite.belongsTo(models.Viewer, {
        foreignKey: 'viewerId',
        as: 'viewer'
      });
    }
  }
  Favorite.init({
    viewerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Viewers',
        key: 'id'
      }
    },
    artworkId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID of the artwork being favorited'
    },
    artistId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID of the artist being favorited'
    },
    favoriteType: {
      type: DataTypes.ENUM('artwork', 'artist'),
      allowNull: false,
      comment: 'Type of favorite: artwork or artist'
    }
  }, {
    sequelize,
    modelName: 'Favorite',
  });
  return Favorite;
};